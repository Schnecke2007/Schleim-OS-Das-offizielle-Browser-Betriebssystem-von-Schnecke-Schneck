package de.schneckeschneck.schleimos

import android.content.Context
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL

data class VpnServerLocation(
    val id: String,
    val countryCode: String,
    val country: String,
    val profileFile: String
)

data class VpnServerCatalogData(
    val updated: String,
    val note: String,
    val source: String,
    val servers: List<VpnServerLocation>,
    val fromRemote: Boolean
)

/**
 * Refreshable, credential-free reference catalog.
 * The catalog contains no WireGuard private keys and is not a live availability API.
 */
object VpnServerCatalog {
    private const val REMOTE_URL =
        "https://raw.githubusercontent.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/main/android/app/src/main/java/de/schneckeschneck/schleimos/VPN/Server/servers.json"

    fun load(context: Context): VpnServerCatalogData {
        val remoteText = runCatching {
            val connection = URL(REMOTE_URL).openConnection() as HttpURLConnection
            connection.connectTimeout = 7000
            connection.readTimeout = 7000
            connection.requestMethod = "GET"
            connection.setRequestProperty("Accept", "application/json")
            try {
                require(connection.responseCode in 200..299) {
                    "Serverliste konnte nicht geladen werden (HTTP ${connection.responseCode})."
                }
                connection.inputStream.bufferedReader(Charsets.UTF_8).use { it.readText() }
            } finally {
                connection.disconnect()
            }
        }.getOrNull()

        val fromRemote = remoteText != null
        val text = remoteText ?: context.assets.open("vpn/servers.json")
            .bufferedReader(Charsets.UTF_8).use { it.readText() }
        return parse(text, fromRemote)
    }

    private fun parse(text: String, fromRemote: Boolean): VpnServerCatalogData {
        require(text.length <= 64 * 1024) { "Serverliste ist zu groß." }
        val root = JSONObject(text)
        require(root.optInt("schema", -1) == 1) { "Unbekannte Serverlisten-Version." }
        val array = root.getJSONArray("servers")
        val servers = (0 until array.length()).map { index ->
            val item = array.getJSONObject(index)
            VpnServerLocation(
                id = item.getString("id"),
                countryCode = item.getString("countryCode"),
                country = item.getString("country"),
                profileFile = item.optString("profile", "")
            )
        }.filter { it.id.isNotBlank() && it.country.isNotBlank() }
        require(servers.isNotEmpty()) { "Die Serverliste enthält keine Standorte." }
        return VpnServerCatalogData(
            updated = root.optString("updated", "unbekannt"),
            note = root.optString("note", ""),
            source = "https://account.protonvpn.com/downloads",
            servers = servers,
            fromRemote = fromRemote
        )
    }
}
