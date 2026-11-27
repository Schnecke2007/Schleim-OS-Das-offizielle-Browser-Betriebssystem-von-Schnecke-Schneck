package de.schneckeschneck.schleimos

import android.content.Context
import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import android.util.Base64
import com.wireguard.android.backend.GoBackend
import com.wireguard.android.backend.Tunnel
import com.wireguard.config.Config
import java.io.BufferedReader
import java.io.StringReader
import java.security.KeyStore
import javax.crypto.Cipher
import javax.crypto.KeyGenerator
import javax.crypto.SecretKey
import javax.crypto.spec.GCMParameterSpec

/**
 * Native, browser-scoped WireGuard manager.
 *
 * WireGuard profiles are imported by the user and stored encrypted with an
 * Android Keystore AES-GCM key. No profile/private key is shipped in the APK.
 */
class BrowserVpnManager(context: Context) {
    private val appContext = context.applicationContext
    private val preferences = appContext.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
    private val backend = GoBackend(appContext)
    @Volatile private var currentState = Tunnel.State.DOWN

    private val tunnel = object : Tunnel {
        override fun getName(): String = TUNNEL_NAME
        override fun onStateChange(newState: Tunnel.State) {
            currentState = newState
        }
    }

    fun profileNames(): List<String> = preferences.all.keys
        .filter { it.startsWith(PROFILE_PREFIX) }
        .map { it.removePrefix(PROFILE_PREFIX) }
        .sortedWith(String.CASE_INSENSITIVE_ORDER)

    fun saveProfile(displayName: String, configText: String): String {
        val name = displayName.trim().replace(Regex("[\\\\/:*?\"<>|]"), "_")
            .take(48).ifBlank { "WireGuard-Profil" }
        require(configText.contains(Regex("(?im)^\\s*\\[Interface\\]\\s*$"))) {
            "Die Datei enthält keinen WireGuard-[Interface]-Abschnitt."
        }
        require(configText.contains(Regex("(?im)^\\s*PrivateKey\\s*="))) {
            "Die WireGuard-Konfiguration enthält keinen PrivateKey."
        }
        // Parse before persisting, so malformed or unsupported configs are rejected.
        parseConfig(configText)
        val encrypted = encrypt(name, configText)
        preferences.edit().putString(PROFILE_PREFIX + name, encrypted).apply()
        return name
    }

    fun deleteProfile(name: String) {
        preferences.edit().remove(PROFILE_PREFIX + name).apply()
    }

    fun isConnected(): Boolean = try {
        backend.getState(tunnel) == Tunnel.State.UP || currentState == Tunnel.State.UP
    } catch (_: Exception) {
        currentState == Tunnel.State.UP
    }

    fun connectedProfile(): String? = preferences.getString(KEY_CONNECTED_PROFILE, null)

    fun connect(profileName: String) {
        val encrypted = preferences.getString(PROFILE_PREFIX + profileName, null)
            ?: throw IllegalStateException("Dieses VPN-Profil ist nicht mehr vorhanden.")
        val original = decrypt(profileName, encrypted)
        val browserOnly = restrictToBrowser(original)
        val config = parseConfig(browserOnly)
        backend.setState(tunnel, Tunnel.State.UP, config)
        currentState = Tunnel.State.UP
        preferences.edit().putString(KEY_CONNECTED_PROFILE, profileName).apply()
    }

    fun disconnect() {
        backend.setState(tunnel, Tunnel.State.DOWN, null)
        currentState = Tunnel.State.DOWN
        preferences.edit().remove(KEY_CONNECTED_PROFILE).apply()
    }

    private fun restrictToBrowser(source: String): String {
        val lines = source.lines().filterNot {
            it.trim().startsWith("IncludedApplications", true) ||
                it.trim().startsWith("ExcludedApplications", true)
        }.toMutableList()
        val interfaceIndex = lines.indexOfFirst { it.trim().equals("[Interface]", true) }
        require(interfaceIndex >= 0) { "WireGuard-[Interface]-Abschnitt fehlt." }
        lines.add(interfaceIndex + 1, "IncludedApplications = ${appContext.packageName}")
        return lines.joinToString("\n")
    }

    private fun parseConfig(text: String): Config =
        Config.parse(BufferedReader(StringReader(text)))

    private fun encrypt(profileName: String, plainText: String): String {
        val cipher = Cipher.getInstance("AES/GCM/NoPadding")
        cipher.init(Cipher.ENCRYPT_MODE, getOrCreateKey())
        cipher.updateAAD(profileName.toByteArray(Charsets.UTF_8))
        val encrypted = cipher.doFinal(plainText.toByteArray(Charsets.UTF_8))
        return Base64.encodeToString(cipher.iv + encrypted, Base64.NO_WRAP)
    }

    private fun decrypt(profileName: String, encoded: String): String {
        val combined = Base64.decode(encoded, Base64.NO_WRAP)
        require(combined.size > GCM_IV_BYTES) { "Gespeichertes VPN-Profil ist beschädigt." }
        val iv = combined.copyOfRange(0, GCM_IV_BYTES)
        val encrypted = combined.copyOfRange(GCM_IV_BYTES, combined.size)
        val cipher = Cipher.getInstance("AES/GCM/NoPadding")
        cipher.init(Cipher.DECRYPT_MODE, getOrCreateKey(), GCMParameterSpec(GCM_TAG_BITS, iv))
        cipher.updateAAD(profileName.toByteArray(Charsets.UTF_8))
        return String(cipher.doFinal(encrypted), Charsets.UTF_8)
    }

    private fun getOrCreateKey(): SecretKey {
        val keyStore = KeyStore.getInstance(ANDROID_KEYSTORE).apply { load(null) }
        (keyStore.getKey(KEY_ALIAS, null) as? SecretKey)?.let { return it }
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
        private const val PREFS = "schleim_browser_vpn_profiles"
        private const val PROFILE_PREFIX = "profile:"
        private const val KEY_CONNECTED_PROFILE = "connected_profile"
        private const val KEY_ALIAS = "schleim_browser_wireguard_profile_key"
        private const val ANDROID_KEYSTORE = "AndroidKeyStore"
        private const val TUNNEL_NAME = "Schleim Browser"
        private const val GCM_IV_BYTES = 12
        private const val GCM_TAG_BITS = 128
    }
}
