package de.schneckeschneck.schleimos

import android.Manifest
import androidx.activity.ComponentActivity
import android.app.AlertDialog
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Color
import android.net.Uri
import android.os.Bundle
import android.provider.Settings
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.view.WindowManager
import android.widget.Button
import android.widget.FrameLayout
import android.widget.LinearLayout
import android.widget.TextView
import androidx.camera.core.CameraSelector
import androidx.camera.core.ImageCapture
import androidx.camera.core.ImageCaptureException
import androidx.camera.core.Preview
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.video.FallbackStrategy
import androidx.camera.video.FileOutputOptions
import androidx.camera.video.Quality
import androidx.camera.video.QualitySelector
import androidx.camera.video.Recorder
import androidx.camera.video.Recording
import androidx.camera.video.VideoCapture
import androidx.camera.video.VideoRecordEvent
import androidx.camera.view.PreviewView
import androidx.core.content.ContextCompat
import java.io.File

/**
 * Native CameraX capture screen used by Schleim OS.
 *
 * This screen deliberately does not resolve or launch an external camera app.
 * It owns preview, permissions, photo capture and video recording, then returns
 * a private cache-file path to MainActivity for transfer to the WebExtension.
 */
class CameraCaptureActivity : ComponentActivity() {
    private lateinit var previewView: PreviewView
    private lateinit var statusText: TextView
    private lateinit var captureButton: Button
    private lateinit var switchCameraButton: Button

    private var mediaType: String = MEDIA_PHOTO
    private var cameraProvider: ProcessCameraProvider? = null
    private var imageCapture: ImageCapture? = null
    private var videoCapture: VideoCapture<Recorder>? = null
    private var recording: Recording? = null
    private var recordingFile: File? = null
    private var lensFacing: Int = CameraSelector.LENS_FACING_BACK
    private var awaitingSettingsReturn = false
    private var captureFinishing = false
    private var cameraReady = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        mediaType = intent.getStringExtra(EXTRA_MEDIA_TYPE) ?: MEDIA_PHOTO
        if (mediaType != MEDIA_PHOTO && mediaType != MEDIA_VIDEO) {
            finishWithError("Unbekannter Aufnahmetyp.")
            return
        }

        window.statusBarColor = Color.BLACK
        window.navigationBarColor = Color.BLACK
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
        buildCameraUi()
        ensureCameraPermissions()
    }

    private fun buildCameraUi() {
        val root = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setBackgroundColor(Color.BLACK)
        }

        val stage = FrameLayout(this)
        previewView = PreviewView(this).apply {
            implementationMode = PreviewView.ImplementationMode.COMPATIBLE
            scaleType = PreviewView.ScaleType.FILL_CENTER
            setBackgroundColor(Color.BLACK)
        }
        stage.addView(
            previewView,
            FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )
        )

        val overlay = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(16), dp(18), dp(16), dp(20))
        }

        val topBar = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
            setPadding(dp(8), dp(6), dp(8), dp(6))
            setBackgroundColor(0x99000000.toInt())
        }
        topBar.addView(makeButton("✕") { finishCancelled() }, LinearLayout.LayoutParams(dp(48), dp(48)))

        val heading = TextView(this).apply {
            text = if (mediaType == MEDIA_VIDEO) "Schleim OS · Video" else "Schleim OS · Foto"
            textSize = 17f
            setTextColor(Color.WHITE)
            gravity = Gravity.CENTER_VERTICAL
            setPadding(dp(10), 0, dp(8), 0)
        }
        topBar.addView(heading, LinearLayout.LayoutParams(0, dp(48), 1f))

        switchCameraButton = makeButton("↻ Wechseln") { switchCamera() }
        topBar.addView(switchCameraButton, LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, dp(48)))
        overlay.addView(topBar)

        overlay.addView(View(this), LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 0, 1f))

        val bottomPanel = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER
            setPadding(dp(12), dp(12), dp(12), dp(12))
            setBackgroundColor(0xCC000000.toInt())
        }
        statusText = TextView(this).apply {
            text = "Kamera wird vorbereitet …"
            textSize = 13f
            setTextColor(Color.WHITE)
            gravity = Gravity.CENTER
            setPadding(dp(8), dp(4), dp(8), dp(12))
        }
        bottomPanel.addView(statusText, LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT))

        captureButton = makeButton(if (mediaType == MEDIA_VIDEO) "Aufnahme starten" else "Foto aufnehmen") {
            onCaptureButtonPressed()
        }
        captureButton.isEnabled = false
        bottomPanel.addView(
            captureButton,
            LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(58))
        )
        overlay.addView(bottomPanel)

        stage.addView(
            overlay,
            FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )
        )
        root.addView(
            stage,
            LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 0, 1f)
        )
        setContentView(root)
    }

    private fun makeButton(label: String, action: () -> Unit): Button = Button(this).apply {
        text = label
        textSize = 13f
        isAllCaps = false
        setTextColor(Color.WHITE)
        setBackgroundColor(0xFF5B351E.toInt())
        setOnClickListener { action() }
    }

    private fun ensureCameraPermissions() {
        val required = if (mediaType == MEDIA_VIDEO) {
            arrayOf(Manifest.permission.CAMERA, Manifest.permission.RECORD_AUDIO)
        } else {
            arrayOf(Manifest.permission.CAMERA)
        }
        val missing = required.filter {
            checkSelfPermission(it) != PackageManager.PERMISSION_GRANTED
        }
        if (missing.isEmpty()) {
            startCamera()
            return
        }

        val preferences = getSharedPreferences(PERMISSION_PREFS, MODE_PRIVATE)
        val permanentlyDenied = missing.filter { permission ->
            preferences.getBoolean("asked:$permission", false) &&
                !shouldShowRequestPermissionRationale(permission)
        }
        if (permanentlyDenied.isNotEmpty()) {
            showPermissionSettingsDialog(permanentlyDenied)
            return
        }

        missing.forEach { permission ->
            preferences.edit().putBoolean("asked:$permission", true).apply()
        }
        try {
            statusText.text = if (mediaType == MEDIA_VIDEO) {
                "Kamera- und Mikrofonberechtigung werden angefordert …"
            } else {
                "Kameraberechtigung wird angefordert …"
            }
            requestPermissions(missing.toTypedArray(), REQUEST_CAMERA_PERMISSIONS)
        } catch (error: Exception) {
            finishWithError(error.message ?: "Android-Berechtigung konnte nicht angefordert werden.")
        }
    }

    private fun showPermissionSettingsDialog(permissions: List<String>) {
        val labels = permissions.map {
            if (it == Manifest.permission.RECORD_AUDIO) "Mikrofon" else "Kamera"
        }.distinct().joinToString(" und ")
        AlertDialog.Builder(this)
            .setTitle("Berechtigung erforderlich")
            .setMessage("Der Zugriff auf $labels wurde dauerhaft abgelehnt. Erlaube den Zugriff in den Android-App-Einstellungen.")
            .setNegativeButton("Abbrechen") { _, _ ->
                finishWithError("Die Berechtigung für $labels wurde nicht erteilt.")
            }
            .setPositiveButton("Einstellungen öffnen") { _, _ ->
                awaitingSettingsReturn = true
                try {
                    startActivity(
                        Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS).apply {
                            data = Uri.parse("package:$packageName")
                        }
                    )
                } catch (error: Exception) {
                    awaitingSettingsReturn = false
                    finishWithError(error.message ?: "Android-Einstellungen konnten nicht geöffnet werden.")
                }
            }
            .setOnCancelListener {
                finishWithError("Die Berechtigung für $labels wurde nicht erteilt.")
            }
            .show()
    }

    @Suppress("DEPRECATION")
    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode != REQUEST_CAMERA_PERMISSIONS) return
        val granted = permissions.isNotEmpty() &&
            permissions.size == grantResults.size &&
            grantResults.all { it == PackageManager.PERMISSION_GRANTED }
        if (granted) {
            startCamera()
            return
        }

        val permanentlyDenied = permissions.indices.any { index ->
            grantResults.getOrNull(index) != PackageManager.PERMISSION_GRANTED &&
                !shouldShowRequestPermissionRationale(permissions[index])
        }
        if (permanentlyDenied) {
            val denied = permissions.filter { checkSelfPermission(it) != PackageManager.PERMISSION_GRANTED }
            showPermissionSettingsDialog(denied)
        } else {
            finishWithError("Der Zugriff auf Kamera oder Mikrofon wurde nicht erlaubt.")
        }
    }

    override fun onResume() {
        super.onResume()
        if (awaitingSettingsReturn) {
            awaitingSettingsReturn = false
            val required = if (mediaType == MEDIA_VIDEO) {
                arrayOf(Manifest.permission.CAMERA, Manifest.permission.RECORD_AUDIO)
            } else {
                arrayOf(Manifest.permission.CAMERA)
            }
            if (required.all { checkSelfPermission(it) == PackageManager.PERMISSION_GRANTED }) {
                startCamera()
            } else {
                finishWithError("Die benötigten Android-Berechtigungen wurden nicht aktiviert.")
            }
        }
    }

    private fun startCamera() {
        if (captureFinishing) return
        cameraReady = false
        captureButton.isEnabled = false
        statusText.text = "Kamera wird gestartet …"

        val future = ProcessCameraProvider.getInstance(this)
        future.addListener({
            if (isFinishing || isDestroyed || captureFinishing) return@addListener
            try {
                val provider = future.get()
                cameraProvider = provider
                bindCamera(provider)
            } catch (error: Exception) {
                finishWithError(
                    "CameraX konnte die Kamera nicht initialisieren: " +
                        (error.cause?.message ?: error.message ?: "Unbekannter Kamerafehler.")
                )
            }
        }, ContextCompat.getMainExecutor(this))
    }

    private fun bindCamera(provider: ProcessCameraProvider) {
        provider.unbindAll()
        val selector = chooseAvailableCamera(provider)
        val preview = Preview.Builder().build().also {
            it.setSurfaceProvider(previewView.surfaceProvider)
        }

        if (mediaType == MEDIA_PHOTO) {
            val capture = ImageCapture.Builder()
                .setCaptureMode(ImageCapture.CAPTURE_MODE_MINIMIZE_LATENCY)
                .setJpegQuality(92)
                .build()
            provider.bindToLifecycle(this, selector, preview, capture)
            imageCapture = capture
            videoCapture = null
        } else {
            val recorder = Recorder.Builder()
                .setQualitySelector(
                    QualitySelector.from(
                        Quality.HD,
                        FallbackStrategy.lowerQualityOrHigherThan(Quality.SD)
                    )
                )
                .build()
            val capture = VideoCapture.withOutput(recorder)
            provider.bindToLifecycle(this, selector, preview, capture)
            videoCapture = capture
            imageCapture = null
        }

        cameraReady = true
        statusText.text = if (mediaType == MEDIA_VIDEO) {
            "Bereit · Video mit Ton"
        } else {
            if (lensFacing == CameraSelector.LENS_FACING_FRONT) "Frontkamera bereit" else "Rückkamera bereit"
        }
        captureButton.isEnabled = true
        switchCameraButton.isEnabled = true
    }

    private fun chooseAvailableCamera(provider: ProcessCameraProvider): CameraSelector {
        val desired = CameraSelector.Builder().requireLensFacing(lensFacing).build()
        if (provider.hasCamera(desired)) return desired

        val alternateFacing = if (lensFacing == CameraSelector.LENS_FACING_BACK) {
            CameraSelector.LENS_FACING_FRONT
        } else {
            CameraSelector.LENS_FACING_BACK
        }
        val alternate = CameraSelector.Builder().requireLensFacing(alternateFacing).build()
        if (provider.hasCamera(alternate)) {
            lensFacing = alternateFacing
            return alternate
        }
        throw IllegalStateException("Auf diesem Gerät wurde keine verwendbare Kamera gefunden.")
    }

    private fun switchCamera() {
        if (!cameraReady || recording != null || captureFinishing) return
        lensFacing = if (lensFacing == CameraSelector.LENS_FACING_BACK) {
            CameraSelector.LENS_FACING_FRONT
        } else {
            CameraSelector.LENS_FACING_BACK
        }
        startCamera()
    }

    private fun onCaptureButtonPressed() {
        if (!cameraReady || captureFinishing) return
        if (mediaType == MEDIA_PHOTO) {
            capturePhoto()
        } else if (recording == null) {
            startVideoRecording()
        } else {
            stopVideoRecording()
        }
    }

    private fun capturePhoto() {
        val capture = imageCapture ?: run {
            finishWithError("Die Foto-Kamera ist noch nicht bereit.")
            return
        }
        val file = try {
            createCaptureFile("jpg")
        } catch (error: Exception) {
            finishWithError(error.message ?: "Temporäre Fotodatei konnte nicht erstellt werden.")
            return
        }

        captureButton.isEnabled = false
        switchCameraButton.isEnabled = false
        statusText.text = "Foto wird aufgenommen …"
        val options = ImageCapture.OutputFileOptions.Builder(file).build()
        capture.takePicture(
            options,
            ContextCompat.getMainExecutor(this),
            object : ImageCapture.OnImageSavedCallback {
                override fun onImageSaved(outputFileResults: ImageCapture.OutputFileResults) {
                    completeCapture(file, MIME_PHOTO)
                }

                override fun onError(exception: ImageCaptureException) {
                    file.delete()
                    finishWithError("Fotoaufnahme fehlgeschlagen: ${exception.message ?: "Unbekannter Fehler"}")
                }
            }
        )
    }

    private fun startVideoRecording() {
        val capture = videoCapture ?: run {
            finishWithError("Die Video-Kamera ist noch nicht bereit.")
            return
        }
        if (checkSelfPermission(Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
            finishWithError("Die Mikrofonberechtigung fehlt. Bitte erlaube den Mikrofonzugriff.")
            return
        }

        val file = try {
            createCaptureFile("mp4")
        } catch (error: Exception) {
            finishWithError(error.message ?: "Temporäre Videodatei konnte nicht erstellt werden.")
            return
        }
        recordingFile = file
        val outputOptions = FileOutputOptions.Builder(file).build()

        try {
            recording = capture.output
                .prepareRecording(this, outputOptions)
                .withAudioEnabled()
                .start(ContextCompat.getMainExecutor(this)) { event ->
                    when (event) {
                        is VideoRecordEvent.Start -> {
                            captureButton.text = "Aufnahme beenden"
                            captureButton.isEnabled = true
                            switchCameraButton.isEnabled = false
                            statusText.text = "Videoaufnahme läuft …"
                        }
                        is VideoRecordEvent.Finalize -> {
                            recording = null
                            recordingFile = null
                            if (event.hasError()) {
                                file.delete()
                                finishWithError(
                                    "Videoaufnahme fehlgeschlagen: " +
                                        (event.cause?.message ?: "CameraX-Fehler ${event.error}")
                                )
                            } else {
                                completeCapture(file, MIME_VIDEO)
                            }
                        }
                        else -> Unit
                    }
                }
            captureButton.isEnabled = false
            statusText.text = "Videoaufnahme wird gestartet …"
        } catch (error: Exception) {
            recording = null
            recordingFile = null
            file.delete()
            finishWithError(error.message ?: "Videoaufnahme konnte nicht gestartet werden.")
        }
    }

    private fun stopVideoRecording() {
        val active = recording ?: return
        captureButton.isEnabled = false
        statusText.text = "Video wird gespeichert …"
        active.stop()
    }

    private fun createCaptureFile(extension: String): File {
        val directory = File(cacheDir, "camera-captures")
        if (!directory.exists() && !directory.mkdirs()) {
            throw IllegalStateException("Temporärer Kameraordner konnte nicht erstellt werden.")
        }
        return File.createTempFile("schleim-os-", ".$extension", directory)
    }

    private fun completeCapture(file: File, mimeType: String) {
        if (!file.isFile || file.length() <= 0L) {
            file.delete()
            finishWithError("Die Kamera hat keine gültige Aufnahme gespeichert.")
            return
        }
        if (file.length() > MAX_CAPTURE_BYTES) {
            file.delete()
            finishWithError("Die Aufnahme ist größer als 50 MiB. Bitte nimm ein kürzeres Video auf.")
            return
        }
        captureFinishing = true
        val result = Intent()
            .putExtra(EXTRA_FILE_PATH, file.absolutePath)
            .putExtra(EXTRA_MIME_TYPE, mimeType)
        setResult(RESULT_OK, result)
        finish()
    }

    private fun finishWithError(message: String) {
        if (captureFinishing || isFinishing) return
        captureFinishing = true
        recording?.stop()
        recording = null
        recordingFile?.delete()
        recordingFile = null
        setResult(RESULT_CANCELED, Intent().putExtra(EXTRA_ERROR, message))
        finish()
    }

    private fun finishCancelled() {
        if (captureFinishing || isFinishing) return
        captureFinishing = true
        recording?.stop()
        recording = null
        recordingFile?.delete()
        recordingFile = null
        setResult(RESULT_CANCELED, Intent().putExtra(EXTRA_CANCELLED, true))
        finish()
    }

    override fun onStop() {
        if (!isFinishing && recording != null) {
            statusText.text = "Aufnahme wird beim Verlassen gespeichert …"
            recording?.stop()
        }
        super.onStop()
    }

    @Suppress("DEPRECATION")
    override fun onBackPressed() {
        finishCancelled()
    }

    override fun onDestroy() {
        cameraProvider?.unbindAll()
        recording?.stop()
        recording = null
        if (!captureFinishing) recordingFile?.delete()
        recordingFile = null
        super.onDestroy()
    }

    private fun dp(value: Int): Int = (value * resources.displayMetrics.density).toInt()

    companion object {
        const val EXTRA_MEDIA_TYPE = "schleim_os_camera_media_type"
        const val EXTRA_FILE_PATH = "schleim_os_camera_file_path"
        const val EXTRA_MIME_TYPE = "schleim_os_camera_mime_type"
        const val EXTRA_ERROR = "schleim_os_camera_error"
        const val EXTRA_CANCELLED = "schleim_os_camera_cancelled"

        private const val MEDIA_PHOTO = "photo"
        private const val MEDIA_VIDEO = "video"
        private const val MIME_PHOTO = "image/jpeg"
        private const val MIME_VIDEO = "video/mp4"
        private const val REQUEST_CAMERA_PERMISSIONS = 1601
        private const val MAX_CAPTURE_BYTES = 50L * 1024L * 1024L
        private const val PERMISSION_PREFS = "schleim_os_permission_requests"
    }
}
