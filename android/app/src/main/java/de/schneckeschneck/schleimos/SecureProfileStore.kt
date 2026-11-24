package de.schneckeschneck.schleimos

import android.content.Context
import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import android.util.Base64
import org.json.JSONObject
import java.security.KeyStore
import java.security.SecureRandom
import javax.crypto.Cipher
import javax.crypto.KeyGenerator
import javax.crypto.SecretKey
import javax.crypto.SecretKeyFactory
import javax.crypto.spec.GCMParameterSpec
import javax.crypto.spec.PBEKeySpec
import javax.crypto.spec.SecretKeySpec

/**
 * Encrypts local browser secrets with a non-exportable Android Keystore AES key.
 * Cross-device backups use a separate passphrase-derived AES-GCM key so the
 * receiving device can decrypt the backup without exporting this device's key.
 */
class SecureProfileStore(context: Context) {
    private val prefs = context.applicationContext.getSharedPreferences("schleim_browser_secure_v1", Context.MODE_PRIVATE)

    fun putString(name: String, value: String) {
        val cipher = Cipher.getInstance(TRANSFORMATION)
        cipher.init(Cipher.ENCRYPT_MODE, getOrCreateKey())
        val ciphertext = cipher.doFinal(value.toByteArray(Charsets.UTF_8))
        val packed = JSONObject()
            .put("iv", Base64.encodeToString(cipher.iv, Base64.NO_WRAP))
            .put("data", Base64.encodeToString(ciphertext, Base64.NO_WRAP))
        check(prefs.edit().putString(name, packed.toString()).commit()) { "Secure storage write failed." }
    }

    fun getString(name: String): String? {
        val packed = prefs.getString(name, null) ?: return null
        val item = JSONObject(packed)
        val iv = Base64.decode(item.getString("iv"), Base64.NO_WRAP)
        val ciphertext = Base64.decode(item.getString("data"), Base64.NO_WRAP)
        val cipher = Cipher.getInstance(TRANSFORMATION)
        cipher.init(Cipher.DECRYPT_MODE, getOrCreateKey(), GCMParameterSpec(128, iv))
        return String(cipher.doFinal(ciphertext), Charsets.UTF_8)
    }

    fun remove(name: String) {
        prefs.edit().remove(name).apply()
    }

    fun has(name: String): Boolean = prefs.contains(name)

    private fun getOrCreateKey(): SecretKey {
        val store = KeyStore.getInstance(ANDROID_KEYSTORE).apply { load(null) }
        (store.getKey(KEY_ALIAS, null) as? SecretKey)?.let { return it }
        val generator = KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, ANDROID_KEYSTORE)
        generator.init(
            KeyGenParameterSpec.Builder(
                KEY_ALIAS,
                KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT
            )
                .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
                .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
                .setRandomizedEncryptionRequired(true)
                .build()
        )
        return generator.generateKey()
    }

    companion object {
        private const val ANDROID_KEYSTORE = "AndroidKeyStore"
        private const val KEY_ALIAS = "schleim_browser_profile_key_v1"
        private const val TRANSFORMATION = "AES/GCM/NoPadding"
        private const val BACKUP_KDF = "PBKDF2WithHmacSHA256"
        private const val BACKUP_ITERATIONS = 180_000
        private const val BACKUP_KEY_BITS = 256

        fun encryptBackup(plain: ByteArray, passphrase: String): JSONObject {
            require(passphrase.length >= 12) { "Das Backup-Passwort muss mindestens 12 Zeichen lang sein." }
            val random = SecureRandom()
            val salt = ByteArray(16).also(random::nextBytes)
            val iv = ByteArray(12).also(random::nextBytes)
            val key = deriveBackupKey(passphrase, salt)
            val cipher = Cipher.getInstance(TRANSFORMATION)
            cipher.init(Cipher.ENCRYPT_MODE, key, GCMParameterSpec(128, iv))
            val ciphertext = cipher.doFinal(plain)
            return JSONObject()
                .put("format", "schleim-browser-encrypted-profile")
                .put("schemaVersion", 1)
                .put("cipher", "AES-256-GCM")
                .put("kdf", BACKUP_KDF)
                .put("iterations", BACKUP_ITERATIONS)
                .put("salt", Base64.encodeToString(salt, Base64.NO_WRAP))
                .put("iv", Base64.encodeToString(iv, Base64.NO_WRAP))
                .put("ciphertext", Base64.encodeToString(ciphertext, Base64.NO_WRAP))
        }

        fun decryptBackup(envelope: JSONObject, passphrase: String): ByteArray {
            require(envelope.optString("format") == "schleim-browser-encrypted-profile") {
                "Die Sicherungsdatei hat ein unbekanntes Format."
            }
            require(envelope.optInt("schemaVersion") == 1 && envelope.optString("cipher") == "AES-256-GCM" &&
                envelope.optString("kdf") == BACKUP_KDF
            ) { "Die Verschlüsselungsdaten der Sicherung werden nicht unterstützt." }
            val iterations = envelope.optInt("iterations", 0)
            require(iterations in 100_000..500_000) { "Ungültige Schlüsselableitung in der Sicherung." }
            val salt = Base64.decode(envelope.getString("salt"), Base64.NO_WRAP)
            val iv = Base64.decode(envelope.getString("iv"), Base64.NO_WRAP)
            val encrypted = Base64.decode(envelope.getString("ciphertext"), Base64.NO_WRAP)
            require(salt.size == 16 && iv.size == 12 && encrypted.size >= 16) {
                "Die verschlüsselte Sicherung ist beschädigt."
            }
            val key = deriveBackupKey(passphrase, salt, iterations)
            val cipher = Cipher.getInstance(TRANSFORMATION)
            cipher.init(Cipher.DECRYPT_MODE, key, GCMParameterSpec(128, iv))
            return cipher.doFinal(encrypted)
        }

        private fun deriveBackupKey(passphrase: String, salt: ByteArray, iterations: Int = BACKUP_ITERATIONS): SecretKeySpec {
            val spec = PBEKeySpec(passphrase.toCharArray(), salt, iterations, BACKUP_KEY_BITS)
            return try {
                val bytes = SecretKeyFactory.getInstance(BACKUP_KDF).generateSecret(spec).encoded
                SecretKeySpec(bytes, "AES")
            } finally {
                spec.clearPassword()
            }
        }
    }
}
