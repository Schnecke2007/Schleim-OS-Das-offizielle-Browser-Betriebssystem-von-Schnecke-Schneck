package de.schneckeschneck.schleimos

import android.Manifest
import android.annotation.SuppressLint
import android.app.Activity
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Bundle
import android.provider.Settings
import android.util.Base64
import android.util.Log
import android.view.ViewGroup
import android.view.WindowManager
import android.webkit.JavascriptInterface
import android.webkit.PermissionRequest
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebView
import androidx.webkit.WebViewAssetLoader
import androidx.webkit.WebViewClientCompat
import java.io.File
import java.io.FileOutputStream

/**
 * Camera screen based on Android System WebView and JavaScript media APIs.
 * navigator.mediaDevices.getUserMedia() opens the physical camera on a local
 * HTTPS origin; there is no CameraX code or external camera-app launch.
 */
class CameraCaptureActivity : Activity() {
    private lateinit var webView: WebView
    private val captureLock = Any()

    private var pendingWebPermission: PermissionRequest? = null
    private var activeCaptureFile: File? = null
    private var activeCaptureOutput: FileOutputStream? = null
    private var expectedCaptureBytes = 0L
    private var writtenCaptureBytes = 0L
    private var captureFinished = false

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
        window.statusBarColor = android.graphics.Color.BLACK
        window.navigationBarColor = android.graphics.Color.BLACK

        val mediaType = intent.getStringExtra(EXTRA_MEDIA_TYPE) ?: MEDIA_PHOTO
        if (mediaType != MEDIA_PHOTO && mediaType != MEDIA_VIDEO) {
            finishWithError("Unbekannter Aufnahmetyp.")
            return
        }

        val assetLoader = WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(this))
            .build()

        webView = WebView(this).apply {
            layoutParams = ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )
            settings.javaScriptEnabled = true
            settings.domStorageEnabled = false
            settings.mediaPlaybackRequiresUserGesture = false
            settings.allowFileAccess = false
            settings.allowContentAccess = false
            settings.javaScriptCanOpenWindowsAutomatically = false
            isVerticalScrollBarEnabled = false
            isHorizontalScrollBarEnabled = false
            addJavascriptInterface(CameraJavascriptBridge(), BRIDGE_NAME)

            webViewClient = object : WebViewClientCompat() {
                override fun shouldInterceptRequest(
                    view: WebView,
                    request: WebResourceRequest
                ) = assetLoader.shouldInterceptRequest(request.url)

                override fun shouldOverrideUrlLoading(
                    view: WebView,
                    request: WebResourceRequest
                ): Boolean {
                    val uri = request.url
                    return uri.scheme != "https" ||
                        uri.host != ASSET_HOST ||
                        uri.path != CAMERA_ASSET_PATH
                }
            }

            webChromeClient = object : WebChromeClient() {
                override fun onPermissionRequest(request: PermissionRequest) {
                    runOnUiThread { handleWebPermissionRequest(request) }
                }

                override fun onPermissionRequestCanceled(request: PermissionRequest) {
                    runOnUiThread {
                        if (pendingWebPermission === request) pendingWebPermission = null
                    }
                }

                override fun onConsoleMessage(message: android.webkit.ConsoleMessage): Boolean {
                    Log.d(TAG, "Camera web: ${message.message()} [${message.lineNumber()}]")
                    return true
                }
            }
        }

        setContentView(webView)
        val url = "$CAMERA_URL?mode=$mediaType"
        Log.i(TAG, "Loading JavaScript camera from secure local origin: $url")
        webView.loadUrl(url)
    }

    private fun handleWebPermissionRequest(request: PermissionRequest) {
        if (isFinishing || isDestroyed) {
            request.deny()
            return
        }

        val origin = request.origin
        if (origin.scheme != "https" || origin.host != ASSET_HOST) {
            Log.w(TAG, "Rejected camera permission from untrusted origin: $origin")
            request.deny()
            return
        }

        val requestedResources = request.resources?.toSet().orEmpty()
        val supportedResources = setOf(
            PermissionRequest.RESOURCE_VIDEO_CAPTURE,
            PermissionRequest.RESOURCE_AUDIO_CAPTURE
        )
        if (requestedResources.isEmpty() || !supportedResources.containsAll(requestedResources)) {
            Log.w(TAG, "Rejected unsupported WebView resources: ${requestedResources.joinToString()}")
            request.deny()
            return
        }

        if (pendingWebPermission != null && pendingWebPermission !== request) {
            request.deny()
            return
        }

        val required = buildList {
            if (PermissionRequest.RESOURCE_VIDEO_CAPTURE in requestedResources) add(Manifest.permission.CAMERA)
            if (PermissionRequest.RESOURCE_AUDIO_CAPTURE in requestedResources) add(Manifest.permission.RECORD_AUDIO)
        }.distinct()

        val missing = required.filter { checkSelfPermission(it) != PackageManager.PERMISSION_GRANTED }
        if (missing.isEmpty()) {
            Log.i(TAG, "Granted WebView media resources: ${requestedResources.joinToString()}")
            request.grant(request.resources)
            return
        }

        pendingWebPermission = request
        Log.i(TAG, "Requesting Android permissions for WebView camera: ${missing.joinToString()}")
        try {
            requestPermissions(missing.toTypedArray(), REQUEST_WEB_CAMERA_PERMISSION)
        } catch (error: Exception) {
            pendingWebPermission = null
            Log.e(TAG, "Could not request WebView camera permission", error)
            request.deny()
        }
    }

    @Suppress("DEPRECATION")
    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode != REQUEST_WEB_CAMERA_PERMISSION) return

        val request = pendingWebPermission
        pendingWebPermission = null
        if (request == null) return

        val granted = permissions.isNotEmpty() &&
            permissions.size == grantResults.size &&
            grantResults.all { it == PackageManager.PERMISSION_GRANTED }

        if (granted && !isFinishing && !isDestroyed) {
            Log.i(TAG, "Granted WebView camera permissions: ${permissions.joinToString()}")
            request.grant(request.resources)
        } else {
            Log.w(TAG, "WebView camera permission denied: ${permissions.joinToString()}")
            request.deny()
        }
    }

    private inner class CameraJavascriptBridge {
        @JavascriptInterface
        fun beginCapture(fileName: String, mimeType: String, totalBytes: Long): Boolean {
            synchronized(captureLock) {
                if (captureFinished || totalBytes <= 0L || totalBytes > MAX_CAPTURE_BYTES) return false

                val extension = when (mimeType) {
                    MIME_PHOTO -> "jpg"
                    MIME_VIDEO_WEBM -> "webm"
                    MIME_VIDEO_MP4 -> "mp4"
                    else -> return false
                }

                runCatching {
                    activeCaptureOutput?.close()
                    activeCaptureFile?.delete()
                }
                val directory = File(cacheDir, "camera-captures")
                if (!directory.exists() && !directory.mkdirs()) return false

                return try {
                    val safeName = fileName
                        .substringAfterLast('/')
                        .substringAfterLast('\\')
                        .replace(Regex("[^A-Za-z0-9._-]"), "_")
                        .take(80)
                        .ifBlank { "capture.$extension" }
                    val file = File.createTempFile("schleim-webcam-", ".$extension", directory)
                    activeCaptureFile = file
                    activeCaptureOutput = FileOutputStream(file)
                    expectedCaptureBytes = totalBytes
                    writtenCaptureBytes = 0L
                    Log.i(TAG, "Started browser camera transfer: $safeName, mime=$mimeType, bytes=$totalBytes")
                    true
                } catch (error: Exception) {
                    Log.e(TAG, "Could not create camera capture file", error)
                    activeCaptureFile = null
                    activeCaptureOutput = null
                    false
                }
            }
        }

        @JavascriptInterface
        fun appendCaptureChunk(base64Chunk: String): Boolean {
            synchronized(captureLock) {
                if (base64Chunk.isBlank() || base64Chunk.length > MAX_BASE64_CHUNK_CHARS) return false
                val output = activeCaptureOutput ?: return false
                return try {
                    val bytes = Base64.decode(base64Chunk, Base64.NO_WRAP)
                    if (writtenCaptureBytes + bytes.size > expectedCaptureBytes ||
                        writtenCaptureBytes + bytes.size > MAX_CAPTURE_BYTES
                    ) {
                        return false
                    }
                    output.write(bytes)
                    writtenCaptureBytes += bytes.size
                    true
                } catch (error: Exception) {
                    Log.e(TAG, "Could not append browser camera data", error)
                    false
                }
            }
        }

        @JavascriptInterface
        fun finishCapture(): Boolean {
            synchronized(captureLock) {
                val output = activeCaptureOutput ?: return false
                val file = activeCaptureFile ?: return false
                return try {
                    output.flush()
                    output.fd.sync()
                    output.close()
                    activeCaptureOutput = null
                    if (!file.isFile || file.length() != expectedCaptureBytes ||
                        writtenCaptureBytes != expectedCaptureBytes || file.length() <= 0L
                    ) {
                        file.delete()
                        activeCaptureFile = null
                        false
                    } else {
                        captureFinished = true
                        runOnUiThread {
                            if (!isFinishing && !isDestroyed) {
                                val result = Intent()
                                    .putExtra(EXTRA_FILE_PATH, file.absolutePath)
                                    .putExtra(EXTRA_MIME_TYPE, when (file.extension.lowercase()) {
                                        "webm" -> MIME_VIDEO_WEBM
                                        "mp4" -> MIME_VIDEO_MP4
                                        else -> MIME_PHOTO
                                    })
                                setResult(RESULT_OK, result)
                                finish()
                            }
                        }
                        true
                    }
                } catch (error: Exception) {
                    Log.e(TAG, "Could not finish browser camera transfer", error)
                    runCatching { output.close() }
                    activeCaptureOutput = null
                    file.delete()
                    activeCaptureFile = null
                    false
                }
            }
        }

        @JavascriptInterface
        fun cancelCapture() {
            runOnUiThread { finishCancelled() }
        }

        @JavascriptInterface
        fun openAppSettings() {
            runOnUiThread {
                runCatching {
                    startActivity(
                        Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS).apply {
                            data = Uri.parse("package:$packageName")
                        }
                    )
                }.onFailure { Log.e(TAG, "Could not open app settings", it) }
            }
        }
    }

    private fun finishWithError(message: String) {
        if (isFinishing) return
        setResult(RESULT_CANCELED, Intent().putExtra(EXTRA_ERROR, message))
        finish()
    }

    private fun finishCancelled() {
        if (isFinishing || captureFinished) return
        synchronized(captureLock) {
            runCatching { activeCaptureOutput?.close() }
            activeCaptureOutput = null
            activeCaptureFile?.delete()
            activeCaptureFile = null
            expectedCaptureBytes = 0L
            writtenCaptureBytes = 0L
        }
        setResult(RESULT_CANCELED, Intent().putExtra(EXTRA_CANCELLED, true))
        finish()
    }

    @Suppress("DEPRECATION")
    override fun onBackPressed() {
        finishCancelled()
    }

    override fun onResume() {
        super.onResume()
        if (::webView.isInitialized) webView.onResume()
    }

    override fun onPause() {
        if (::webView.isInitialized) webView.onPause()
        super.onPause()
    }

    override fun onDestroy() {
        pendingWebPermission?.let { runCatching { it.deny() } }
        pendingWebPermission = null
        synchronized(captureLock) {
            runCatching { activeCaptureOutput?.close() }
            activeCaptureOutput = null
            if (!captureFinished) activeCaptureFile?.delete()
            activeCaptureFile = null
        }
        if (::webView.isInitialized) {
            webView.removeJavascriptInterface(BRIDGE_NAME)
            webView.stopLoading()
            webView.destroy()
        }
        super.onDestroy()
    }

    companion object {
        const val EXTRA_MEDIA_TYPE = "schleim_os_camera_media_type"
        const val EXTRA_FILE_PATH = "schleim_os_camera_file_path"
        const val EXTRA_MIME_TYPE = "schleim_os_camera_mime_type"
        const val EXTRA_ERROR = "schleim_os_camera_error"
        const val EXTRA_CANCELLED = "schleim_os_camera_cancelled"

        private const val TAG = "SchleimOSCameraWeb"
        private const val BRIDGE_NAME = "AndroidCamera"
        private const val ASSET_HOST = "appassets.androidplatform.net"
        private const val CAMERA_ASSET_PATH = "/assets/camera/camera.html"
        private const val CAMERA_URL = "https://appassets.androidplatform.net/assets/camera/camera.html"
        private const val REQUEST_WEB_CAMERA_PERMISSION = 1701
        private const val MAX_CAPTURE_BYTES = 50L * 1024L * 1024L
        private const val MAX_BASE64_CHUNK_CHARS = 48 * 1024
        private const val MIME_PHOTO = "image/jpeg"
        private const val MIME_VIDEO_WEBM = "video/webm"
        private const val MIME_VIDEO_MP4 = "video/mp4"
        private const val MEDIA_PHOTO = "photo"
        private const val MEDIA_VIDEO = "video"
    }
}
