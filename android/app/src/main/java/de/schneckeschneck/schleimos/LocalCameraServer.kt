package de.schneckeschneck.schleimos

import android.content.Context
import android.net.Uri
import java.io.BufferedReader
import java.io.InputStreamReader
import java.net.InetAddress
import java.net.ServerSocket
import java.net.Socket
import java.nio.charset.StandardCharsets
import java.util.UUID
import java.util.concurrent.atomic.AtomicBoolean

/**
 * Serves the camera document over a random-port, loopback-only HTTP server.
 * GeckoView's WebExtension-origin getUserMedia path is unreliable on Android;
 * a loopback origin is treated as potentially trustworthy by secure-context rules.
 */
class LocalCameraServer(context: Context) : AutoCloseable {
    private val appContext = context.applicationContext
    private val token = UUID.randomUUID().toString()
    private val running = AtomicBoolean(false)
    @Volatile private var serverSocket: ServerSocket? = null

    val url: String
        get() {
            val port = serverSocket?.localPort ?: error("Lokaler Kameraserver ist nicht gestartet.")
            return "http://127.0.0.1:$port/camera.html?token=$token"
        }

    fun start() {
        if (running.get()) return
        val socket = ServerSocket(0, 8, InetAddress.getByName("127.0.0.1"))
        serverSocket = socket
        running.set(true)
        Thread({
            while (running.get()) {
                try {
                    val client = socket.accept()
                    Thread({ serve(client) }, "SchleimCameraClient").apply {
                        isDaemon = true
                        start()
                    }
                } catch (_: Exception) {
                    if (running.get()) running.set(false)
                }
            }
        }, "SchleimCameraServer").apply {
            isDaemon = true
            start()
        }
    }

    private fun serve(client: Socket) {
        client.use { connection ->
            runCatching {
                connection.soTimeout = 5000
                val reader = BufferedReader(InputStreamReader(connection.getInputStream(), StandardCharsets.US_ASCII))
                val requestLine = reader.readLine() ?: return
                var headerBytes = 0
                while (true) {
                    val line = reader.readLine() ?: break
                    headerBytes += line.length
                    if (headerBytes > 16_384 || line.isEmpty()) break
                }

                val parts = requestLine.split(' ')
                val method = parts.getOrNull(0).orEmpty()
                val target = parts.getOrNull(1).orEmpty()
                val parsed = Uri.parse(target)
                val allowed = method == "GET" &&
                    parsed.path == "/camera.html" &&
                    parsed.getQueryParameter("token") == token

                if (!allowed) {
                    respond(connection, 404, "Not Found", "text/plain; charset=utf-8", "Not found".toByteArray(StandardCharsets.UTF_8))
                    return
                }

                val html = appContext.assets.open("camera/camera-host.html").use { it.readBytes() }
                respond(
                    connection,
                    200,
                    "OK",
                    "text/html; charset=utf-8",
                    html,
                    listOf(
                        "Permissions-Policy: camera=(self), microphone=(self)",
                        "Content-Security-Policy: default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; media-src blob:; img-src blob: data:; connect-src 'none'; base-uri 'none'"
                    )
                )
            }
        }
    }

    private fun respond(
        socket: Socket,
        code: Int,
        reason: String,
        contentType: String,
        body: ByteArray,
        extraHeaders: List<String> = emptyList()
    ) {
        val output = socket.getOutputStream()
        val headers = buildString {
            append("HTTP/1.1 $code $reason\r\n")
            append("Content-Type: $contentType\r\n")
            append("Content-Length: ${body.size}\r\n")
            append("Cache-Control: no-store, no-cache, must-revalidate\r\n")
            append("X-Content-Type-Options: nosniff\r\n")
            append("Referrer-Policy: no-referrer\r\n")
            append("Connection: close\r\n")
            extraHeaders.forEach { append(it).append("\r\n") }
            append("\r\n")
        }.toByteArray(StandardCharsets.US_ASCII)
        output.write(headers)
        output.write(body)
        output.flush()
    }

    override fun close() {
        running.set(false)
        runCatching { serverSocket?.close() }
        serverSocket = null
    }
}
