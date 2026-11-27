package de.schneckeschneck.schleimos

import android.content.Context
import android.content.Intent
import android.net.Uri
import androidx.core.content.FileProvider
import org.json.JSONObject
import java.io.ByteArrayOutputStream
import java.io.File
import java.net.HttpURLConnection
import java.net.URL

/**
 * Schleim VPN controller for the OpenVPN for Android companion app.
 *
 * The browser does not ship or implement an OpenVPN engine. The companion app
 * owns Android's VpnService, credentials, permission prompts and tunnel state.
 */
internal object VpnIntegration {
    private const val REPOSITORY = "Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck"
    private const val BRANCH = "main"
    private const val MANIFEST_URL = "https://raw.githubusercontent.com/$REPOSITORY/$BRANCH/vpn/servers.json"
    const val OPENVPN_PACKAGE = "de.blinkt.openvpn"
    const val PROFILE_NAME_EXTRA = "de.blinkt.openvpn.api.profileName"
    private const val PROFILE_MIME = "application/x-openvpn-profile"

    data class Server(
        val id: String,
        val countryCode: String,
        val country: String,
        val fileName: String,
        val profileName: String,
        val configPath: String
    )

    // Safe fallback while the online manifest is unavailable. These entries are
    // marked unverified because the provider can retire or rotate free servers.
    val fallbackServers = listOf(
        Server("ca", "CA", "Kanada", "ca-free-4.protonvpn.udp.ovpn", "ca-free-4.protonvpn.udp", "android/app/src/main/java/de/schneckeschneck/schleimos/VPN/Server/ca-free-4.protonvpn.udp.ovpn"),
        Server("ch", "CH", "Schweiz", "ch-free-2.protonvpn.udp.ovpn", "ch-free-2.protonvpn.udp", "android/app/src/main/java/de/schneckeschneck/schleimos/VPN/Server/ch-free-2.protonvpn.udp.ovpn"),
        Server("jp", "JP", "Japan", "jp-free-9.protonvpn.udp.ovpn", "jp-free-9.protonvpn.udp", "android/app/src/main/java/de/schneckeschneck/schleimos/VPN/Server/jp-free-9.protonvpn.udp.ovpn"),
        Server("mx", "MX", "Mexiko", "mx-free-6.protonvpn.udp.ovpn", "mx-free-6.protonvpn.udp", "android/app/src/main/java/de/schneckeschneck/schleimos/VPN/Server/mx-free-6.protonvpn.udp.ovpn"),
        Server("nl", "NL", "Niederlande", "nl-free-15.protonvpn.udp.ovpn", "nl-free-15.protonvpn.udp", "android/app/src/main/java/de/schneckeschneck/schleimos/VPN/Server/nl-free-15.protonvpn.udp.ovpn"),
        Server("pl", "PL", "Polen", "pl-free-5.protonvpn.udp.ovpn", "pl-free-5.protonvpn.udp", "android/app/src/main/java/de/schneckeschneck/schleimos/VPN/Server/pl-free-5.protonvpn.udp.ovpn"),
        Server("ro", "RO", "Rumänien", "ro-free-17.protonvpn.udp.ovpn", "ro-free-17.protonvpn.udp", "android/app/src/main/java/de/schneckeschneck/schleimos/VPN/Server/ro-free-17.protonvpn.udp.ovpn"),
        Server("sg", "SG", "Singapur", "sg-free-2.protonvpn.udp.ovpn", "sg-free-2.protonvpn.udp", "android/app/src/main/java/de/schneckeschneck/schleimos/VPN/Server/sg-free-2.protonvpn.udp.ovpn"),
        Server("us", "US", "USA", "us-free-20.protonvpn.udp.ovpn", "us-free-20.protonvpn.udp", "android/app/src/main/java/de/schneckeschneck/schleimos/VPN/Server/us-free-20.protonvpn.udp.ovpn")
    )

    fun fetchServerList(): List<Server> {
        val connection = (URL(MANIFEST_URL).openConnection() as HttpURLConnection).apply {
            connectTimeout = 8_000
            readTimeout = 8_000
            requestMethod = "GET"
            setRequestProperty("User-Agent", "SchleimBrowser-Android")
        }
        try {
            if (connection.responseCode !in 200..299) {
                throw IllegalStateException("Serverliste konnte nicht geladen werden (HTTP ${connection.responseCode}).")
            }
            val bytes = connection.inputStream.use { input ->
                val output = ByteArrayOutputStream()
                val buffer = ByteArray(8192)
                var total = 0
                while (true) {
                    val count = input.read(buffer)
                    if (count < 0) break
                    total += count
                    if (total > 256 * 1024) throw IllegalStateException("VPN-Serverliste ist zu groß.")
                    output.write(buffer, 0, count)
                }
                output.toByteArray()
            }
            val root = JSONObject(String(bytes, Charsets.UTF_8))
            val array = root.optJSONArray("servers") ?: throw IllegalStateException("VPN-Serverliste enthält keine Server.")
            val result = mutableListOf<Server>()
            for (index in 0 until array.length()) {
                val item = array.optJSONObject(index) ?: continue
                val id = item.optString("id")
                val code = item.optString("countryCode")
                val country = item.optString("country")
                val fileName = item.optString("fileName")
                val profileName = item.optString("profileName")
                val path = item.optString("configPath")
                if (id.isBlank() || code.isBlank() || country.isBlank() || fileName.isBlank() ||
                    profileName.isBlank() || !fileName.endsWith(".ovpn") ||
                    !path.startsWith("android/app/src/main/java/de/schneckeschneck/schleimos/VPN/Server/") ||
                    path.contains("..") || path.substringAfterLast('/') != fileName
                ) continue
                result += Server(id, code, country, fileName, profileName, path)
            }
            if (result.isEmpty()) throw IllegalStateException("VPN-Serverliste enthält keine gültigen Einträge.")
            return result
        } finally {
            connection.disconnect()
        }
    }

    fun downloadProfile(context: Context, server: Server): File {
        require(server.configPath.startsWith("android/app/src/main/java/de/schneckeschneck/schleimos/VPN/Server/"))
        require(!server.configPath.contains(".."))
        val url = "https://raw.githubusercontent.com/$REPOSITORY/$BRANCH/${server.configPath}"
        val connection = (URL(url).openConnection() as HttpURLConnection).apply {
            connectTimeout = 12_000
            readTimeout = 15_000
            requestMethod = "GET"
            setRequestProperty("User-Agent", "SchleimBrowser-Android")
        }
        try {
            if (connection.responseCode !in 200..299) {
                throw IllegalStateException("VPN-Profil konnte nicht geladen werden (HTTP ${connection.responseCode}).")
            }
            val bytes = connection.inputStream.use { input ->
                val output = ByteArrayOutputStream()
                val buffer = ByteArray(8192)
                var total = 0
                while (true) {
                    val count = input.read(buffer)
                    if (count < 0) break
                    total += count
                    if (total > 1024 * 1024) throw IllegalStateException("VPN-Profil ist unerwartet groß.")
                    output.write(buffer, 0, count)
                }
                output.toByteArray()
            }
            val text = String(bytes, Charsets.UTF_8)
            if (!text.contains("\\nclient") && !text.trimStart().startsWith("client") ||
                !text.contains("<ca>") || !text.contains("auth-user-pass")
            ) throw IllegalStateException("Die heruntergeladene Datei ist kein gültiges OpenVPN-Profil.")
            val directory = File(context.filesDir, "vpn-profiles").apply { mkdirs() }
            val target = File(directory, server.fileName)
            target.writeBytes(bytes)
            return target
        } finally {
            connection.disconnect()
        }
    }

    fun importIntent(context: Context, profileFile: File): Intent {
        val uri = FileProvider.getUriForFile(
            context,
            "${context.packageName}.fileprovider",
            profileFile
        )
        return Intent(Intent.ACTION_VIEW).apply {
            setDataAndType(uri, PROFILE_MIME)
            setPackage(OPENVPN_PACKAGE)
            addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
    }

    fun connectIntent(server: Server): Intent =
        Intent(Intent.ACTION_MAIN).apply {
            setClassName(OPENVPN_PACKAGE, "de.blinkt.openvpn.api.ConnectVPN")
            putExtra(PROFILE_NAME_EXTRA, server.profileName)
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }

    fun disconnectIntent(): Intent =
        Intent(Intent.ACTION_MAIN).apply {
            setClassName(OPENVPN_PACKAGE, "de.blinkt.openvpn.api.DisconnectVPN")
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }

    fun installIntent(): Intent =
        Intent(Intent.ACTION_VIEW, Uri.parse("https://f-droid.org/packages/de.blinkt.openvpn/"))
}
