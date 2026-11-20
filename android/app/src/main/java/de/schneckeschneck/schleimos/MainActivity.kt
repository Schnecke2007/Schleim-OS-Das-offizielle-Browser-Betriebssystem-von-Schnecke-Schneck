package de.schneckeschneck.schleimos

import android.Manifest
import android.app.Activity
import android.app.AlertDialog
import android.app.Dialog
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.role.RoleManager
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Color
import android.graphics.Typeface
import android.graphics.drawable.ColorDrawable
import android.graphics.drawable.GradientDrawable
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.Environment
import android.provider.OpenableColumns
import android.util.Base64
import android.util.Log
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.view.Window
import android.view.inputmethod.EditorInfo
import android.view.inputmethod.InputMethodManager
import android.webkit.MimeTypeMap
import android.widget.Button
import android.widget.EditText
import android.widget.FrameLayout
import android.widget.GridLayout
import android.widget.LinearLayout
import android.widget.ProgressBar
import android.widget.ScrollView
import android.widget.TextView
import android.widget.Toast
import androidx.core.app.NotificationCompat
import androidx.core.content.FileProvider
import org.json.JSONObject
import org.mozilla.geckoview.AllowOrDeny
import org.mozilla.geckoview.GeckoResult
import org.mozilla.geckoview.GeckoRuntime
import org.mozilla.geckoview.GeckoSession
import org.mozilla.geckoview.GeckoSessionSettings
import org.mozilla.geckoview.GeckoView
import org.mozilla.geckoview.WebExtension
import org.mozilla.geckoview.WebExtensionController
import org.mozilla.geckoview.WebResponse
import java.io.File
import java.io.FileOutputStream
import java.net.URLDecoder
import java.util.Date
import java.text.SimpleDateFormat
import java.util.Locale
import java.util.concurrent.Executors

class MainActivity : Activity() {
    private lateinit var rootFrame: FrameLayout
    private lateinit var browserColumn: LinearLayout
    private lateinit var geckoView: GeckoView
    private lateinit var address: EditText
    private lateinit var tabsButton: TextView
    private lateinit var backButton: TextView
    private lateinit var forwardButton: TextView
    private lateinit var reloadButton: TextView
    private lateinit var progressBar: ProgressBar
    private lateinit var titleLabel: TextView
    private lateinit var runtime: GeckoRuntime

    private var extension: WebExtension? = null
    private var extensionHomeUrl: String? = null
    private val tabs = mutableListOf<GeckoSession>()
    private var activeTabIndex = 0
    private var displayedSession: GeckoSession? = null
    private val navigationStates = mutableMapOf<GeckoSession, Pair<Boolean, Boolean>>()
    private val sessionUrls = mutableMapOf<GeckoSession, String>()
    private val sessionTitles = mutableMapOf<GeckoSession, String>()
    private var desktopMode = false
    private val downloadExecutor = Executors.newSingleThreadExecutor()
    // Keep file listing, document writes and XPI copying away from Android's UI thread.
    private val ioExecutor = Executors.newFixedThreadPool(2)

    private var mediaSession: GeckoSession? = null
    private var mediaView: GeckoView? = null
    private var mediaPageReady = false
    private var pendingMediaReady: GeckoResult<Any>? = null

    private var pendingFilePrompt: GeckoSession.PromptDelegate.FilePrompt? = null
    private var pendingFileResult: GeckoResult<GeckoSession.PromptDelegate.PromptResponse>? = null
    private var pendingSaveResult: GeckoResult<Any>? = null
    private var pendingSaveFileName = ""
    private var pendingSaveMimeType = "application/octet-stream"
    private var pendingSaveBase64 = ""

    private data class DialogParts(val dialog: Dialog, val body: LinearLayout)
    private data class BrowserAction(
        val icon: String,
        val title: String,
        val subtitle: String,
        val run: () -> Unit
    )

    private val pageBackground = Color.rgb(37, 18, 5)       // #251205 – Schleim OS background
    private val surface = Color.rgb(53, 34, 23)
    private val surfaceRaised = Color.rgb(66, 44, 30)
    private val border = Color.rgb(105, 76, 52)
    private val accent = Color.rgb(213, 166, 109)
    private val textPrimary = Color.rgb(250, 242, 232)
    private val textMuted = Color.rgb(190, 168, 146)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        desktopMode = getSharedPreferences(PREFERENCES, MODE_PRIVATE).getBoolean(KEY_DESKTOP_MODE, false)
        window.statusBarColor = pageBackground
        window.navigationBarColor = pageBackground
        window.decorView.systemUiVisibility = 0
        createNotificationChannel()
        buildBrowserUi()
        runtime = GeckoRuntime.create(this)
        configureExtensionPrompts()
        openBrowser(intent?.data?.toString())
        requestNotificationPermissionIfNeeded()
    }

    private fun dp(value: Int): Int = (value * resources.displayMetrics.density).toInt()

    private fun roundedBackground(color: Int, stroke: Int = border, radius: Int = 12): GradientDrawable =
        GradientDrawable().apply {
            setColor(color)
            cornerRadius = dp(radius).toFloat()
            if (stroke != Color.TRANSPARENT) setStroke(dp(1), stroke)
        }

    private fun buildBrowserUi() {
        rootFrame = FrameLayout(this).apply { setBackgroundColor(pageBackground) }
        browserColumn = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setBackgroundColor(pageBackground)
            setPadding(dp(10), dp(5), dp(10), 0)
        }

        val brandRow = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
            setPadding(0, dp(2), 0, dp(7))
        }
        val snailMark = TextView(this).apply {
            text = "🐌"
            textSize = 21f
            gravity = Gravity.CENTER
            background = roundedBackground(surfaceRaised, border, 10)
            contentDescription = "Schleim Browser"
        }
        brandRow.addView(snailMark, LinearLayout.LayoutParams(dp(38), dp(38)))
        val brandCopy = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(9), 0, 0, 0)
        }
        brandCopy.addView(TextView(this).apply {
            text = "SCHLEIM BROWSER"
            textSize = 12f
            setTextColor(textPrimary)
            typeface = Typeface.create("sans-serif", Typeface.BOLD)
            letterSpacing = 0.07f
        })
        brandCopy.addView(TextView(this).apply {
            text = "BROWSER"
            textSize = 8f
            setTextColor(textMuted)
            letterSpacing = 0.18f
        })
        brandRow.addView(brandCopy, LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f))
        brandRow.addView(makeIconButton("⌂", "Schleim-OS-Startseite öffnen") { openHomePage() },
            LinearLayout.LayoutParams(dp(36), dp(36)).apply { marginEnd = dp(6) })
        tabsButton = makeIconButton("▢ 1", "Registerkarten anzeigen") { showTabsDialog() }
        brandRow.addView(tabsButton, LinearLayout.LayoutParams(dp(48), dp(36)).apply { marginEnd = dp(6) })
        brandRow.addView(makeIconButton("+", "Neuen Tab öffnen") { createUserTab() },
            LinearLayout.LayoutParams(dp(36), dp(36)).apply { marginEnd = dp(6) })
        brandRow.addView(makeIconButton("☰", "Browser-Menü öffnen") { showBrowserMenu() },
            LinearLayout.LayoutParams(dp(36), dp(36)))
        browserColumn.addView(brandRow)

        val navigationRow = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
            setPadding(0, 0, 0, dp(7))
        }
        backButton = makeIconButton("‹", "Zurück") { activeSession()?.goBack() }
        forwardButton = makeIconButton("›", "Vorwärts") { activeSession()?.goForward() }
        navigationRow.addView(backButton, LinearLayout.LayoutParams(dp(36), dp(38)).apply { marginEnd = dp(5) })
        navigationRow.addView(forwardButton, LinearLayout.LayoutParams(dp(36), dp(38)).apply { marginEnd = dp(5) })

        val addressBox = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
            background = roundedBackground(surfaceRaised, border, 12)
            setPadding(dp(8), 0, dp(4), 0)
        }
        addressBox.addView(TextView(this).apply {
            text = "⌕"
            textSize = 19f
            setTextColor(accent)
            gravity = Gravity.CENTER
        }, LinearLayout.LayoutParams(dp(23), dp(38)))
        address = EditText(this).apply {
            hint = "Suchen oder Webadresse eingeben"
            setSingleLine(true)
            textSize = 12f
            setTextColor(textPrimary)
            setHintTextColor(textMuted)
            setSelectAllOnFocus(true)
            background = ColorDrawable(Color.TRANSPARENT)
            setPadding(dp(2), 0, dp(2), 0)
            imeOptions = EditorInfo.IME_ACTION_GO
            inputType = android.text.InputType.TYPE_CLASS_TEXT
            setOnEditorActionListener { _, action, _ ->
                if (action == EditorInfo.IME_ACTION_GO || action == EditorInfo.IME_ACTION_DONE) {
                    navigate(address.text.toString())
                    true
                } else false
            }
            setOnFocusChangeListener { _, hasFocus ->
                if (!hasFocus) refreshAddressFromActiveTab()
            }
        }
        addressBox.addView(address, LinearLayout.LayoutParams(0, dp(38), 1f))
        addressBox.addView(makeIconButton("↵", "Adresse öffnen oder Google-Suche starten") {
            navigate(address.text.toString())
        }, LinearLayout.LayoutParams(dp(32), dp(32)))
        navigationRow.addView(addressBox, LinearLayout.LayoutParams(0, dp(38), 1f).apply {
            marginEnd = dp(5)
        })
        reloadButton = makeIconButton("↻", "Seite neu laden") { activeSession()?.reload() }
        navigationRow.addView(reloadButton, LinearLayout.LayoutParams(dp(36), dp(38)))
        browserColumn.addView(navigationRow)

        progressBar = ProgressBar(this, null, android.R.attr.progressBarStyleHorizontal).apply {
            max = 100
            progress = 0
            progressTintList = android.content.res.ColorStateList.valueOf(accent)
            progressBackgroundTintList = android.content.res.ColorStateList.valueOf(Color.rgb(72, 50, 34))
            visibility = View.GONE
        }
        browserColumn.addView(progressBar, LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(2)))

        titleLabel = TextView(this).apply {
            text = "Schleim Browser – Startseite"
            textSize = 8f
            setTextColor(textMuted)
            maxLines = 1
            ellipsize = android.text.TextUtils.TruncateAt.END
            setPadding(dp(2), dp(3), dp(2), dp(4))
        }
        browserColumn.addView(titleLabel)

        geckoView = GeckoView(this)
        browserColumn.addView(
            geckoView,
            LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 0, 1f)
        )
        rootFrame.addView(
            browserColumn,
            FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT)
        )
        setContentView(rootFrame)
        updateNavigationButtons()
        updateTabsButton()
    }

    private fun makeIconButton(symbol: String, description: String, action: () -> Unit): TextView =
        TextView(this).apply {
            text = symbol
            contentDescription = description
            textSize = if (symbol.length > 2) 12f else 19f
            setTextColor(textPrimary)
            gravity = Gravity.CENTER
            typeface = Typeface.create("sans-serif-medium", Typeface.NORMAL)
            background = roundedBackground(surface, border, 10)
            isClickable = true
            isFocusable = true
            setOnClickListener { action() }
        }

    private fun makeTextButton(label: String, action: () -> Unit): TextView =
        TextView(this).apply {
            text = label
            textSize = 10f
            setTextColor(textPrimary)
            gravity = Gravity.CENTER
            typeface = Typeface.create("sans-serif-medium", Typeface.NORMAL)
            setPadding(dp(11), dp(9), dp(11), dp(9))
            background = roundedBackground(surfaceRaised, border, 9)
            isClickable = true
            isFocusable = true
            setOnClickListener { action() }
        }

    private fun setButtonAvailable(button: TextView, enabled: Boolean) {
        button.isEnabled = enabled
        button.alpha = if (enabled) 1f else 0.38f
    }

    private fun openBrowser(initialUrl: String?) {
        runtime.getWebExtensionController()
            .ensureBuiltIn(BUNDLED_EXTENSION_URI, EXTENSION_ID)
            .accept({ installed ->
                if (installed == null) {
                    showToast("Die integrierte Schleim-OS-Extension konnte nicht installiert werden.")
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

    private fun configureExtensionPrompts() {
        runtime.getWebExtensionController().setPromptDelegate(object : WebExtensionController.PromptDelegate {
            override fun onInstallPromptRequest(
                extension: WebExtension,
                permissions: Array<out String>,
                origins: Array<out String>,
                dataCollectionPermissions: Array<out String>
            ): GeckoResult<WebExtension.PermissionPromptResponse> {
                val result = GeckoResult<WebExtension.PermissionPromptResponse>()
                runOnUiThread {
                    val permissionLines = mutableListOf<String>()
                    if (permissions.isNotEmpty()) permissionLines.add("Berechtigungen: " + permissions.joinToString(", "))
                    if (origins.isNotEmpty()) permissionLines.add("Webseitenzugriff: " + origins.joinToString(", "))
                    if (dataCollectionPermissions.isNotEmpty()) {
                        permissionLines.add("Datennutzung: " + dataCollectionPermissions.joinToString(", "))
                    }
                    val details = buildString {
                        append(extension.metaData.name ?: "Unbekannte Erweiterung")
                        append("\nVersion ")
                        append(extension.metaData.version)
                        if (extension.metaData.description?.isNotBlank() == true) {
                            append("\n\n")
                            append(extension.metaData.description)
                        }
                        if (permissionLines.isNotEmpty()) {
                            append("\n\n")
                            append(permissionLines.joinToString("\n\n"))
                        }
                        append("\n\nInstalliere nur Erweiterungen aus vertrauenswürdigen Quellen.")
                    }
                    AlertDialog.Builder(this@MainActivity)
                        .setTitle("Erweiterung installieren?")
                        .setMessage(details)
                        .setPositiveButton("Installieren") { _, _ ->
                            result.complete(WebExtension.PermissionPromptResponse(true, false, false))
                        }
                        .setNegativeButton("Abbrechen") { _, _ ->
                            result.complete(WebExtension.PermissionPromptResponse(false, false, false))
                        }
                        .setOnCancelListener {
                            result.complete(WebExtension.PermissionPromptResponse(false, false, false))
                        }
                        .show()
                }
                return result
            }

            override fun onOptionalPrompt(
                extension: WebExtension,
                permissions: Array<out String>,
                origins: Array<out String>,
                dataCollectionPermissions: Array<out String>
            ): GeckoResult<AllowOrDeny>? {
                return GeckoResult.fromValue(AllowOrDeny.DENY)
            }

            override fun onUpdatePrompt(
                extension: WebExtension,
                newPermissions: Array<out String>,
                newOrigins: Array<out String>,
                newDataCollectionPermissions: Array<out String>
            ): GeckoResult<AllowOrDeny>? {
                return GeckoResult.fromValue(AllowOrDeny.DENY)
            }
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
                "file.save" -> saveFileFromExtension(payload)
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

    private fun saveFileFromExtension(payload: JSONObject): GeckoResult<Any> {
        val encoded = payload.optString("contentBase64", "")
        if (encoded.isBlank() || encoded.length > 2_000_000) {
            return GeckoResult.fromValue(JSONObject().put("ok", false).put("error", "Die Datei ist leer oder zu groß."))
        }
        val fileName = payload.optString("fileName", "schleim-browser-datei.json")
            .replace(Regex("[^A-Za-z0-9._-]"), "_")
            .take(100)
            .ifBlank { "schleim-browser-datei.json" }
        val requestedMime = payload.optString("mimeType", "application/octet-stream")
        val mimeType = if (Regex("^[A-Za-z0-9.+-]+/[A-Za-z0-9.+-]+$").matches(requestedMime)) requestedMime else "application/octet-stream"
        val result = GeckoResult<Any>()
        runOnUiThread {
            if (pendingSaveResult != null) {
                result.complete(JSONObject().put("ok", false).put("error", "Ein Speicherdialog ist bereits geöffnet."))
                return@runOnUiThread
            }
            pendingSaveResult = result
            pendingSaveFileName = fileName
            pendingSaveMimeType = mimeType
            pendingSaveBase64 = encoded
            val intent = Intent(Intent.ACTION_CREATE_DOCUMENT).apply {
                addCategory(Intent.CATEGORY_OPENABLE)
                type = mimeType
                putExtra(Intent.EXTRA_TITLE, fileName)
            }
            try {
                startActivityForResult(intent, REQUEST_SAVE_FILE)
            } catch (error: Exception) {
                pendingSaveResult = null
                pendingSaveBase64 = ""
                result.complete(JSONObject().put("ok", false).put("error", error.message ?: "Speicherdialog konnte nicht geöffnet werden."))
            }
        }
        return result
    }

    private fun completeSaveFile(resultCode: Int, data: Intent?) {
        val result = pendingSaveResult ?: return
        val fileName = pendingSaveFileName
        val encoded = pendingSaveBase64
        pendingSaveResult = null
        pendingSaveBase64 = ""
        pendingSaveFileName = ""
        pendingSaveMimeType = "application/octet-stream"
        if (resultCode != RESULT_OK || data?.data == null) {
            result.complete(JSONObject().put("ok", false).put("error", "Speichern abgebrochen."))
            return
        }
        val destinationUri = data.data!!
        ioExecutor.execute {
            try {
                val bytes = Base64.decode(encoded, Base64.DEFAULT)
                contentResolver.openOutputStream(destinationUri, "w")?.use { output ->
                    output.write(bytes)
                    output.flush()
                } ?: throw IllegalStateException("Die Zieldatei konnte nicht geöffnet werden.")
                result.complete(JSONObject().put("ok", true).put("fileName", fileName))
                runOnUiThread {
                    if (!isFinishing && !isDestroyed) showToast("Datei gespeichert: " + fileName)
                }
            } catch (error: Exception) {
                result.complete(JSONObject().put("ok", false).put("error", error.message ?: "Datei konnte nicht gespeichert werden."))
                runOnUiThread {
                    if (!isFinishing && !isDestroyed) showToast("Datei konnte nicht gespeichert werden.")
                }
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

    private fun sessionSettings(): GeckoSessionSettings =
        GeckoSessionSettings().apply {
            setUserAgentMode(
                if (desktopMode) GeckoSessionSettings.USER_AGENT_MODE_DESKTOP
                else GeckoSessionSettings.USER_AGENT_MODE_MOBILE
            )
            setViewportMode(
                if (desktopMode) GeckoSessionSettings.VIEWPORT_MODE_DESKTOP
                else GeckoSessionSettings.VIEWPORT_MODE_MOBILE
            )
        }

    private fun createTab(url: String?): GeckoSession {
        pruneBackgroundTabsForNewTab()
        val session = GeckoSession(sessionSettings())
        attachSessionDelegates(session)
        session.open(runtime)
        tabs.add(session)
        activeTabIndex = tabs.lastIndex
        showSessionInBrowser(session)
        if (!url.isNullOrBlank()) {
            val target = normalizeUrlOrExtension(url)
            sessionUrls[session] = target
            session.loadUri(target)
        }
        updateTabsButton()
        return session
    }

    /**
     * GeckoSession retains page state and renderer resources while a tab exists.
     * Keep a small, predictable tab budget on phones so long browsing sessions
     * cannot accumulate an unbounded number of content sessions.
     */
    private fun pruneBackgroundTabsForNewTab() {
        while (tabs.size >= MAX_OPEN_TABS) {
            val victimIndex = tabs.indices.firstOrNull { it != activeTabIndex } ?: return
            val victim = tabs.removeAt(victimIndex)
            runCatching { victim.setFocused(false) }
            runCatching { victim.setActive(false) }
            runCatching { victim.close() }
            navigationStates.remove(victim)
            sessionUrls.remove(victim)
            sessionTitles.remove(victim)
            if (activeTabIndex > victimIndex) activeTabIndex--
        }
    }

    private fun showSessionInBrowser(session: GeckoSession) {
        if (displayedSession !== session) {
            displayedSession?.let { previous ->
                // A background tab must not keep running scripts or retain an
                // active compositor after its surface is detached.
                runCatching { previous.setFocused(false) }
                runCatching { previous.setActive(false) }
                runCatching { geckoView.releaseSession() }
            }
            geckoView.setSession(session)
            displayedSession = session
        }
        // Only the visible tab stays active. GeckoView releases memory and
        // pauses page scripts for all tabs that are no longer on screen.
        session.setActive(true)
        session.setFocused(true)
        updateTabsButton()
        refreshAddressFromActiveTab()
        refreshTitleFromActiveTab()
        updateNavigationButtons()
    }

    private fun createUserTab() {
        createTab(extensionHomeUrl ?: "https://www.google.com")
    }

    private fun openHomePage() {
        val home = extensionHomeUrl
        if (home == null) {
            showToast("Die Schleim-OS-Startseite wird noch vorbereitet.")
        } else {
            load(home)
        }
    }

    private fun showTabsDialog() {
        val parts = createDialogShell("Registerkarten", "Zwischen offenen Seiten wechseln oder Tabs schließen.")
        val newTab = makeWideActionButton("＋  Neuer Tab") {
            parts.dialog.dismiss()
            createUserTab()
        }
        parts.body.addView(newTab, LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(42)).apply {
            bottomMargin = dp(10)
        })
        if (tabs.isEmpty()) {
            parts.body.addView(dialogMessage("Noch keine geöffneten Tabs."))
        } else {
            tabs.forEachIndexed { index, session ->
                val active = index == activeTabIndex
                val row = LinearLayout(this).apply {
                    orientation = LinearLayout.HORIZONTAL
                    gravity = Gravity.CENTER_VERTICAL
                    background = roundedBackground(if (active) surfaceRaised else surface, if (active) accent else border, 10)
                    setPadding(dp(10), dp(8), dp(7), dp(8))
                }
                val copy = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL }
                copy.addView(TextView(this).apply {
                    text = sessionTitles[session] ?: if (active) "Aktueller Tab" else "Neuer Tab"
                    textSize = 11f
                    setTextColor(textPrimary)
                    maxLines = 1
                    ellipsize = android.text.TextUtils.TruncateAt.END
                })
                copy.addView(TextView(this).apply {
                    text = sessionUrls[session] ?: "Noch keine Adresse"
                    textSize = 8f
                    setTextColor(textMuted)
                    maxLines = 1
                    ellipsize = android.text.TextUtils.TruncateAt.MIDDLE
                })
                row.addView(copy, LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f))
                val close = makeIconButton("×", "Tab schließen") { closeTab(index); parts.dialog.dismiss() }
                row.addView(close, LinearLayout.LayoutParams(dp(34), dp(34)).apply { marginStart = dp(6) })
                row.setOnClickListener {
                    activeTabIndex = index
                    showSessionInBrowser(session)
                    parts.dialog.dismiss()
                }
                parts.body.addView(row, LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT).apply {
                    bottomMargin = dp(7)
                })
            }
        }
        showDialog(parts.dialog)
    }

    private fun closeTab(index: Int) {
        if (index !in tabs.indices) return
        if (tabs.size == 1) {
            load(extensionHomeUrl ?: "https://www.google.com")
            return
        }
        val removed = tabs.removeAt(index)
        if (removed === displayedSession) {
            runCatching { removed.setFocused(false) }
            runCatching { removed.setActive(false) }
            runCatching { geckoView.releaseSession() }
            displayedSession = null
        }
        removed.close()
        navigationStates.remove(removed)
        sessionUrls.remove(removed)
        sessionTitles.remove(removed)
        if (activeTabIndex > index) activeTabIndex--
        if (activeTabIndex >= tabs.size) activeTabIndex = tabs.lastIndex
        showSessionInBrowser(tabs[activeTabIndex])
    }

    private fun updateTabsButton() {
        if (!::tabsButton.isInitialized) return
        tabsButton.text = "▢ " + tabs.size
    }

    private fun activeSession(): GeckoSession? = tabs.getOrNull(activeTabIndex)

    private fun updateNavigationButtons() {
        val state = activeSession()?.let { navigationStates[it] } ?: Pair(false, false)
        if (::backButton.isInitialized) setButtonAvailable(backButton, state.first)
        if (::forwardButton.isInitialized) setButtonAvailable(forwardButton, state.second)
    }

    private fun refreshAddressFromActiveTab() {
        val current = activeSession() ?: return
        if (!address.hasFocus()) address.setText(sessionUrls[current] ?: "")
    }

    private fun refreshTitleFromActiveTab() {
        val current = activeSession()
        titleLabel.text = current?.let { sessionTitles[it] ?: "Schleim Browser" } ?: "Schleim Browser"
    }

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
                    when {
                        uri == "about:blank" ||
                            uri.startsWith("moz-extension://") ||
                            uri.startsWith("https://") ||
                            uri.startsWith("http://") -> geckoView.post {
                                if (!isFinishing && !isDestroyed) createTab(uri)
                            }
                        else -> runCatching { startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(uri))) }
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
                if (url != null) sessionUrls[session] = url
                if (session === activeSession() && url != null && !address.hasFocus()) address.setText(url)
            }

            override fun onCanGoBack(session: GeckoSession, canGoBack: Boolean) {
                val existing = navigationStates[session] ?: Pair(false, false)
                navigationStates[session] = Pair(canGoBack, existing.second)
                if (session === activeSession()) updateNavigationButtons()
            }

            override fun onCanGoForward(session: GeckoSession, canGoForward: Boolean) {
                val existing = navigationStates[session] ?: Pair(false, false)
                navigationStates[session] = Pair(existing.first, canGoForward)
                if (session === activeSession()) updateNavigationButtons()
            }
        })

        session.setProgressDelegate(object : GeckoSession.ProgressDelegate {
            override fun onPageStart(session: GeckoSession, url: String) {
                sessionUrls[session] = url
                if (session === activeSession()) {
                    if (!address.hasFocus()) address.setText(url)
                    progressBar.progress = 2
                    progressBar.visibility = View.VISIBLE
                }
            }

            override fun onProgressChange(session: GeckoSession, progress: Int) {
                if (session === activeSession()) {
                    progressBar.progress = progress.coerceIn(0, 100)
                    progressBar.visibility = if (progress >= 100) View.GONE else View.VISIBLE
                }
            }

            override fun onPageStop(session: GeckoSession, success: Boolean) {
                if (session === activeSession()) {
                    progressBar.progress = 100
                    progressBar.visibility = View.GONE
                    refreshAddressFromActiveTab()
                }
            }
        })

        session.setContentDelegate(object : GeckoSession.ContentDelegate {
            override fun onTitleChange(session: GeckoSession, title: String?) {
                if (!title.isNullOrBlank()) sessionTitles[session] = title
                if (session === activeSession()) refreshTitleFromActiveTab()
            }

            override fun onExternalResponse(session: GeckoSession, response: WebResponse) {
                saveDownload(response)
            }

            override fun onCloseRequest(session: GeckoSession) {
                val index = tabs.indexOf(session)
                if (index >= 0) closeTab(index)
            }
        })

        // The Android app deliberately does not expose camera or microphone capture.
        // Reject media and Android runtime permission requests so no capture prompt appears.
        session.setPermissionDelegate(object : GeckoSession.PermissionDelegate {
            override fun onAndroidPermissionsRequest(
                session: GeckoSession,
                permissions: Array<out String>?,
                callback: GeckoSession.PermissionDelegate.Callback
            ) {
                callback.reject()
            }

            override fun onMediaPermissionRequest(
                session: GeckoSession,
                uri: String,
                video: Array<out GeckoSession.PermissionDelegate.MediaSource>?,
                audio: Array<out GeckoSession.PermissionDelegate.MediaSource>?,
                callback: GeckoSession.PermissionDelegate.MediaCallback
            ) {
                callback.reject()
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
        value.startsWith("https://", true) || value.startsWith("http://", true) -> value
        else -> normalizeUrl(value)
    }

    private fun load(url: String) {
        val target = normalizeUrlOrExtension(url)
        address.setText(target)
        address.clearFocus()
        hideKeyboard()
        val current = activeSession()
        if (current == null) createTab(target) else {
            sessionUrls[current] = target
            current.loadUri(target)
        }
    }

    private fun navigate(input: String) {
        val value = input.trim()
        if (value.isEmpty()) return
        val hasWhitespace = value.any { it.isWhitespace() }
        val hasScheme = Regex("^[a-zA-Z][a-zA-Z0-9+.-]*://").containsMatchIn(value)
        val looksLikeIp = Regex("^(?:[0-9]{1,3}\\.){3}[0-9]{1,3}(?::[0-9]+)?(?:/.*)?$").matches(value)
        val looksLikeLocalhost = value == "localhost" || value.startsWith("localhost:")
        val looksLikeDomain = value.contains(".") && !value.startsWith(".") && !value.endsWith(".")
        val target = if (!hasWhitespace && (hasScheme || looksLikeIp || looksLikeLocalhost || looksLikeDomain)) {
            if (hasScheme && !value.startsWith("https://", true) && !value.startsWith("http://", true)) {
                "https://" + value.substringAfter("://")
            } else normalizeUrl(value)
        } else {
            "https://www.google.com/search?q=" + Uri.encode(value)
        }
        load(target)
    }

    private fun normalizeUrl(value: String): String =
        if (value.startsWith("https://", true) || value.startsWith("http://", true)) value
        else "https://" + value

    private fun hideKeyboard() {
        val manager = getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager
        manager.hideSoftInputFromWindow(address.windowToken, 0)
    }

    private fun toggleDesktopMode() {
        desktopMode = !desktopMode
        getSharedPreferences(PREFERENCES, MODE_PRIVATE).edit().putBoolean(KEY_DESKTOP_MODE, desktopMode).apply()
        tabs.forEach { session ->
            session.settings.setUserAgentMode(
                if (desktopMode) GeckoSessionSettings.USER_AGENT_MODE_DESKTOP
                else GeckoSessionSettings.USER_AGENT_MODE_MOBILE
            )
            session.settings.setViewportMode(
                if (desktopMode) GeckoSessionSettings.VIEWPORT_MODE_DESKTOP
                else GeckoSessionSettings.VIEWPORT_MODE_MOBILE
            )
        }
        activeSession()?.reload()
        showToast(if (desktopMode) "Desktop-Ansicht aktiviert." else "Mobile Ansicht aktiviert.")
    }

    private fun showBrowserMenu() {
        val actions = listOf(
            BrowserAction("⌂", "Startseite", "Zur Schleim-OS-Startseite", ::openHomePage),
            BrowserAction("▣", if (desktopMode) "Mobile Seite" else "Desktop-Seite", "Ansicht der aktuellen Website umschalten", ::toggleDesktopMode),
            BrowserAction("⇩", "Downloads", "Heruntergeladene Dateien verwalten", ::showDownloadsDialog),
            BrowserAction("🧩", "Erweiterungen", "XPI-Add-ons installieren und verwalten", ::showExtensionsDialog),
            BrowserAction("⚙", "Einstellungen", "Benachrichtigungen und Standardbrowser", ::showSettingsDialog),
            BrowserAction("+", "Neuer Tab", "Eine neue Schleim-OS-Startseite öffnen", ::createUserTab),
            BrowserAction("▢", "Tabs", "Geöffnete Registerkarten verwalten", ::showTabsDialog),
            BrowserAction("↻", "Aktualisieren", "Aktuelle Seite neu laden") { activeSession()?.reload() }
        )
        val parts = createDialogShell("Browser-Menü", "Alles Wichtige an einem Ort.")
        val grid = GridLayout(this).apply { columnCount = 2 }
        actions.forEach { item ->
            val tile = createMenuTile(item.icon, item.title, item.subtitle) {
                parts.dialog.dismiss()
                item.run()
            }
            val params = GridLayout.LayoutParams().apply {
                width = 0
                height = dp(91)
                columnSpec = GridLayout.spec(GridLayout.UNDEFINED, 1f)
                setMargins(dp(4), dp(4), dp(4), dp(4))
            }
            grid.addView(tile, params)
        }
        parts.body.addView(grid, LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT))
        showDialog(parts.dialog)
    }

    private fun showSettingsDialog() {
        val parts = createDialogShell("Einstellungen", "Browser- und Android-Funktionen.")
        parts.body.addView(createMenuTile("🔔", "Benachrichtigung testen", "Eine Testbenachrichtigung senden") {
            parts.dialog.dismiss()
            showNotification("Schleim OS", "Android-Benachrichtigungen sind eingerichtet.")
            showToast("Testbenachrichtigung wurde ausgelöst.")
        }, LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(78)).apply { bottomMargin = dp(7) })
        parts.body.addView(createMenuTile("🌐", "Standardbrowser", "Schleim OS als Android-Browser festlegen") {
            parts.dialog.dismiss()
            requestDefaultBrowserRole()
        }, LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(78)).apply { bottomMargin = dp(7) })
        parts.body.addView(createMenuTile("▣", if (desktopMode) "Desktop-Ansicht aktiv" else "Mobile Ansicht aktiv", "Ansicht auch für neue Tabs übernehmen") {
            parts.dialog.dismiss()
            toggleDesktopMode()
        }, LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(78)))
        showDialog(parts.dialog)
    }

    private fun createDialogShell(title: String, subtitle: String): DialogParts {
        val dialog = Dialog(this)
        val outer = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(15), dp(14), dp(15), dp(14))
            background = roundedBackground(Color.rgb(45, 29, 19), border, 18)
        }
        val header = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
            setPadding(0, 0, 0, dp(10))
        }
        val titleBlock = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL }
        titleBlock.addView(TextView(this).apply {
            text = title
            textSize = 17f
            typeface = Typeface.create("sans-serif", Typeface.BOLD)
            setTextColor(textPrimary)
        })
        titleBlock.addView(TextView(this).apply {
            text = subtitle
            textSize = 9f
            setTextColor(textMuted)
        })
        header.addView(titleBlock, LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f))
        header.addView(makeIconButton("×", "Dialog schließen") { dialog.dismiss() },
            LinearLayout.LayoutParams(dp(34), dp(34)))
        outer.addView(header)
        val scroll = ScrollView(this).apply { clipToPadding = false }
        val body = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL }
        scroll.addView(body)
        outer.addView(scroll, LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(390)))
        dialog.setContentView(outer)
        return DialogParts(dialog, body)
    }

    private fun showDialog(dialog: Dialog) {
        dialog.show()
        dialog.window?.setBackgroundDrawable(ColorDrawable(Color.TRANSPARENT))
        val width = (resources.displayMetrics.widthPixels - dp(30)).coerceAtMost(dp(460))
        dialog.window?.setLayout(width, ViewGroup.LayoutParams.WRAP_CONTENT)
    }

    private fun createMenuTile(icon: String, title: String, subtitle: String, action: () -> Unit): LinearLayout =
        LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER_VERTICAL
            setPadding(dp(12), dp(9), dp(12), dp(9))
            background = roundedBackground(surface, border, 12)
            isClickable = true
            isFocusable = true
            addView(TextView(this@MainActivity).apply {
                text = icon
                textSize = 19f
                setTextColor(accent)
                gravity = Gravity.CENTER_VERTICAL
            })
            addView(TextView(this@MainActivity).apply {
                text = title
                textSize = 10f
                typeface = Typeface.create("sans-serif-medium", Typeface.BOLD)
                setTextColor(textPrimary)
                maxLines = 1
                ellipsize = android.text.TextUtils.TruncateAt.END
            })
            addView(TextView(this@MainActivity).apply {
                text = subtitle
                textSize = 8f
                setTextColor(textMuted)
                maxLines = 2
                ellipsize = android.text.TextUtils.TruncateAt.END
            })
            setOnClickListener { action() }
        }

    private fun makeWideActionButton(label: String, action: () -> Unit): TextView =
        TextView(this).apply {
            text = label
            textSize = 10f
            typeface = Typeface.create("sans-serif-medium", Typeface.BOLD)
            setTextColor(pageBackground)
            gravity = Gravity.CENTER
            background = roundedBackground(accent, Color.TRANSPARENT, 10)
            isClickable = true
            isFocusable = true
            setOnClickListener { action() }
        }

    private fun dialogMessage(message: String): TextView =
        TextView(this).apply {
            text = message
            textSize = 10f
            setTextColor(textMuted)
            setPadding(dp(8), dp(13), dp(8), dp(13))
        }

    private fun createInfoRow(title: String, subtitle: String): LinearLayout =
        LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(10), dp(9), dp(10), dp(9))
            background = roundedBackground(surface, border, 10)
            addView(TextView(this@MainActivity).apply {
                text = title
                textSize = 10f
                typeface = Typeface.create("sans-serif-medium", Typeface.BOLD)
                setTextColor(textPrimary)
                maxLines = 2
                ellipsize = android.text.TextUtils.TruncateAt.END
            })
            addView(TextView(this@MainActivity).apply {
                text = subtitle
                textSize = 8f
                setTextColor(textMuted)
                maxLines = 3
                ellipsize = android.text.TextUtils.TruncateAt.END
                setPadding(0, dp(3), 0, 0)
            })
        }

    private fun showDownloadsDialog() {
        val parts = createDialogShell("Downloads", "Dateien, die du mit Schleim OS heruntergeladen hast.")
        val loading = dialogMessage("Downloads werden geladen …")
        parts.body.addView(loading)
        showDialog(parts.dialog)

        ioExecutor.execute {
            val allFiles = runCatching {
                downloadsDirectory().listFiles()?.filter { it.isFile }?.sortedByDescending { it.lastModified() } ?: emptyList()
            }.getOrDefault(emptyList())
            val files = allFiles.take(MAX_DOWNLOAD_ROWS)
            runOnUiThread {
                if (isFinishing || isDestroyed || !parts.dialog.isShowing) return@runOnUiThread
                parts.body.removeAllViews()
                if (files.isEmpty()) {
                    parts.body.addView(dialogMessage("Noch keine Downloads vorhanden. Dateien, die eine Website zum Herunterladen anbietet, erscheinen hier."))
                    return@runOnUiThread
                }
                val countLabel = if (allFiles.size > files.size) {
                    "Neueste " + files.size + " von " + allFiles.size + " Dateien"
                } else {
                    files.size.toString() + " Datei(en)"
                }
                parts.body.addView(dialogMessage(countLabel))
                files.forEach { file ->
                    val row = LinearLayout(this).apply {
                        orientation = LinearLayout.VERTICAL
                        setPadding(dp(10), dp(9), dp(10), dp(9))
                        background = roundedBackground(surface, border, 10)
                    }
                    row.addView(TextView(this).apply {
                        text = file.name
                        textSize = 10f
                        setTextColor(textPrimary)
                        typeface = Typeface.create("sans-serif-medium", Typeface.BOLD)
                        maxLines = 2
                        ellipsize = android.text.TextUtils.TruncateAt.MIDDLE
                    })
                    val date = SimpleDateFormat("dd.MM.yyyy · HH:mm", Locale.getDefault()).format(Date(file.lastModified()))
                    row.addView(TextView(this).apply {
                        text = formatBytes(file.length()) + " · " + date
                        textSize = 8f
                        setTextColor(textMuted)
                        setPadding(0, dp(3), 0, dp(7))
                    })
                    val actions = LinearLayout(this).apply {
                        orientation = LinearLayout.HORIZONTAL
                        gravity = Gravity.CENTER_VERTICAL
                    }
                    val isXpi = file.extension.equals("xpi", true)
                    val isCrx = file.extension.equals("crx", true)
                    val actionLabel = when {
                        isXpi -> "Öffnen / installieren"
                        isCrx -> "CRX nicht kompatibel"
                        else -> "Öffnen"
                    }
                    actions.addView(makeTextButton(actionLabel) {
                        when {
                            isXpi -> {
                                parts.dialog.dismiss()
                                installExtensionFile(file)
                            }
                            isCrx -> showToast(
                                "Chrome-CRX-Erweiterungen können in Schleim Browser nicht installiert werden. GeckoView benötigt eine Mozilla-signierte XPI-Datei."
                            )
                            else -> openDownloadedFile(file)
                        }
                    }, LinearLayout.LayoutParams(0, dp(34), 1f))
                    actions.addView(makeTextButton("Teilen") {
                        shareDownloadedFile(file)
                    }, LinearLayout.LayoutParams(0, dp(34), 1f).apply { marginStart = dp(6) })
                    row.addView(actions)
                    parts.body.addView(row, LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT).apply {
                        bottomMargin = dp(7)
                    })
                }
            }
        }
    }

    private fun downloadsDirectory(): File {
        val base = getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS) ?: File(filesDir, "downloads")
        if (!base.exists()) base.mkdirs()
        return base
    }

    private fun saveDownload(response: WebResponse) {
        val body = response.body
        if (body == null) {
            runOnUiThread { showToast("Diese Datei konnte nicht heruntergeladen werden.") }
            return
        }
        val contentDisposition = response.headers.entries.firstOrNull { it.key.equals("Content-Disposition", true) }?.value
        val contentType = response.headers.entries.firstOrNull { it.key.equals("Content-Type", true) }?.value
        val fileName = buildDownloadName(response.uri, contentDisposition, contentType)
        runOnUiThread { showToast("Download gestartet: " + fileName) }
        downloadExecutor.execute {
            try {
                val file = uniqueDownloadFile(downloadsDirectory(), fileName)
                body.use { input ->
                    FileOutputStream(file).use { output ->
                        val buffer = ByteArray(16 * 1024)
                        while (true) {
                            val count = input.read(buffer)
                            if (count < 0) break
                            output.write(buffer, 0, count)
                        }
                        output.flush()
                    }
                }
                runOnUiThread { showToast("Download abgeschlossen: " + file.name) }
            } catch (error: Exception) {
                runCatching { body.close() }
                Log.e(TAG, "Download failed", error)
                runOnUiThread { showToast("Download fehlgeschlagen: " + (error.message ?: "Unbekannter Fehler")) }
            }
        }
    }

    private fun buildDownloadName(uri: String, contentDisposition: String?, contentType: String?): String {
        var candidate: String? = null
        if (!contentDisposition.isNullOrBlank()) {
            val encoded = Regex("filename\\*\\s*=\\s*UTF-8''([^;]+)", RegexOption.IGNORE_CASE)
                .find(contentDisposition)?.groupValues?.getOrNull(1)
            val plain = Regex("filename\\s*=\\s*\"?([^\";]+)", RegexOption.IGNORE_CASE)
                .find(contentDisposition)?.groupValues?.getOrNull(1)
            val value = encoded ?: plain
            if (!value.isNullOrBlank()) {
                candidate = runCatching { URLDecoder.decode(value.trim(), "UTF-8") }.getOrDefault(value.trim())
            }
        }
        if (candidate.isNullOrBlank()) candidate = Uri.parse(uri).lastPathSegment
        if (candidate.isNullOrBlank()) {
            val extension = contentType?.substringBefore(";")?.trim()?.let {
                MimeTypeMap.getSingleton().getExtensionFromMimeType(it)
            }
            candidate = "Download-" + SimpleDateFormat("yyyyMMdd-HHmmss", Locale.US).format(Date()) +
                if (extension.isNullOrBlank()) "" else "." + extension
        }
        val safe = candidate!!.substringAfterLast('/').substringAfterLast('\\')
            .replace(Regex("[^A-Za-z0-9._ -]"), "_")
            .trim()
            .take(100)
        return if (safe.isBlank()) "Download-" + System.currentTimeMillis() else safe
    }

    private fun uniqueDownloadFile(folder: File, fileName: String): File {
        var file = File(folder, fileName)
        if (!file.exists()) return file
        val stem = file.nameWithoutExtension
        val ext = file.extension
        var index = 1
        do {
            val candidate = stem + " (" + index + ")" + if (ext.isBlank()) "" else "." + ext
            file = File(folder, candidate)
            index++
        } while (file.exists())
        return file
    }

    private fun formatBytes(bytes: Long): String = when {
        bytes < 1024 -> bytes.toString() + " B"
        bytes < 1024 * 1024 -> String.format(Locale.getDefault(), "%.1f KB", bytes / 1024.0)
        else -> String.format(Locale.getDefault(), "%.1f MB", bytes / (1024.0 * 1024.0))
    }

    private fun openDownloadedFile(file: File) {
        if (file.extension.equals("xpi", true)) {
            installExtensionFile(file)
            return
        }
        if (file.extension.equals("crx", true)) {
            showToast("Chrome-CRX-Erweiterungen sind mit der GeckoView-Engine nicht kompatibel. Verwende eine Mozilla-signierte XPI-Datei.")
            return
        }
        try {
            val uri = FileProvider.getUriForFile(this, packageName + ".fileprovider", file)
            val mime = MimeTypeMap.getSingleton().getMimeTypeFromExtension(file.extension.lowercase(Locale.ROOT)) ?: "*/*"
            val intent = Intent(Intent.ACTION_VIEW).setDataAndType(uri, mime)
                .addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            startActivity(Intent.createChooser(intent, "Datei öffnen mit"))
        } catch (error: Exception) {
            showToast("Keine passende App zum Öffnen gefunden: " + (error.message ?: ""))
        }
    }

    private fun shareDownloadedFile(file: File) {
        try {
            val uri = FileProvider.getUriForFile(this, packageName + ".fileprovider", file)
            val mime = MimeTypeMap.getSingleton().getMimeTypeFromExtension(file.extension.lowercase(Locale.ROOT)) ?: "*/*"
            val intent = Intent(Intent.ACTION_SEND).setType(mime)
                .putExtra(Intent.EXTRA_STREAM, uri)
                .addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            startActivity(Intent.createChooser(intent, "Datei teilen"))
        } catch (error: Exception) {
            showToast("Datei kann nicht geteilt werden: " + (error.message ?: ""))
        }
    }

    private fun showExtensionsDialog() {
        val parts = createDialogShell("Erweiterungen", "Installierte GeckoView-Add-ons verwalten und kompatible Erweiterungen hinzufügen.")
        parts.body.addView(makeWideActionButton("＋  XPI-Datei installieren") {
            pickExtensionFile()
        }, LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(42)).apply {
            bottomMargin = dp(7)
        })
        parts.body.addView(makeWideActionButton("Google Chrome Web Store öffnen") {
            parts.dialog.dismiss()
            load("https://chromewebstore.google.com/")
        }, LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(42)).apply {
            bottomMargin = dp(9)
        })
        parts.body.addView(dialogMessage(
            "Chrome Web Store: Du kannst den Katalog durchsuchen. Chrome-Erweiterungen im CRX-Format lassen sich in diesem GeckoView-Browser jedoch nicht installieren. Für die Installation werden Mozilla-signierte XPI-Dateien benötigt. Beim Installieren einer XPI-Datei erscheint ein Dialog mit den angeforderten Berechtigungen."
        ))
        val listHost = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL }
        parts.body.addView(listHost)
        showDialog(parts.dialog)
        runtime.getWebExtensionController().list().accept({ installed ->
            runOnUiThread {
                listHost.removeAllViews()
                val availableExtensions = installed ?: emptyList()
                if (availableExtensions.isEmpty()) {
                    listHost.addView(dialogMessage("Keine Erweiterungen gefunden."))
                } else {
                    availableExtensions.sortedBy { it.metaData.name ?: it.id }.forEach { item ->
                        val name = item.metaData.name ?: item.id
                        val description = "Version " + item.metaData.version +
                            if (item.isBuiltIn) " · Integriert" else if (item.metaData.enabled) " · Aktiv" else " · Deaktiviert"
                        val row = LinearLayout(this).apply {
                            orientation = LinearLayout.VERTICAL
                            setPadding(dp(10), dp(9), dp(10), dp(9))
                            background = roundedBackground(surface, border, 10)
                        }
                        row.addView(TextView(this).apply {
                            text = name
                            textSize = 10f
                            setTextColor(textPrimary)
                            typeface = Typeface.create("sans-serif-medium", Typeface.BOLD)
                        })
                        row.addView(TextView(this).apply {
                            text = description
                            textSize = 8f
                            setTextColor(textMuted)
                            setPadding(0, dp(3), 0, dp(7))
                        })
                        if (!item.isBuiltIn) {
                            val actions = LinearLayout(this).apply {
                                orientation = LinearLayout.HORIZONTAL
                            }
                            actions.addView(makeTextButton(if (item.metaData.enabled) "Deaktivieren" else "Aktivieren") {
                                val operation = if (item.metaData.enabled) {
                                    runtime.getWebExtensionController().disable(item, WebExtensionController.EnableSource.USER)
                                } else {
                                    runtime.getWebExtensionController().enable(item, WebExtensionController.EnableSource.USER)
                                }
                                operation.accept({
                                    showExtensionsDialog()
                                }, { error ->
                                    showToast("Erweiterung konnte nicht geändert werden: " + (error?.message ?: "Fehler"))
                                })
                                parts.dialog.dismiss()
                            }, LinearLayout.LayoutParams(0, dp(34), 1f).apply { marginEnd = dp(6) })
                            actions.addView(makeTextButton("Entfernen") {
                                AlertDialog.Builder(this@MainActivity)
                                    .setTitle("Erweiterung entfernen?")
                                    .setMessage(name + " wird mitsamt ihren gespeicherten Erweiterungsdaten entfernt.")
                                    .setNegativeButton("Abbrechen", null)
                                    .setPositiveButton("Entfernen") { _, _ ->
                                        runtime.getWebExtensionController().uninstall(item).accept({
                                            showToast("Erweiterung entfernt.")
                                            showExtensionsDialog()
                                        }, { error ->
                                            showToast("Entfernen fehlgeschlagen: " + (error?.message ?: "Fehler"))
                                        })
                                        parts.dialog.dismiss()
                                    }
                                    .show()
                            }, LinearLayout.LayoutParams(0, dp(34), 1f))
                            row.addView(actions)
                        } else {
                            row.addView(TextView(this).apply {
                                text = "Diese Erweiterung gehört zum Browser und kann hier nicht entfernt werden."
                                textSize = 8f
                                setTextColor(textMuted)
                            })
                        }
                        listHost.addView(row, LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT).apply {
                            bottomMargin = dp(7)
                        })
                    }
                }
            }
        }, { error ->
            runOnUiThread {
                listHost.removeAllViews()
                listHost.addView(dialogMessage("Erweiterungen konnten nicht geladen werden: " + (error?.message ?: "Unbekannter Fehler")))
            }
        })
    }

    private fun pickExtensionFile() {
        val intent = Intent(Intent.ACTION_OPEN_DOCUMENT).apply {
            addCategory(Intent.CATEGORY_OPENABLE)
            type = "*/*"
            putExtra(Intent.EXTRA_MIME_TYPES, arrayOf("application/x-xpinstall", "application/zip", "application/octet-stream"))
        }
        try {
            startActivityForResult(intent, REQUEST_EXTENSION_PICKER)
        } catch (_: Exception) {
            showToast("Dateiauswahl ist auf diesem Gerät nicht verfügbar.")
        }
    }

    private fun displayNameForUri(uri: Uri): String? {
        if (uri.scheme == "content") {
            contentResolver.query(uri, arrayOf(OpenableColumns.DISPLAY_NAME), null, null, null)?.use { cursor ->
                if (cursor.moveToFirst()) {
                    val index = cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME)
                    if (index >= 0) return cursor.getString(index)
                }
            }
        }
        return uri.lastPathSegment
    }

    private fun importExtensionUri(uri: Uri) {
        val name = displayNameForUri(uri) ?: "extension.xpi"
        if (!name.endsWith(".xpi", true)) {
            showToast("Bitte eine Mozilla-signierte .xpi-Datei auswählen. ZIP- und CRX-Dateien werden nicht unterstützt.")
            return
        }
        showToast("XPI-Datei wird vorbereitet …")
        val safeName = name.replace(Regex("[^A-Za-z0-9._-]"), "_")
        val destination = File(File(cacheDir, "extension-import"), safeName)
        ioExecutor.execute {
            try {
                destination.parentFile?.mkdirs()
                contentResolver.openInputStream(uri)?.use { input ->
                    FileOutputStream(destination).use { output -> input.copyTo(output) }
                } ?: throw IllegalStateException("Die ausgewählte Datei konnte nicht geöffnet werden.")
                runOnUiThread {
                    if (!isFinishing && !isDestroyed) installExtensionFile(destination)
                }
            } catch (error: Exception) {
                runOnUiThread {
                    if (!isFinishing && !isDestroyed) {
                        showToast("XPI-Datei konnte nicht übernommen werden: " + (error.message ?: "Fehler"))
                    }
                }
            }
        }
    }

    private fun installExtensionFile(file: File) {
        if (!file.exists() || !file.name.endsWith(".xpi", true)) {
            showToast("Bitte eine gültige .xpi-Datei auswählen.")
            return
        }
        showToast("Erweiterung wird geprüft …")
        runtime.getWebExtensionController()
            .install(Uri.fromFile(file).toString(), WebExtensionController.INSTALLATION_METHOD_FROM_FILE)
            .accept({ installed ->
                runOnUiThread {
                    val newExtension = installed
                    if (newExtension == null) {
                        showToast("Die Erweiterung wurde nicht installiert.")
                        return@runOnUiThread
                    }
                    showToast((newExtension.metaData.name ?: newExtension.id) + " wurde installiert.")
                    showExtensionsDialog()
                }
            }, { error ->
                runOnUiThread {
                    val message = if (error is WebExtension.InstallException && error.code == WebExtension.InstallException.ErrorCodes.ERROR_SIGNEDSTATE_REQUIRED) {
                        "Diese XPI-Datei ist nicht von Mozilla signiert und kann deshalb nicht installiert werden."
                    } else {
                        error?.message ?: "Die Erweiterung ist inkompatibel oder die Datei ist beschädigt."
                    }
                    showToast("Installation fehlgeschlagen: " + message)
                }
            })
    }

    private fun requestDefaultBrowserRole() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            val manager = getSystemService(RoleManager::class.java)
            if (manager.isRoleAvailable(RoleManager.ROLE_BROWSER) && !manager.isRoleHeld(RoleManager.ROLE_BROWSER)) {
                startActivityForResult(manager.createRequestRoleIntent(RoleManager.ROLE_BROWSER), REQUEST_BROWSER_ROLE)
            } else {
                showToast("Schleim OS ist bereits als Standardbrowser festgelegt.")
            }
        } else {
            showToast("Die Standardbrowser-Auswahl benötigt Android 10 oder neuer.")
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

    private fun showToast(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_LONG).show()
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

    override fun onResume() {
        super.onResume()
        // Re-activate the current visible tab after returning from another app
        // or an Android system surface such as the document picker.
        activeSession()?.let { session ->
            runCatching { session.setActive(true) }
            runCatching { session.setFocused(true) }
        }
    }

    override fun onPause() {
        // Keep the visible browser page inactive while the app is backgrounded.
        // The separate mediaSession is intentionally left running for active uploads.
        activeSession()?.let { session ->
            runCatching { session.setFocused(false) }
            runCatching { session.setActive(false) }
        }
        super.onPause()
    }

    @Deprecated("Deprecated in Android")
    override fun onBackPressed() {
        val session = activeSession()
        if (session != null && (navigationStates[session]?.first == true)) {
            session.goBack()
        } else if (tabs.size > 1) {
            closeTab(activeTabIndex)
        } else {
            super.onBackPressed()
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == REQUEST_BROWSER_ROLE) return
        if (requestCode == REQUEST_SAVE_FILE) {
            completeSaveFile(resultCode, data)
            return
        }
        if (requestCode == REQUEST_EXTENSION_PICKER) {
            if (resultCode == RESULT_OK && data?.data != null) importExtensionUri(data.data!!)
            return
        }
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

    override fun onDestroy() {
        pendingFileResult?.complete(pendingFilePrompt?.dismiss())
        pendingFileResult = null
        pendingFilePrompt = null
        pendingSaveResult?.complete(JSONObject().put("ok", false).put("error", "Browser wurde geschlossen."))
        pendingSaveResult = null
        pendingSaveBase64 = ""
        if (::geckoView.isInitialized && displayedSession != null) runCatching { geckoView.releaseSession() }
        displayedSession = null
        tabs.forEach { runCatching { it.close() } }
        tabs.clear()
        mediaView?.let { runCatching { it.releaseSession() } }
        mediaSession?.let { runCatching { it.close() } }
        mediaSession = null
        mediaView = null
        downloadExecutor.shutdown()
        ioExecutor.shutdown()
        super.onDestroy()
    }

    companion object {
        private const val TAG = "SchleimOS"
        private const val BUNDLED_EXTENSION_URI = "resource://android/assets/extension/"
        private const val EXTENSION_ID = "schleim-os-android@schneckeschneck.de"
        private const val NATIVE_APP_ID = "browser"
        private const val CHANNEL_ID = "schleim_os_general"
        private const val NOTIFICATION_ID = 1501
        private const val REQUEST_NOTIFICATIONS = 1502
        private const val REQUEST_BROWSER_ROLE = 1503
        private const val REQUEST_FILE_PICKER = 1504
        private const val REQUEST_EXTENSION_PICKER = 1505
        private const val REQUEST_SAVE_FILE = 1506
        private const val EXTRA_OPEN_APP = "schleim_os_open_app"
        private const val PREFERENCES = "schleim_os_browser_settings"
        private const val KEY_DESKTOP_MODE = "desktop_mode"
        private const val MAX_OPEN_TABS = 6
        private const val MAX_DOWNLOAD_ROWS = 100
    }
}
