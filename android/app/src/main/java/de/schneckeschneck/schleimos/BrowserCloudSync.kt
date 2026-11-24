package de.schneckeschneck.schleimos

import android.util.Base64
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL
import java.net.URLEncoder
import java.nio.charset.StandardCharsets

/**
 * Native counterpart of the Schleim OS account flow used by extension/scripts/schleim-account.js.
 * It uses the public GitHub App Device Flow; it never asks for or stores a GitHub account password.
 */
class BrowserCloudSync(private val secureStore: SecureProfileStore) {
    data class DeviceCode(
        val deviceCode: String,
        val userCode: String,
        val verificationUri: String,
        val intervalSeconds: Int,
        val expiresAtMillis: Long
    )

    data class Account(
        val login: String,
        val name: String,
        val email: String,
        val repository: String,
        val repositoryUrl: String,
        val lastBackupAt: String
    )

    fun beginDeviceFlow(): DeviceCode {
        val data = oauthPost(
            DEVICE_CODE_URL,
            mapOf("client_id" to GITHUB_APP_CLIENT_ID, "scope" to "offline_access")
        )
        if (data.optString("device_code").isBlank() || data.optString("user_code").isBlank()) {
            throw IllegalStateException(data.optString("error_description", "GitHub-Anmeldung konnte nicht gestartet werden."))
        }
        val expires = data.optInt("expires_in", 900).coerceAtLeast(60)
        return DeviceCode(
            deviceCode = data.getString("device_code"),
            userCode = data.getString("user_code"),
            verificationUri = data.optString("verification_uri", DEVICE_VERIFY_URL),
            intervalSeconds = data.optInt("interval", 5).coerceAtLeast(5),
            expiresAtMillis = System.currentTimeMillis() + expires * 1000L
        )
    }

    /** One OAuth polling request. The caller handles authorization_pending / slow_down. */
    fun pollDeviceFlow(code: DeviceCode): JSONObject =
        oauthPost(
            TOKEN_URL,
            mapOf(
                "client_id" to GITHUB_APP_CLIENT_ID,
                "device_code" to code.deviceCode,
                "grant_type" to DEVICE_GRANT
            )
        )

    fun completeLogin(tokenResponse: JSONObject): Account {
        val accessToken = tokenResponse.optString("access_token")
        require(accessToken.isNotBlank()) { "GitHub hat kein Zugriffstoken zurückgegeben." }

        val session = JSONObject()
            .put("accessToken", accessToken)
            .put("refreshToken", tokenResponse.optString("refresh_token"))
            .put("expiresAt", System.currentTimeMillis() + tokenResponse.optLong("expires_in", 28_800) * 1000L)
            .put("refreshExpiresAt", System.currentTimeMillis() + tokenResponse.optLong("refresh_token_expires_in", 0) * 1000L)

        val user = githubApi(session, "/user")
        val emails = githubApi(session, "/user/emails?per_page=100")
        val emailArray = emails.optJSONArray("items")
        var verifiedEmail = ""
        if (emailArray != null) {
            for (i in 0 until emailArray.length()) {
                val item = emailArray.optJSONObject(i) ?: continue
                if (item.optBoolean("primary") && item.optBoolean("verified")) {
                    verifiedEmail = item.optString("email")
                    break
                }
            }
        }
        val login = user.optString("login")
        val userId = user.optLong("id")
        require(login.isNotBlank() && userId > 0) { "GitHub-Kontodaten konnten nicht gelesen werden." }
        require(verifiedEmail.isNotBlank()) {
            "Dein GitHub-Konto benötigt eine verifizierte primäre E-Mail-Adresse."
        }

        val installations = githubApi(session, "/user/installations?per_page=100").optJSONArray("installations")
        var installed = false
        if (installations != null) {
            for (i in 0 until installations.length()) {
                if (installations.optJSONObject(i)?.optString("app_slug") == GITHUB_APP_SLUG) {
                    installed = true
                    break
                }
            }
        }
        require(installed) {
            "Bitte installiere zuerst „Schleim OS Account“ in deinem GitHub-Konto und starte die Anmeldung erneut."
        }

        var repo = try {
            githubApi(session, "/repos/$login/$REPOSITORY_NAME")
        } catch (error: Exception) {
            if (!error.message.orEmpty().contains("HTTP 404")) throw error
            githubApi(
                session,
                "/user/repos",
                "POST",
                JSONObject()
                    .put("name", REPOSITORY_NAME)
                    .put("description", "Private Schleim OS cloud repository for user settings and encrypted browser profile backups.")
                    .put("private", true)
                    .put("auto_init", true)
                    .put("has_issues", false)
                    .put("has_projects", false)
                    .put("has_wiki", false)
            )
        }
        require(repo.optBoolean("private")) {
            "Das Repository $REPOSITORY_NAME ist nicht privat. Aus Sicherheitsgründen wird es nicht verwendet."
        }
        require(repo.optJSONObject("owner")?.optLong("id") == userId) {
            "Das Backup-Repository gehört nicht zum angemeldeten GitHub-Konto."
        }

        session.put("userId", userId)
            .put("login", login)
            .put("name", user.optString("name", login))
            .put("email", verifiedEmail)
            .put("repository", repo.optString("full_name"))
            .put("repositoryUrl", repo.optString("html_url"))
            .put("defaultBranch", repo.optString("default_branch", "main"))
        secureStore.putString(SESSION_KEY, session.toString())
        return accountFrom(session)
    }

    fun currentAccount(): Account? =
        runCatching { secureStore.getString(SESSION_KEY)?.let { accountFrom(JSONObject(it)) } }.getOrNull()

    fun hasSession(): Boolean = currentAccount() != null

    fun signOut() {
        secureStore.remove(SESSION_KEY)
    }

    private fun verifyPrivateRepository(session: JSONObject) {
        val repository = session.optString("repository")
        require(repository.startsWith(session.optString("login") + "/")) {
            "Das Backup-Repository gehört nicht zum angemeldeten Konto."
        }
        val details = githubApi(session, "/repos/$repository")
        require(details.optBoolean("private")) {
            "Das Backup-Repository ist nicht mehr privat. Die Synchronisierung wurde aus Sicherheitsgründen gestoppt."
        }
        require(details.optJSONObject("owner")?.optLong("id") == session.optLong("userId")) {
            "Das Backup-Repository gehört nicht mehr zum angemeldeten Konto."
        }
    }

    fun uploadEncryptedBackup(envelope: JSONObject): String {
        val session = requireSession()
        verifyPrivateRepository(session)
        val repository = session.optString("repository")
        val path = "/repos/$repository/contents/$BACKUP_PATH"
        val existing = runCatching {
            githubApi(session, "$path?ref=" + encode(session.optString("defaultBranch")))
        }.getOrNull()
        val body = JSONObject()
            .put("message", "Update encrypted Schleim Browser profile backup")
            .put("content", Base64.encodeToString((envelope.toString(2) + "\n").toByteArray(StandardCharsets.UTF_8), Base64.NO_WRAP))
            .put("branch", session.optString("defaultBranch", "main"))
        if (!existing?.optString("sha").isNullOrBlank()) body.put("sha", existing!!.optString("sha"))
        githubApi(session, path, "PUT", body)
        val time = java.time.Instant.now().toString()
        session.put("lastBackupAt", time)
        secureStore.putString(SESSION_KEY, session.toString())
        return time
    }

    fun downloadEncryptedBackup(): JSONObject {
        val session = requireSession()
        verifyPrivateRepository(session)
        val repository = session.optString("repository")
        val path = "/repos/$repository/contents/$BACKUP_PATH?ref=" + encode(session.optString("defaultBranch"))
        val connection = (URL(API_BASE + path).openConnection() as HttpURLConnection).apply {
            connectTimeout = 15_000
            readTimeout = 60_000
            setRequestProperty("Accept", "application/vnd.github.raw+json")
            setRequestProperty("Authorization", "Bearer " + session.getString("accessToken"))
            setRequestProperty("X-GitHub-Api-Version", API_VERSION)
            setRequestProperty("User-Agent", USER_AGENT)
        }
        try {
            val code = connection.responseCode
            val stream = if (code in 200..299) connection.inputStream else connection.errorStream
            val text = stream?.bufferedReader(StandardCharsets.UTF_8)?.use { it.readText() }.orEmpty()
            if (code !in 200..299) throw IllegalStateException("GitHub API HTTP $code: " + text.take(300))
            return JSONObject(text)
        } finally {
            connection.disconnect()
        }
    }

    private fun requireSession(): JSONObject {
        val session = secureStore.getString(SESSION_KEY)?.let(::JSONObject)
            ?: throw IllegalStateException("Bitte melde dich zuerst unter Konto an.")
        refreshIfNeeded(session)
        return session
    }

    private fun refreshIfNeeded(session: JSONObject) {
        val expiresAt = session.optLong("expiresAt")
        if (expiresAt == 0L || expiresAt > System.currentTimeMillis() + 60_000L) return
        val refresh = session.optString("refreshToken")
        if (refresh.isBlank() || session.optLong("refreshExpiresAt") < System.currentTimeMillis() + 60_000L) {
            signOut()
            throw IllegalStateException("Die GitHub-Anmeldung ist abgelaufen. Bitte melde dich erneut an.")
        }
        val token = oauthPost(
            TOKEN_URL,
            mapOf(
                "client_id" to GITHUB_APP_CLIENT_ID,
                "grant_type" to "refresh_token",
                "refresh_token" to refresh
            )
        )
        require(token.optString("access_token").isNotBlank()) { "GitHub-Token konnte nicht erneuert werden." }
        session.put("accessToken", token.getString("access_token"))
            .put("refreshToken", token.optString("refresh_token", refresh))
            .put("expiresAt", System.currentTimeMillis() + token.optLong("expires_in", 28_800) * 1000L)
            .put("refreshExpiresAt", System.currentTimeMillis() + token.optLong("refresh_token_expires_in", 15_897_600) * 1000L)
        secureStore.putString(SESSION_KEY, session.toString())
    }

    private fun githubApi(
        session: JSONObject,
        path: String,
        method: String = "GET",
        body: JSONObject? = null
    ): JSONObject {
        refreshIfNeeded(session)
        val connection = (URL(API_BASE + path).openConnection() as HttpURLConnection).apply {
            connectTimeout = 15_000
            readTimeout = 30_000
            requestMethod = method
            setRequestProperty("Accept", "application/vnd.github+json")
            setRequestProperty("Authorization", "Bearer " + session.getString("accessToken"))
            setRequestProperty("X-GitHub-Api-Version", API_VERSION)
            setRequestProperty("User-Agent", USER_AGENT)
            if (body != null) {
                doOutput = true
                setRequestProperty("Content-Type", "application/json; charset=utf-8")
            }
        }
        try {
            if (body != null) connection.outputStream.use { it.write(body.toString().toByteArray(StandardCharsets.UTF_8)) }
            val code = connection.responseCode
            val stream = if (code in 200..299) connection.inputStream else connection.errorStream
            val text = stream?.bufferedReader(StandardCharsets.UTF_8)?.use { it.readText() }.orEmpty()
            val result = runCatching { JSONObject(text) }.getOrElse { JSONObject() }
            if (code !in 200..299) {
                throw IllegalStateException("GitHub API HTTP $code: " + result.optString("message").ifBlank { "Request failed." })
            }
            return result
        } finally {
            connection.disconnect()
        }
    }

    private fun oauthPost(url: String, values: Map<String, String>): JSONObject {
        val connection = (URL(url).openConnection() as HttpURLConnection).apply {
            connectTimeout = 15_000
            readTimeout = 20_000
            requestMethod = "POST"
            doOutput = true
            setRequestProperty("Accept", "application/json")
            setRequestProperty("Content-Type", "application/x-www-form-urlencoded; charset=utf-8")
            setRequestProperty("User-Agent", USER_AGENT)
        }
        try {
            val body = values.entries.joinToString("&") { encode(it.key) + "=" + encode(it.value) }
            connection.outputStream.use { it.write(body.toByteArray(StandardCharsets.UTF_8)) }
            val code = connection.responseCode
            val stream = if (code in 200..299) connection.inputStream else connection.errorStream
            val result = stream?.bufferedReader(StandardCharsets.UTF_8)?.use { JSONObject(it.readText()) } ?: JSONObject()
            if (code !in 200..299) throw IllegalStateException(result.optString("error_description", "GitHub OAuth HTTP $code"))
            return result
        } finally {
            connection.disconnect()
        }
    }

    private fun accountFrom(session: JSONObject) = Account(
        login = session.optString("login"),
        name = session.optString("name"),
        email = session.optString("email"),
        repository = session.optString("repository"),
        repositoryUrl = session.optString("repositoryUrl"),
        lastBackupAt = session.optString("lastBackupAt")
    )

    private fun encode(value: String): String = URLEncoder.encode(value, "UTF-8")

    companion object {
        private const val GITHUB_APP_CLIENT_ID = "Iv23lihfJBU95UVCrVt1"
        private const val GITHUB_APP_SLUG = "schleim-os-account"
        private const val REPOSITORY_NAME = "schleim-os-cloud"
        private const val BACKUP_PATH = "schleim-browser/profile-v1.enc"
        private const val CONTENTS_BASE = "/repos/"
        private const val API_BASE = "https://api.github.com"
        private const val DEVICE_CODE_URL = "https://github.com/login/device/code"
        private const val DEVICE_VERIFY_URL = "https://github.com/login/device"
        private const val TOKEN_URL = "https://github.com/login/oauth/access_token"
        private const val DEVICE_GRANT = "urn:ietf:params:oauth:grant-type:device_code"
        private const val API_VERSION = "2022-11-28"
        private const val USER_AGENT = "Schleim-Browser-Android"
        private const val SESSION_KEY = "github_oauth_session_v1"
    }
}
