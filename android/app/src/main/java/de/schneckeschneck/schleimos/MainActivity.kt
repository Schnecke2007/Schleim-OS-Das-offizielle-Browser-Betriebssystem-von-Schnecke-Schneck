package de.schneckeschneck.schleimos

import android.Manifest
import android.app.Activity
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.role.RoleManager
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Color
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.view.inputmethod.EditorInfo
import android.widget.Button
import android.widget.EditText
import android.widget.FrameLayout
import android.widget.LinearLayout
import androidx.core.app.NotificationCompat
import org.json.JSONObject
import org.mozilla.geckoview.AllowOrDeny
import org.mozilla.geckoview.GeckoResult
import org.mozilla.geckoview.GeckoRuntime
import org.mozilla.geckoview.GeckoSession
import org.mozilla.geckoview.GeckoView
import org.mozilla.geckoview.WebExtension

class MainActivity : Activity() {
    private lateinit var rootFrame: FrameLayout
    private lateinit var browserColumn: LinearLayout
    private lateinit var geckoView: GeckoView
    private lateinit var address: EditText
    private lateinit var tabsButton: Button
    private lateinit var runtime: GeckoRuntime

    private var extension: WebExtension? = null
    private var extensionHomeUrl: String? = null
    private val tabs = mutableListOf<GeckoSession>()
    private var activeTabIndex = 0
    private var displayedSession: GeckoSession? = null

    private var mediaSession: GeckoSession? = null
    private var mediaView: GeckoView? = null
    private var mediaPageReady = false
    private var pendingMediaReady: GeckoResult<Any>? = null

    private var pendingFilePrompt: GeckoSession.PromptDelegate.FilePrompt? = null
    private var pendingFileResult: GeckoResult<GeckoSession.PromptDelegate.PromptResponse>? = null
    private val pendingPermissionCallbacks = mutableMapOf<Int, (Boolean) -> Unit>()
    private var permissionRequestCounter = 0

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        createNotificationChannel()
        buildBrowserUi()
        runtime = GeckoRuntime.create(this)
        openBrowser(intent?.data?.toString())
        requestNotificationPermissionIfNeeded()
    }

    private fun buildBrowserUi() {
        rootFrame = FrameLayout(this).apply {
            setBackgroundColor(Color.rgb(37, 18, 5))
        }
        browserColumn = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setBackgroundColor(Color.rgb(37, 18, 5))
        }
        val toolbar = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
            setPadding(6, 8, 6, 8)
        }
        address = EditText(this).apply {
            hint = "Webadresse oder Suchbegriff"
            setSingleLine(true)
            setTextColor(Color.WHITE)
            setHintTextColor(Color.LTGRAY)
            setBackgroundColor(Color.rgb(75, 49, 31))
            imeOptions = EditorInfo.IME_ACTION_GO
            setOnEditorActionListener { _, action, _ ->
                if (action == EditorInfo.IME_ACTION_GO) {
                    navigate(address.text.toString())
                    true
                } else false
            }
        }
        toolbar.addView(makeButton("‹") { activeSession()?.goBack() })
        toolbar.addView(address, LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f))
        toolbar.addView(makeButton("Los") { navigate(address.text.toString()) })
        toolbar.addView(makeButton("⌂") { extensionHomeUrl?.let { load(it) } })
        toolbar.addView(makeButton("↻") { activeSession()?.reload() })
        tabsButton = makeButton("Tabs 0") { cycleTabs() }
        toolbar.addView(tabsButton)
        toolbar.addView(makeButton("+") { createUserTab() })
        browserColumn.addView(toolbar)

        geckoView = GeckoView(this)
        browserColumn.addView(
            geckoView,
            LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 0, 1f)
        )
        val bottom = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER
            setPadding(6, 4, 6, 8)
        }
        bottom.addView(makeButton("Benachrichtigung testen") {
            showNotification("Schleim OS", "Android-Benachrichtigungen sind eingerichtet.")
        })
        bottom.addView(makeButton("Standardbrowser") { requestDefaultBrowserRole() })
        browserColumn.addView(bottom)
        rootFrame.addView(
            browserColumn,
            FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT)
        )
        setContentView(rootFrame)
    }

    private fun makeButton(label: String, action: () -> Unit) = Button(this).apply {
        text = label
        textSize = 11f
        isAllCaps = false
        setOnClickListener { action() }
    }

    private fun openBrowser(initialUrl: String?) {
        runtime.getWebExtensionController()
            .ensureBuiltIn(BUNDLED_EXTENSION_URI, EXTENSION_ID)
            .accept({ installed ->
                if (installed == null) {
                    showNotification("Schleim OS", "Die integrierte Erweiterung konnte nicht installiert werden.")
                    return@accept
                }
                extension = installed
                extensionHomeUrl = installed.metaData.baseUrl + "pages/newtab.html"
                installed.setMessageDelegate(nativeMessageDelegate(), NATIVE_APP_ID)
                val destination = initialUrl ?: extensionHomeUrl!!
                createTab(destination)
            }, { error ->
                showNotification(
                    "Schleim OS konnte nicht starten",
                    error?.message ?: "GeckoView konnte die Original-Extension nicht laden."
                )
            })
    }

    private fun nativeMessageDelegate() = object : WebExtension.MessageDelegate {
        override fun onMessage(
            nativeApp: String,
            message: Any,
            sender: WebExtension.MessageSender
        ): GeckoResult<Any>? {
            val payload = when (message) {
                is JSONObject -> message
                is Map<*, *> -> JSONObject(message.entries.associate { it.key.toString() to it.value })
                else -> JSONObject()
            }
            return when (payload.optString("action")) {
                "media.ensure" -> ensureMediaUploadPage()
                "media.stop" -> {
                    stopMediaUploadPage()
                    GeckoResult.fromValue(JSONObject().put("ok", true))
                }
                "notification.progress" -> {
                    MediaUploadService.update(
                        this@MainActivity,
                        payload.optInt("progress", 0).coerceIn(0, 100),
                        payload.optString("message", "Medien werden hochgeladen …")
                    )
                    GeckoResult.fromValue(JSONObject().put("ok", true))
                }
                "notification.complete" -> {
                    showNotification(
                        "Schleim OS – Upload abgeschlossen",
                        payload.optString("message", "Deine Medien wurden in die private Cloud hochgeladen.")
                    )
                    GeckoResult.fromValue(JSONObject().put("ok", true))
                }
                "notification.failed" -> {
                    showNotification(
                        "Schleim OS – Upload fehlgeschlagen",
                        payload.optString("message", "Der Medien-Upload konnte nicht abgeschlossen werden.")
                    )
                    GeckoResult.fromValue(JSONObject().put("ok", true))
                }
                else -> GeckoResult.fromValue(JSONObject().put("ok", false).put("error", "Unbekannte Android-Aktion."))
            }
        }
    }

    private fun ensureMediaUploadPage(): GeckoResult<Any> {
        if (mediaPageReady && mediaSession != null) {
            MediaUploadService.start(this)
            return GeckoResult.fromValue(JSONObject().put("ok", true))
        }
        pendingMediaReady?.let { return it }
        val installed = extension
            ?: return GeckoResult.fromValue(JSONObject().put("ok", false).put("error", "Schleim OS ist noch nicht bereit."))

        MediaUploadService.start(this)
        val result = GeckoResult<Any>()
        pendingMediaReady = result
        val hiddenView = GeckoView(this).apply {
            alpha = 0.01f
            isClickable = false
            isFocusable = false
            importantForAccessibility = View.IMPORTANT_FOR_ACCESSIBILITY_NO
        }
        mediaView = hiddenView
        rootFrame.addView(hiddenView, FrameLayout.LayoutParams(2, 2, Gravity.BOTTOM or Gravity.END))

        val hiddenSession = GeckoSession()
        mediaSession = hiddenSession
        hiddenSession.setProgressDelegate(object : GeckoSession.ProgressDelegate {
            override fun onPageStop(session: GeckoSession, success: Boolean) {
                if (session !== mediaSession) return
                if (success) {
                    mediaPageReady = true
                    pendingMediaReady?.complete(JSONObject().put("ok", true))
                } else {
                    pendingMediaReady?.complete(
                        JSONObject().put("ok", false).put("error", "Die Medien-Hintergrundseite konnte nicht geladen werden.")
                    )
                    stopMediaUploadPage()
                }
                pendingMediaReady = null
            }
        })
        attachSessionDelegates(hiddenSession)
        hiddenSession.open(runtime)
        hiddenView.setSession(hiddenSession)
        hiddenSession.loadUri(installed.metaData.baseUrl + "pages/media-upload.html")
        return result
    }

    private fun stopMediaUploadPage() {
        pendingMediaReady?.complete(
            JSONObject().put("ok", false).put("error", "Medien-Hintergrundprozess wurde beendet.")
        )
        pendingMediaReady = null
        mediaPageReady = false
        val oldSession = mediaSession
        mediaView?.let { view ->
            runCatching { view.releaseSession() }
            rootFrame.removeView(view)
        }
        mediaView = null
        oldSession?.close()
        mediaSession = null
        MediaUploadService.stop(this)
    }

    private fun createTab(url: String?): GeckoSession {
        val session = GeckoSession()
        attachSessionDelegates(session)
        session.open(runtime)
        tabs.add(session)
        activeTabIndex = tabs.lastIndex
        showSessionInBrowser(session)
        if (!url.isNullOrBlank()) session.loadUri(normalizeUrlOrExtension(url))
        return session
    }

    private fun showSessionInBrowser(session: GeckoSession) {
        if (displayedSession !== session) {
            displayedSession?.let { previous ->
                runCatching { previous.setFocused(false) }
                runCatching { geckoView.releaseSession() }
            }
            geckoView.setSession(session)
            displayedSession = session
        }
        session.setFocused(true)
        updateTabsButton()
    }

    private fun createUserTab() {
        createTab(extensionHomeUrl ?: "https://www.google.com")
    }

    private fun cycleTabs() {
        if (tabs.isEmpty()) {
            createUserTab()
            return
        }
        if (tabs.size == 1) return
        activeTabIndex = (activeTabIndex + 1) % tabs.size
        showSessionInBrowser(tabs[activeTabIndex])
    }

    private fun updateTabsButton() {
        tabsButton.text = "Tabs " + tabs.size + " · " + (if (tabs.isEmpty()) 0 else activeTabIndex + 1)
    }

    private fun activeSession(): GeckoSession? = tabs.getOrNull(activeTabIndex)

    private fun attachSessionDelegates(session: GeckoSession) {
        session.setNavigationDelegate(object : GeckoSession.NavigationDelegate {
            override fun onLoadRequest(
                session: GeckoSession,
                request: GeckoSession.NavigationDelegate.LoadRequest
            ): GeckoResult<AllowOrDeny>? {
                val uri = request.uri ?: return null
                if (uri.startsWith("mailto:")) {
                    runCatching { startActivity(Intent(Intent.ACTION_SENDTO, Uri.parse(uri))) }
                    return GeckoResult.deny()
                }
                if (uri.startsWith("tel:")) {
                    runCatching { startActivity(Intent(Intent.ACTION_DIAL, Uri.parse(uri))) }
                    return GeckoResult.deny()
                }
                if (request.target == GeckoSession.NavigationDelegate.TARGET_WINDOW_NEW) {
                    // Handle target="_blank" and window.open() ourselves. Defer the View
                    // switch until after GeckoView has completed this navigation callback.
                    when {
                        uri == "about:blank" ||
                            uri.startsWith("moz-extension://") ||
                            uri.startsWith("https://") ||
                            uri.startsWith("http://") -> geckoView.post {
                                if (!isFinishing && !isDestroyed) createTab(uri)
                            }
                        else -> runCatching {
                            startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(uri)))
                        }
                    }
                    return GeckoResult.deny()
                }
                return null
            }

            override fun onSubframeLoadRequest(
                session: GeckoSession,
                request: GeckoSession.NavigationDelegate.LoadRequest
            ): GeckoResult<AllowOrDeny>? {
                val uri = request.uri ?: return null
                return if (uri.startsWith("https://") || uri.startsWith("http://")) GeckoResult.allow() else null
            }

            override fun onLocationChange(
                session: GeckoSession,
                url: String?,
                perms: MutableList<GeckoSession.PermissionDelegate.ContentPermission>,
                hasUserGesture: Boolean
            ) {
                if (session === activeSession() && url != null) address.setText(url)
            }
        })

        session.setPermissionDelegate(object : GeckoSession.PermissionDelegate {
            override fun onAndroidPermissionsRequest(
                session: GeckoSession,
                permissions: Array<out String>?,
                callback: GeckoSession.PermissionDelegate.Callback
            ) {
                requestAndroidPermissions(permissions) { granted ->
                    if (granted) callback.grant() else callback.reject()
                }
            }

            override fun onMediaPermissionRequest(
                session: GeckoSession,
                uri: String,
                video: Array<out GeckoSession.PermissionDelegate.MediaSource>?,
                audio: Array<out GeckoSession.PermissionDelegate.MediaSource>?,
                callback: GeckoSession.PermissionDelegate.MediaCallback
            ) {
                val videoSource = video?.firstOrNull {
                    it.source == GeckoSession.PermissionDelegate.MediaSource.SOURCE_CAMERA &&
                        it.type == GeckoSession.PermissionDelegate.MediaSource.TYPE_VIDEO
                } ?: video?.firstOrNull {
                    it.type == GeckoSession.PermissionDelegate.MediaSource.TYPE_VIDEO
                }
                val audioSource = audio?.firstOrNull {
                    it.source == GeckoSession.PermissionDelegate.MediaSource.SOURCE_MICROPHONE &&
                        it.type == GeckoSession.PermissionDelegate.MediaSource.TYPE_AUDIO
                } ?: audio?.firstOrNull {
                    it.type == GeckoSession.PermissionDelegate.MediaSource.TYPE_AUDIO
                }

                if ((video != null && videoSource == null) || (audio != null && audioSource == null)) {
                    callback.reject()
                    return
                }

                val requiredPermissions = buildList {
                    if (videoSource != null) add(Manifest.permission.CAMERA)
                    if (audioSource != null) add(Manifest.permission.RECORD_AUDIO)
                }
                requestAndroidPermissions(requiredPermissions.toTypedArray()) { granted ->
                    if (granted) callback.grant(videoSource, audioSource) else callback.reject()
                }
            }
        })

        session.setPromptDelegate(object : GeckoSession.PromptDelegate {
            override fun onFilePrompt(
                session: GeckoSession,
                prompt: GeckoSession.PromptDelegate.FilePrompt
            ): GeckoResult<GeckoSession.PromptDelegate.PromptResponse> {
                val result = GeckoResult<GeckoSession.PromptDelegate.PromptResponse>()
                pendingFilePrompt = prompt
                pendingFileResult = result
                val allowedMimeTypes = prompt.mimeTypes?.distinct()?.toTypedArray() ?: emptyArray()
                val intent = Intent(Intent.ACTION_OPEN_DOCUMENT).apply {
                    addCategory(Intent.CATEGORY_OPENABLE)
                    // Android requires */* as the base type when EXTRA_MIME_TYPES contains
                    // several types (for example image/* and video/*).
                    type = if (allowedMimeTypes.size > 1) "*/*" else allowedMimeTypes.firstOrNull() ?: "*/*"
                    if (allowedMimeTypes.size > 1) putExtra(Intent.EXTRA_MIME_TYPES, allowedMimeTypes)
                    putExtra(
                        Intent.EXTRA_ALLOW_MULTIPLE,
                        prompt.type == GeckoSession.PromptDelegate.FilePrompt.Type.MULTIPLE
                    )
                }
                return try {
                    startActivityForResult(intent, REQUEST_FILE_PICKER)
                    result
                } catch (_: Exception) {
                    pendingFilePrompt = null
                    pendingFileResult = null
                    result.complete(prompt.dismiss())
                    result
                }
            }
        })
    }

    private fun normalizeUrlOrExtension(value: String): String = when {
        value == "about:blank" -> value
        value.startsWith("moz-extension://") -> value
        value.startsWith("https://") || value.startsWith("http://") -> value
        else -> normalizeUrl(value)
    }

    private fun requestAndroidPermissions(
        requestedPermissions: Array<out String>?,
        onResult: (Boolean) -> Unit
    ) {
        val missing = requestedPermissions?.distinct().orEmpty().filter {
            checkSelfPermission(it) != PackageManager.PERMISSION_GRANTED
        }
        if (missing.isEmpty()) {
            onResult(true)
            return
        }

        val requestCode = REQUEST_PERMISSION_BASE + (++permissionRequestCounter % 100000)
        pendingPermissionCallbacks[requestCode] = onResult
        try {
            requestPermissions(missing.toTypedArray(), requestCode)
        } catch (_: Exception) {
            pendingPermissionCallbacks.remove(requestCode)
            onResult(false)
            showNotification("Schleim OS", "Android-Berechtigung konnte nicht angefordert werden.")
        }
    }

    private fun load(url: String) {
        val target = normalizeUrlOrExtension(url)
        address.setText(target)
        val current = activeSession()
        if (current == null) createTab(target) else current.loadUri(target)
    }

    private fun navigate(input: String) {
        val value = input.trim()
        if (value.isEmpty()) return
        val target = if (value.contains(" ") || (!value.contains(".") && !value.startsWith("http"))) {
            "https://www.google.com/search?q=" + Uri.encode(value)
        } else normalizeUrl(value)
        if (activeSession() == null) createTab(target) else load(target)
    }

    private fun normalizeUrl(value: String): String =
        if (value.startsWith("https://") || value.startsWith("http://")) value else "https://$value"

    private fun requestDefaultBrowserRole() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            val manager = getSystemService(RoleManager::class.java)
            if (manager.isRoleAvailable(RoleManager.ROLE_BROWSER) && !manager.isRoleHeld(RoleManager.ROLE_BROWSER)) {
                startActivityForResult(manager.createRequestRoleIntent(RoleManager.ROLE_BROWSER), REQUEST_BROWSER_ROLE)
            } else {
                showNotification("Schleim OS", "Schleim OS ist bereits als Standardbrowser festgelegt.")
            }
        } else {
            showNotification("Schleim OS", "Die Standardbrowser-Auswahl benötigt eine neuere Android-Version.")
        }
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            getSystemService(NotificationManager::class.java).createNotificationChannel(
                NotificationChannel(CHANNEL_ID, "Schleim OS", NotificationManager.IMPORTANCE_DEFAULT)
            )
        }
    }

    private fun requestNotificationPermissionIfNeeded() {
        if (Build.VERSION.SDK_INT >= 33 &&
            checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED
        ) {
            requestPermissions(arrayOf(Manifest.permission.POST_NOTIFICATIONS), REQUEST_NOTIFICATIONS)
        }
    }

    private fun showNotification(title: String, message: String) {
        val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        val openApp = PendingIntent.getActivity(
            this, 0,
            Intent(this, MainActivity::class.java).putExtra(EXTRA_OPEN_APP, "images"),
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        val notification = NotificationCompat.Builder(this, CHANNEL_ID)
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setContentTitle(title)
            .setContentText(message)
            .setContentIntent(openApp)
            .setAutoCancel(true)
            .build()
        try { manager.notify(NOTIFICATION_ID, notification) } catch (_: SecurityException) { }
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        val app = intent.getStringExtra(EXTRA_OPEN_APP)
        if (!app.isNullOrBlank()) {
            val home = extensionHomeUrl
            if (home != null) {
                val target = home + "?openApp=" + Uri.encode(app)
                if (activeSession() == null) createTab(target) else load(target)
            }
            return
        }
        intent.data?.toString()?.let {
            if (activeSession() == null) createTab(it) else load(it)
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == REQUEST_BROWSER_ROLE) return
        if (requestCode != REQUEST_FILE_PICKER) return

        val prompt = pendingFilePrompt
        val result = pendingFileResult
        pendingFilePrompt = null
        pendingFileResult = null
        if (prompt == null || result == null) return

        if (resultCode == RESULT_OK && data != null) {
            val uris = mutableListOf<Uri>()
            data.clipData?.let { clip ->
                for (i in 0 until clip.itemCount) clip.getItemAt(i).uri?.let { uris.add(it) }
            }
            if (uris.isEmpty()) data.data?.let { uris.add(it) }
            if (uris.isNotEmpty()) {
                result.complete(
                    if (uris.size == 1) prompt.confirm(this, uris.first())
                    else prompt.confirm(this, uris.toTypedArray())
                )
            } else {
                result.complete(prompt.dismiss())
            }
        } else {
            result.complete(prompt.dismiss())
        }
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        val callback = pendingPermissionCallbacks.remove(requestCode) ?: return
        val granted = permissions.isNotEmpty() &&
            permissions.size == grantResults.size &&
            grantResults.all { it == PackageManager.PERMISSION_GRANTED }
        callback(granted)
    }

    override fun onDestroy() {
        pendingFileResult?.complete(pendingFilePrompt?.dismiss())
        pendingFileResult = null
        pendingFilePrompt = null
        pendingPermissionCallbacks.values.forEach { callback -> runCatching { callback(false) } }
        pendingPermissionCallbacks.clear()
        if (displayedSession != null) runCatching { geckoView.releaseSession() }
        displayedSession = null
        tabs.forEach { runCatching { it.close() } }
        tabs.clear()
        mediaView?.let { runCatching { it.releaseSession() } }
        mediaSession?.let { runCatching { it.close() } }
        mediaSession = null
        mediaView = null
        super.onDestroy()
    }

    companion object {
        private const val BUNDLED_EXTENSION_URI = "resource://android/assets/extension/"
        private const val EXTENSION_ID = "schleim-os-android@schneckeschneck.de"
        private const val NATIVE_APP_ID = "browser"
        private const val CHANNEL_ID = "schleim_os_general"
        private const val NOTIFICATION_ID = 1501
        private const val REQUEST_NOTIFICATIONS = 1502
        private const val REQUEST_BROWSER_ROLE = 1503
        private const val REQUEST_FILE_PICKER = 1504
        private const val REQUEST_PERMISSION_BASE = 4100
        private const val EXTRA_OPEN_APP = "schleim_os_open_app"
    }
}
