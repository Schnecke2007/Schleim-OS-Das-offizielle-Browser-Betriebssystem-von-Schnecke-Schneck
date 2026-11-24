package de.schneckeschneck.schleimos

import android.Manifest
import android.app.Activity
import android.app.KeyguardManager
import android.app.AlertDialog
import android.app.Dialog
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.role.RoleManager
import android.content.ClipData
import android.content.ClipboardManager
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
import android.provider.Settings
import android.text.InputType
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
import android.widget.PopupMenu
import android.widget.ProgressBar
import android.widget.ScrollView
import android.widget.CheckBox
import android.widget.TextView
import android.widget.Toast
import androidx.core.app.NotificationCompat
import androidx.core.content.FileProvider
import org.json.JSONArray
import org.json.JSONObject
import org.mozilla.geckoview.AllowOrDeny
import org.mozilla.geckoview.Autocomplete
import org.mozilla.geckoview.GeckoResult
import org.mozilla.geckoview.GeckoRuntime
import org.mozilla.geckoview.GeckoRuntimeSettings
import org.mozilla.geckoview.GeckoWebExecutor
import org.mozilla.geckoview.GeckoSession
import org.mozilla.geckoview.GeckoSessionSettings
import org.mozilla.geckoview.GeckoView
import org.mozilla.geckoview.WebExtension
import org.mozilla.geckoview.WebExtensionController
import org.mozilla.geckoview.WebRequest
import org.mozilla.geckoview.WebResponse
import java.io.File
import java.io.FileOutputStream
import java.net.HttpURLConnection
import java.net.URL
import java.security.MessageDigest
import java.net.URLDecoder
import java.util.Date
import java.text.SimpleDateFormat
import java.util.Locale
import java.util.concurrent.Executors
import java.util.UUID
import java.util.zip.ZipEntry
import java.util.zip.ZipFile
import java.util.zip.ZipInputStream
import java.util.zip.ZipOutputStream
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream
import android.os.Handler
import android.os.Looper

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
    private lateinit var secureProfileStore: SecureProfileStore
    private lateinit var cloudSync: BrowserCloudSync
    private lateinit var guestBanner: TextView
    private lateinit var deviceCodeBanner: LinearLayout

    private var extension: WebExtension? = null
    private var extensionHomeUrl: String? = null
    private val tabs = mutableListOf<GeckoSession>()
    private var activeTabIndex = 0
    private var displayedSession: GeckoSession? = null
    private val navigationStates = mutableMapOf<GeckoSession, Pair<Boolean, Boolean>>()
    private val sessionUrls = mutableMapOf<GeckoSession, String>()
    private val sessionTitles = mutableMapOf<GeckoSession, String>()
    private var desktopMode = false
    private var isGuestMode = false
    private var passwordVaultUnlocked = false
    private var pendingVaultUnlock: (() -> Unit)? = null
    private var pendingVaultCancelled: (() -> Unit)? = null
    private var passwordManagerDialog: Dialog? = null
    private val cloudBackupHandler = Handler(Looper.getMainLooper())
    private var cloudBackupQueued = false
    @Volatile private var deviceLoginCancelled = false
    private var cloudBackupRunning = false
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
    private data class AppUpdate(val versionCode: Int, val versionName: String, val apkUrl: String, val sha256: String)
    private var pendingUpdateApk: File? = null
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
        secureProfileStore = SecureProfileStore(this)
        cloudSync = BrowserCloudSync(secureProfileStore)
        window.statusBarColor = pageBackground
        window.navigationBarColor = pageBackground
        window.decorView.systemUiVisibility = 0
        createNotificationChannel()
        buildBrowserUi()
        requestNotificationPermissionIfNeeded()
        checkForAppUpdates()

        // Let Android draw the browser shell before GeckoView performs its
        // comparatively expensive native runtime initialization.
        geckoView.post {
            if (isFinishing || isDestroyed) return@post
            try {
                val runtimeSettings = GeckoRuntimeSettings.Builder()
                    .trustedRecursiveResolverMode(GeckoRuntimeSettings.TRR_MODE_ONLY)
                    .trustedRecursiveResolverUri(PRIMARY_DNS_URL)
                    .loginAutofillEnabled(true)
                    .build()
                runtime = GeckoRuntime.create(applicationContext, runtimeSettings)
                configureAutocompleteStorage()
                configureExtensionPrompts()
                openBrowser(intent?.data?.toString())
            } catch (error: Exception) {
                Log.e(TAG, "GeckoView startup failed", error)
                showToast("Schleim Browser konnte nicht gestartet werden: " + (error.message ?: "GeckoView-Fehler"))
            }
        }
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

        guestBanner = TextView(this).apply {
            text = "GASTMODUS – keine dauerhafte Speicherung oder Cloud-Synchronisierung"
            textSize = 9f
            typeface = Typeface.create("sans-serif-medium", Typeface.BOLD)
            setTextColor(Color.rgb(255, 224, 183))
            gravity = Gravity.CENTER
            setPadding(dp(8), dp(7), dp(8), dp(7))
            background = roundedBackground(Color.rgb(91, 46, 18), accent, 9)
            visibility = View.GONE
            setOnClickListener { leaveGuestMode() }
        }
        browserColumn.addView(guestBanner, LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT).apply {
            bottomMargin = dp(6)
        })

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
            marginEnd = dp(4)
        })
        navigationRow.addView(makeIconButton("☆", "Aktuelle Seite als Lesezeichen speichern") {
            addCurrentBookmark()
        }, LinearLayout.LayoutParams(dp(32), dp(38)).apply { marginEnd = dp(4) })
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

        deviceCodeBanner = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(10), dp(7), dp(10), dp(7))
            background = roundedBackground(surfaceRaised, accent, 10)
            visibility = View.GONE
        }
        browserColumn.addView(deviceCodeBanner, LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT
        ).apply { bottomMargin = dp(6) })

        geckoView = GeckoView(this)
        geckoView.setActivityContextDelegate(object : GeckoView.ActivityContextDelegate {
            override fun getActivityContext(): Context = this@MainActivity
        })
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
        updateGuestModeUi()
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
                restoreOpenTabs(initialUrl)
                rootFrame.postDelayed({
                    if (!isFinishing && !isDestroyed && !isGuestMode &&
                        !getSharedPreferences(PREFERENCES, MODE_PRIVATE).getBoolean(KEY_ONBOARDING_DONE, false)
                    ) showOnboarding()
                }, 500)
            }, { error ->
                showNotification(
                    "Schleim OS konnte nicht starten",
                    error?.message ?: "GeckoView konnte die Original-Extension nicht laden."
                )
            })
    }

    private fun configureAutocompleteStorage() {
        runtime.setAutocompleteStorageDelegate(object : Autocomplete.StorageDelegate {
            override fun onLoginFetch(domain: String): GeckoResult<Array<Autocomplete.LoginEntry>> {
                if (isGuestMode || !passwordVaultUnlocked ||
                    !getSharedPreferences(PREFERENCES, MODE_PRIVATE).getBoolean(KEY_PASSWORD_AUTOFILL, false)
                ) return GeckoResult.fromValue(emptyArray())
                val entries = runCatching { readPasswordEntries() }.getOrElse { JSONArray() }
                val matches = mutableListOf<Autocomplete.LoginEntry>()
                for (index in 0 until entries.length()) {
                    val item = entries.optJSONObject(index) ?: continue
                    val origin = item.optString("origin")
                    if (origin != domain && Uri.parse(origin).host != domain) continue
                    matches.add(toLoginEntry(item))
                }
                return GeckoResult.fromValue(matches.toTypedArray())
            }

            override fun onLoginSave(login: Autocomplete.LoginEntry) {
                if (isGuestMode) return
                runCatching { savePasswordEntry(login) }
                    .onFailure { Log.e(TAG, "Could not save browser login securely", it) }
            }
        })
    }

    private fun readPasswordEntries(): JSONArray {
        if (!secureProfileStore.has(KEY_PASSWORDS)) return JSONArray()
        return JSONArray(secureProfileStore.getString(KEY_PASSWORDS) ?: "[]")
    }

    private fun writePasswordEntries(entries: JSONArray) {
        if (isGuestMode) return
        secureProfileStore.putString(KEY_PASSWORDS, entries.toString())
        scheduleAutomaticBackup()
    }

    private fun toLoginEntry(item: JSONObject): Autocomplete.LoginEntry =
        Autocomplete.LoginEntry.Builder()
            .guid(item.optString("guid").ifBlank { UUID.randomUUID().toString() })
            .origin(item.optString("origin"))
            .formActionOrigin(item.optString("formActionOrigin").takeIf { it.isNotBlank() })
            .httpRealm(item.optString("httpRealm").takeIf { it.isNotBlank() })
            .username(item.optString("username"))
            .password(item.optString("password"))
            .build()

    private fun savePasswordEntry(login: Autocomplete.LoginEntry) {
        if (isGuestMode) return
        val entries = readPasswordEntries()
        val guid = login.guid?.takeIf { it.isNotBlank() } ?: UUID.randomUUID().toString()
        val replacement = JSONObject()
            .put("guid", guid)
            .put("origin", login.origin)
            .put("formActionOrigin", login.formActionOrigin ?: "")
            .put("httpRealm", login.httpRealm ?: "")
            .put("username", login.username)
            .put("password", login.password)
            .put("updatedAt", System.currentTimeMillis())
        var replaced = false
        for (index in 0 until entries.length()) {
            val item = entries.optJSONObject(index) ?: continue
            val sameGuid = item.optString("guid") == guid
            val sameLogin = item.optString("origin") == login.origin &&
                item.optString("username") == login.username &&
                item.optString("httpRealm") == (login.httpRealm ?: "")
            if (sameGuid || sameLogin) {
                entries.put(index, replacement)
                replaced = true
                break
            }
        }
        if (!replaced) entries.put(replacement)
        writePasswordEntries(entries)
        scheduleAutomaticBackup()
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
            if (isGuestMode) {
                return GeckoResult.fromValue(JSONObject().put("ok", false).put("error", "Native Speicherung und Cloud-Funktionen sind im Gastmodus deaktiviert."))
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
        if (isGuestMode) {
            return GeckoResult.fromValue(JSONObject().put("ok", false).put("error", "Datei-Speicherung ist im Gastmodus deaktiviert."))
        }
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
        if (isGuestMode) return GeckoResult.fromValue(JSONObject().put("ok", false).put("error", "Cloud-Uploads sind im Gastmodus deaktiviert."))
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
        GeckoSessionSettings.Builder()
            .usePrivateMode(isGuestMode)
            .userAgentMode(
                if (desktopMode) GeckoSessionSettings.USER_AGENT_MODE_DESKTOP
                else GeckoSessionSettings.USER_AGENT_MODE_MOBILE
            )
            .viewportMode(
                if (desktopMode) GeckoSessionSettings.VIEWPORT_MODE_DESKTOP
                else GeckoSessionSettings.VIEWPORT_MODE_MOBILE
            )
            .build()

    private fun createTab(url: String?): GeckoSession {
        pruneBackgroundTabsForNewTab()
        val session = GeckoSession(sessionSettings())
        attachSessionDelegates(session)
        session.open(runtime)
        tabs.add(session)
        activeTabIndex = tabs.lastIndex
        showSessionInBrowser(session)
        if (!url.isNullOrBlank()) {
            val normalized = normalizeUrlOrExtension(url)
            val target = if (isGuestMode && normalized.startsWith("moz-extension://")) "about:blank" else normalized
            sessionUrls[session] = target
            session.loadUri(target)
        }
        updateTabsButton()
        saveOpenTabs()
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
        saveOpenTabs()
    }

    private fun createUserTab() {
        createTab(if (isGuestMode) "about:blank" else (extensionHomeUrl ?: "https://www.google.com"))
    }

    private fun openHomePage() {
        if (isGuestMode) {
            load("about:blank")
            return
        }
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
            load(if (isGuestMode) "about:blank" else (extensionHomeUrl ?: "https://www.google.com"))
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
        // Reuse GeckoView's built-in print adapter so Android's system print dialog is used.
        session.setPrintDelegate(geckoView.getPrintDelegate())
        session.setNavigationDelegate(object : GeckoSession.NavigationDelegate {
            override fun onLoadRequest(
                session: GeckoSession,
                request: GeckoSession.NavigationDelegate.LoadRequest
            ): GeckoResult<AllowOrDeny>? {
                val uri = request.uri ?: return null
                if (isGuestMode && uri.startsWith("moz-extension://")) return GeckoResult.deny()
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
                if (url != null) {
                    sessionUrls[session] = url
                    saveOpenTabs()
                }
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
                if (success) recordVisitedPage(session)
                saveOpenTabs()
            }
        })

        session.setContentDelegate(object : GeckoSession.ContentDelegate {
            override fun onTitleChange(session: GeckoSession, title: String?) {
                if (!title.isNullOrBlank()) sessionTitles[session] = title
                if (session === activeSession()) refreshTitleFromActiveTab()
                saveOpenTabs()
            }

            override fun onExternalResponse(session: GeckoSession, response: WebResponse) {
                saveDownload(response)
            }

            override fun onContextMenu(
                session: GeckoSession,
                screenX: Int,
                screenY: Int,
                element: GeckoSession.ContentDelegate.ContextElement
            ) {
                showPageElementContextMenu(session, screenX, screenY, element)
            }

            override fun onCloseRequest(session: GeckoSession) {
                val index = tabs.indexOf(session)
                if (index >= 0) closeTab(index)
            }
        })

        // The Android app deliberately does not expose camera or microphone capture.
        // Reject media and Android runtime permission requests so no capture prompt appears.
        session.setPermissionDelegate(object : GeckoSession.PermissionDelegate {
            override fun onContentPermissionRequest(
                session: GeckoSession,
                permission: GeckoSession.PermissionDelegate.ContentPermission
            ): GeckoResult<Int>? {
                if (permission.permission != GeckoSession.PermissionDelegate.PERMISSION_MEDIA_KEY_SYSTEM_ACCESS) {
                    return null
                }
                val result = GeckoResult<Int>()
                val host = Uri.parse(permission.uri).host ?: permission.uri
                val prompt = AlertDialog.Builder(this@MainActivity)
                    .setTitle("Geschützte Medien / Widevine")
                    .setMessage("$host möchte geschützte Medien mit dem DRM-System dieses Android-Geräts wiedergeben. Soll Schleim Browser den Zugriff erlauben?")
                    .setNegativeButton("Nicht erlauben") { _, _ ->
                        result.complete(GeckoSession.PermissionDelegate.ContentPermission.VALUE_DENY)
                    }
                    .setPositiveButton("Erlauben") { _, _ ->
                        result.complete(GeckoSession.PermissionDelegate.ContentPermission.VALUE_ALLOW)
                    }
                    .setOnCancelListener {
                        result.complete(GeckoSession.PermissionDelegate.ContentPermission.VALUE_DENY)
                    }
                    .create()
                prompt.setOnShowListener { permission.notifyShown() }
                prompt.show()
                return result
            }

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
            override fun onLoginSave(
                session: GeckoSession,
                request: GeckoSession.PromptDelegate.AutocompleteRequest<Autocomplete.LoginSaveOption>
            ): GeckoResult<GeckoSession.PromptDelegate.PromptResponse> {
                val result = GeckoResult<GeckoSession.PromptDelegate.PromptResponse>()
                val option = request.options.firstOrNull()
                if (isGuestMode || option == null) {
                    result.complete(request.dismiss())
                    return result
                }
                val login = option.value
                AlertDialog.Builder(this@MainActivity)
                    .setTitle("Anmeldung speichern?")
                    .setMessage("${login.origin}\\n\\nBenutzername: ${login.username}\\nDas Passwort wird verschlüsselt im Android-Keystore-geschützten Passwortspeicher abgelegt.")
                    .setNegativeButton("Nicht speichern") { _, _ -> result.complete(request.dismiss()) }
                    .setPositiveButton("Sicher speichern") { _, _ ->
                        ensureVaultUnlocked(
                            onUnlocked = { result.complete(request.confirm(option)) },
                            onCancelled = { result.complete(request.dismiss()) }
                        )
                    }
                    .setOnCancelListener { result.complete(request.dismiss()) }
                    .show()
                return result
            }

            override fun onLoginSelect(
                session: GeckoSession,
                request: GeckoSession.PromptDelegate.AutocompleteRequest<Autocomplete.LoginSelectOption>
            ): GeckoResult<GeckoSession.PromptDelegate.PromptResponse> {
                val result = GeckoResult<GeckoSession.PromptDelegate.PromptResponse>()
                if (isGuestMode || !passwordVaultUnlocked ||
                    !getSharedPreferences(PREFERENCES, MODE_PRIVATE).getBoolean(KEY_PASSWORD_AUTOFILL, false)
                ) {
                    result.complete(request.dismiss())
                    return result
                }
                val options = request.options
                if (options.isEmpty()) {
                    result.complete(request.dismiss())
                    return result
                }
                AlertDialog.Builder(this@MainActivity)
                    .setTitle("Gespeicherte Anmeldung auswählen")
                    .setItems(options.map { it.value.username }.toTypedArray()) { _, index ->
                        result.complete(request.confirm(options[index]))
                    }
                    .setNegativeButton("Abbrechen") { _, _ -> result.complete(request.dismiss()) }
                    .setOnCancelListener { result.complete(request.dismiss()) }
                    .show()
                return result
            }

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
            saveOpenTabs()
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
        if (!isGuestMode) getSharedPreferences(PREFERENCES, MODE_PRIVATE).edit().putBoolean(KEY_DESKTOP_MODE, desktopMode).apply()
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
        scheduleAutomaticBackup()
        showToast(if (desktopMode) "Desktop-Ansicht aktiviert." else "Mobile Ansicht aktiviert.")
    }

    private fun showBrowserMenu() {
        val actions = if (isGuestMode) {
            listOf(
                BrowserAction("＋", "Neuer privater Tab", "Eine neue temporäre Sitzung öffnen", ::createUserTab),
                BrowserAction("▢", "Private Tabs", "Zwischen deinen privaten Tabs wechseln", ::showTabsDialog),
                BrowserAction("↩", "Gastmodus beenden", "Zurück zum regulären Browser-Profil", ::leaveGuestMode),
                BrowserAction("↻", "Aktualisieren", "Aktuelle private Seite neu laden") { activeSession()?.reload() }
            )
        } else {
            listOf(
                BrowserAction("⌂", "Startseite", "Zur Schleim-OS-Startseite", ::openHomePage),
                BrowserAction("☆", "Lesezeichen", "Gespeicherte Webseiten verwalten", ::showBookmarksDialog),
                BrowserAction("🔐", "Passwort-Manager", "Verschlüsselte Anmeldedaten verwalten", ::showPasswordManager),
                BrowserAction("◷", "Verlauf", "Zuletzt besuchte Webseiten anzeigen", ::showHistoryDialog),
                BrowserAction("⇩", "Downloads", "Heruntergeladene Dateien verwalten", ::showDownloadsDialog),
                BrowserAction("⎙", "Drucken", "Aktuelle Webseite im Android-Druckfenster öffnen", ::printCurrentPage),
                BrowserAction("🧩", "Erweiterungen", "XPI-Add-ons verwalten", ::showExtensionsDialog),
                BrowserAction("🕶️", "Gastmodus starten", "Privat surfen ohne dauerhafte Speicherung", ::enterGuestMode),
                BrowserAction("⚙", "Einstellungen", "Browser- und Android-Funktionen", ::showSettingsDialog),
                BrowserAction("+", "Neuer Tab", "Eine neue Schleim-OS-Startseite öffnen", ::createUserTab),
                BrowserAction("▢", "Tabs", "Geöffnete Registerkarten verwalten", ::showTabsDialog),
                BrowserAction("↻", "Aktualisieren", "Aktuelle Seite neu laden") { activeSession()?.reload() }
            )
        }
        val parts = createDialogShell(
            if (isGuestMode) "Gastmodus" else "Browser-Menü",
            if (isGuestMode) "Private Sitzung – keine dauerhafte Speicherung oder Konto-Synchronisierung."
            else "Alles Wichtige an einem Ort."
        )
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

    private fun showPageElementContextMenu(
        session: GeckoSession,
        screenX: Int,
        screenY: Int,
        element: GeckoSession.ContentDelegate.ContextElement
    ) {
        if (isFinishing || isDestroyed || session !== activeSession()) return

        val linkUri = element.linkUri?.takeIf { it.isNotBlank() }
        val sourceUri = element.srcUri?.takeIf { it.isNotBlank() }
        // Keep the native menu available on ordinary page content as well as links and media.
        // This makes the page-level print action reachable with a long press anywhere.

        val location = IntArray(2)
        rootFrame.getLocationOnScreen(location)
        val anchor = View(this).apply {
            alpha = 0f
            isClickable = false
            isFocusable = false
        }
        val anchorX = (screenX - location[0]).coerceIn(0, (rootFrame.width - dp(2)).coerceAtLeast(0))
        val anchorY = (screenY - location[1]).coerceIn(0, (rootFrame.height - dp(2)).coerceAtLeast(0))
        rootFrame.addView(anchor, FrameLayout.LayoutParams(dp(2), dp(2)).apply {
            leftMargin = anchorX
            topMargin = anchorY
        })

        val popup = PopupMenu(this, anchor, Gravity.START)
        fun addAction(label: String, action: () -> Unit) {
            popup.menu.add(label).setOnMenuItemClickListener {
                action()
                true
            }
        }

        if (linkUri != null) {
            addAction("Link öffnen") { load(linkUri) }
            addAction("Link in neuem Tab öffnen") { createTab(linkUri) }
            if (!isGuestMode && isHttpUrl(linkUri)) {
                addAction("Link herunterladen") { downloadContextResource(session, linkUri) }
            }
            addAction("Link-Adresse kopieren") { copyAddressToClipboard("Link-Adresse", linkUri) }
        }

        if (sourceUri != null) {
            val sourceLabel = when (element.type) {
                GeckoSession.ContentDelegate.ContextElement.TYPE_IMAGE -> "Bild"
                GeckoSession.ContentDelegate.ContextElement.TYPE_VIDEO -> "Video"
                GeckoSession.ContentDelegate.ContextElement.TYPE_AUDIO -> "Audio"
                else -> "Datei"
            }
            addAction("$sourceLabel öffnen") { createTab(sourceUri) }
            if (!isGuestMode && isHttpUrl(sourceUri)) {
                addAction("$sourceLabel herunterladen") { downloadContextResource(session, sourceUri) }
            }
            addAction("$sourceLabel-Adresse kopieren") {
                copyAddressToClipboard("$sourceLabel-Adresse", sourceUri)
            }
        }

        if (!isGuestMode) {
            // Normal profile retains page printing from the context menu.
            addAction("Seite drucken") { printPage(session) }
        }

        popup.setOnDismissListener { rootFrame.removeView(anchor) }
        popup.show()
    }

    private fun isHttpUrl(value: String): Boolean {
        val scheme = Uri.parse(value).scheme?.lowercase(Locale.ROOT)
        return scheme == "http" || scheme == "https"
    }

    private fun copyAddressToClipboard(label: String, value: String) {
        val clipboard = getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
        clipboard.setPrimaryClip(ClipData.newPlainText(label, value))
        showToast("$label kopiert.")
    }

    private fun downloadContextResource(session: GeckoSession, url: String) {
        if (isGuestMode) {
            showToast("Downloads sind im Gastmodus deaktiviert.")
            return
        }
        if (!isHttpUrl(url)) {
            showToast("Direkte Downloads werden nur für HTTP- und HTTPS-Adressen unterstützt.")
            return
        }

        showToast("Download wird vorbereitet …")
        val request = WebRequest.Builder(url).header("Accept", "*/*")
        val referrer = sessionUrls[session]
        if (!referrer.isNullOrBlank() && isHttpUrl(referrer)) {
            request.header("Referer", referrer)
        }

        try {
            GeckoWebExecutor(runtime).fetch(request.build()).accept({ response ->
                if (response == null) {
                    runOnUiThread {
                        showToast("Download fehlgeschlagen: Keine Serverantwort.")
                    }
                } else if (response.statusCode !in 200..299) {
                    runCatching { response.body?.close() }
                    runOnUiThread {
                        showToast("Download fehlgeschlagen (HTTP ${response.statusCode}).")
                    }
                } else {
                    saveDownload(response)
                }
            }, { error ->
                runOnUiThread {
                    showToast("Download fehlgeschlagen: " + (error?.message ?: "Netzwerkfehler"))
                }
            })
        } catch (error: Exception) {
            showToast("Download konnte nicht gestartet werden: " + (error.message ?: "Fehler"))
        }
    }

    private fun printCurrentPage() {
        if (isGuestMode) { showToast("Drucken ist im Gastmodus deaktiviert."); return }
        val session = activeSession()
        if (session == null) {
            showToast("Keine Webseite zum Drucken geöffnet.")
            return
        }
        printPage(session)
    }

    private fun printPage(session: GeckoSession) {
        if (isGuestMode) return
        if (session.printDelegate == null) {
            showToast("Die Druckfunktion ist in dieser Ansicht nicht verfügbar.")
            return
        }
        try {
            session.printPageContent()
        } catch (error: Exception) {
            showToast("Druckfenster konnte nicht geöffnet werden: " + (error.message ?: "Fehler"))
        }
    }

    /**
     * Restore the last open tabs after the built-in extension is ready.
     * The most recently saved four tabs are retained, matching the browser's
     * memory limit. An incoming external URL takes priority as a new active tab.
     */
    private fun restoreOpenTabs(initialUrl: String?) {
        val prefs = getSharedPreferences(PREFERENCES, MODE_PRIVATE)
        val saved = runCatching { JSONArray(prefs.getString(KEY_SAVED_TABS, "[]")) }.getOrElse { JSONArray() }
        val entries = mutableListOf<JSONObject>()
        for (index in 0 until saved.length()) {
            saved.optJSONObject(index)?.let { item ->
                if (item.optString("url").isNotBlank()) entries.add(item)
            }
        }
        val startIndex = (entries.size - MAX_OPEN_TABS).coerceAtLeast(0)
        val retained = entries.drop(startIndex)
        retained.forEach { item ->
            val session = createTab(item.optString("url"))
            item.optString("title").takeIf { it.isNotBlank() }?.let { sessionTitles[session] = it }
        }

        if (!initialUrl.isNullOrBlank()) {
            createTab(initialUrl)
        } else if (tabs.isNotEmpty()) {
            val savedActive = prefs.getInt(KEY_ACTIVE_TAB, entries.lastIndex.coerceAtLeast(0))
            activeTabIndex = (savedActive - startIndex).coerceIn(0, tabs.lastIndex)
            showSessionInBrowser(tabs[activeTabIndex])
        } else {
            createTab(extensionHomeUrl ?: "https://www.google.com")
        }
        saveOpenTabs()
    }

    /** Save the current page of each tab and the selected tab index. */
    private fun saveOpenTabs() {
        if (isGuestMode) return
        val prefs = getSharedPreferences(PREFERENCES, MODE_PRIVATE)
        if (tabs.isEmpty()) {
            prefs.edit().remove(KEY_SAVED_TABS).remove(KEY_ACTIVE_TAB).apply()
            return
        }
        val saved = JSONArray()
        tabs.forEach { session ->
            val url = sessionUrls[session]?.takeIf { it.isNotBlank() } ?: return@forEach
            saved.put(JSONObject()
                .put("url", url)
                .put("title", sessionTitles[session] ?: ""))
        }
        prefs.edit()
            .putString(KEY_SAVED_TABS, saved.toString())
            .putInt(KEY_ACTIVE_TAB, activeTabIndex.coerceIn(0, (tabs.size - 1).coerceAtLeast(0)))
            .apply()
        scheduleAutomaticBackup()
    }

    /** Store completed top-level web visits locally; internal extension pages are excluded. */
    private fun recordVisitedPage(session: GeckoSession) {
        if (isGuestMode) return
        val url = sessionUrls[session]?.takeIf {
            it.startsWith("https://", true) || it.startsWith("http://", true)
        } ?: return
        val prefs = getSharedPreferences(PREFERENCES, MODE_PRIVATE)
        val history = runCatching { JSONArray(prefs.getString(KEY_HISTORY, "[]")) }.getOrElse { JSONArray() }
        val now = System.currentTimeMillis()
        val last = history.optJSONObject(history.length() - 1)
        if (last?.optString("url") == url && now - last.optLong("visitedAt") < 3000L) return

        history.put(JSONObject()
            .put("url", url)
            .put("title", sessionTitles[session] ?: Uri.parse(url).host ?: url)
            .put("visitedAt", now))
        while (history.length() > MAX_HISTORY_ROWS) history.remove(0)
        prefs.edit().putString(KEY_HISTORY, history.toString()).apply()
        scheduleAutomaticBackup()
    }

    private fun showHistoryDialog() {
        if (isGuestMode) { showToast("Der Verlauf ist im Gastmodus nicht verfügbar."); return }
        val parts = createDialogShell("Verlauf", "Zuletzt besuchte Webseiten auf diesem Gerät.")
        val clearButton = makeWideActionButton("Verlauf löschen") {
            AlertDialog.Builder(this)
                .setTitle("Browserverlauf löschen?")
                .setMessage("Alle lokal gespeicherten Einträge im Verlauf werden entfernt.")
                .setNegativeButton("Abbrechen", null)
                .setPositiveButton("Löschen") { _, _ ->
                    getSharedPreferences(PREFERENCES, MODE_PRIVATE).edit().remove(KEY_HISTORY).apply()
                    scheduleAutomaticBackup()
                    parts.dialog.dismiss()
                    showHistoryDialog()
                }
                .show()
        }
        parts.body.addView(clearButton, LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(42)).apply {
            bottomMargin = dp(9)
        })
        val history = runCatching {
            JSONArray(getSharedPreferences(PREFERENCES, MODE_PRIVATE).getString(KEY_HISTORY, "[]"))
        }.getOrElse { JSONArray() }
        if (history.length() == 0) {
            parts.body.addView(dialogMessage("Der Verlauf ist noch leer. Erfolgreich geöffnete HTTP- und HTTPS-Seiten erscheinen hier."))
        } else {
            for (index in history.length() - 1 downTo 0) {
                val item = history.optJSONObject(index) ?: continue
                val url = item.optString("url")
                if (url.isBlank()) continue
                val title = item.optString("title").ifBlank { Uri.parse(url).host ?: url }
                val time = SimpleDateFormat("dd.MM.yyyy · HH:mm", Locale.getDefault())
                    .format(Date(item.optLong("visitedAt")))
                val row = LinearLayout(this).apply {
                    orientation = LinearLayout.VERTICAL
                    setPadding(dp(10), dp(9), dp(10), dp(9))
                    background = roundedBackground(surface, border, 10)
                    isClickable = true
                    isFocusable = true
                    addView(TextView(this@MainActivity).apply {
                        text = title
                        textSize = 11f
                        typeface = Typeface.create("sans-serif-medium", Typeface.BOLD)
                        setTextColor(textPrimary)
                        maxLines = 1
                        ellipsize = android.text.TextUtils.TruncateAt.END
                    })
                    addView(TextView(this@MainActivity).apply {
                        text = url
                        textSize = 8f
                        setTextColor(textMuted)
                        maxLines = 2
                        ellipsize = android.text.TextUtils.TruncateAt.MIDDLE
                        setPadding(0, dp(3), 0, dp(2))
                    })
                    addView(TextView(this@MainActivity).apply {
                        text = time
                        textSize = 8f
                        setTextColor(accent)
                    })
                    setOnClickListener {
                        parts.dialog.dismiss()
                        load(url)
                    }
                }
                parts.body.addView(row, LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT).apply {
                    bottomMargin = dp(7)
                })
            }
        }
        showDialog(parts.dialog)
    }

    private fun updateGuestModeUi() {
        if (::guestBanner.isInitialized) guestBanner.visibility = if (isGuestMode) View.VISIBLE else View.GONE
        if (::titleLabel.isInitialized && isGuestMode) titleLabel.text = "Schleim Browser · Gastmodus"
        updateTabsButton()
    }

    private fun closeAllBrowserTabs() {
        if (::geckoView.isInitialized && displayedSession != null) {
            runCatching { displayedSession?.setFocused(false) }
            runCatching { displayedSession?.setActive(false) }
            runCatching { geckoView.releaseSession() }
        }
        displayedSession = null
        tabs.toList().forEach { session -> runCatching { session.close() } }
        tabs.clear()
        activeTabIndex = 0
        navigationStates.clear()
        sessionUrls.clear()
        sessionTitles.clear()
        updateTabsButton()
    }

    private fun enterGuestMode() {
        if (isGuestMode) return
        if (cloudBackupRunning) {
            showToast("Eine Browser-Sicherung läuft noch. Bitte warte, bis sie abgeschlossen ist, bevor du den Gastmodus startest.")
            return
        }
        saveOpenTabs()
        stopMediaUploadPage()
        closeAllBrowserTabs()
        isGuestMode = true
        passwordVaultUnlocked = false
        pendingVaultUnlock = null
        pendingVaultCancelled = null
        cloudBackupHandler.removeCallbacksAndMessages(null)
        cloudBackupQueued = false
        updateGuestModeUi()
        createTab("about:blank")
        showToast("Gastmodus ist aktiv. Verlauf, Tabs, Downloads, Konten und Passwörter werden nicht dauerhaft gespeichert.")
    }

    private fun leaveGuestMode() {
        if (!isGuestMode) return
        closeAllBrowserTabs()
        isGuestMode = false
        updateGuestModeUi()
        restoreOpenTabs(null)
        showToast("Gastmodus beendet. Dein reguläres Browser-Profil wurde wieder geöffnet.")
    }

    private fun showOnboarding() {
        if (isGuestMode || isFinishing || isDestroyed) return
        val parts = createDialogShell("Willkommen bei Schleim Browser", "Kurze Einführung – du kannst sie jederzeit überspringen.")
        val slides = listOf(
            Triple("🏠", "Startseite & Schleim OS", "Öffne die Schleim-OS-Startseite und nutze deine Apps, deine persönliche Oberfläche und die integrierten Cloud-Funktionen."),
            Triple("▢", "Tabs & Verlauf", "Öffne mehrere Tabs. Der reguläre Browserverlauf wird lokal gespeichert und kann jederzeit gelöscht werden."),
            Triple("☆", "Lesezeichen & Passwörter", "Speichere Webseiten als Lesezeichen. Der Passwort-Manager kann Anmeldedaten nach deiner Bestätigung verschlüsselt speichern."),
            Triple("🧩", "Add-ons", "Verwalte kompatible GeckoView-Erweiterungen und installiere unterstützte, von Mozilla signierte XPI-Dateien."),
            Triple("☁️", "Konto & Cloud-Sicherung", "Verbinde dein GitHub-Konto, um ein verschlüsseltes Browser-Profil in deinem privaten Repository zu sichern und auf einem weiteren Gerät wiederherzustellen."),
            Triple("🕶️", "Gastmodus", "Nutze private Tabs ohne dauerhafte Speicherung oder Cloud-Synchronisierung. Dein reguläres Profil bleibt davon getrennt.")
        )
        var current = 0
        val hero = TextView(this).apply {
            textSize = 46f
            gravity = Gravity.CENTER
            setTextColor(accent)
            setPadding(0, dp(18), 0, dp(10))
        }
        val heading = TextView(this).apply {
            textSize = 17f
            typeface = Typeface.create("sans-serif-medium", Typeface.BOLD)
            setTextColor(textPrimary)
            gravity = Gravity.CENTER
            setPadding(dp(8), dp(4), dp(8), dp(6))
        }
        val description = TextView(this).apply {
            textSize = 12f
            setTextColor(textMuted)
            gravity = Gravity.CENTER
            setPadding(dp(10), dp(4), dp(10), dp(16))
        }
        val indicator = TextView(this).apply {
            textSize = 10f
            setTextColor(accent)
            gravity = Gravity.CENTER
            setPadding(0, dp(2), 0, dp(12))
        }
        val navigation = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER
        }
        lateinit var renderSlide: () -> Unit
        val previous = makeTextButton("‹ Zurück") {
            current = (current - 1).coerceAtLeast(0)
            renderSlide()
        }
        val next = makeTextButton("Weiter ›") {
            if (current < slides.lastIndex) {
                current++
                renderSlide()
            } else {
                finishOnboarding(parts.dialog)
            }
        }
        navigation.addView(previous, LinearLayout.LayoutParams(0, dp(42), 1f).apply { marginEnd = dp(7) })
        navigation.addView(next, LinearLayout.LayoutParams(0, dp(42), 1f))
        val skip = makeWideActionButton("Überspringen") { finishOnboarding(parts.dialog) }
        val guest = makeWideActionButton("Als Gast starten") {
            getSharedPreferences(PREFERENCES, MODE_PRIVATE).edit().putBoolean(KEY_ONBOARDING_DONE, true).apply()
            parts.dialog.dismiss()
            enterGuestMode()
        }
        parts.body.addView(hero)
        parts.body.addView(heading)
        parts.body.addView(description)
        parts.body.addView(indicator)
        parts.body.addView(navigation)
        parts.body.addView(skip, LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(40)).apply { topMargin = dp(8) })
        parts.body.addView(makeWideActionButton("Direkt zum Browser starten") {
            finishOnboarding(parts.dialog)
        }, LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(40)).apply { topMargin = dp(7) })
        parts.body.addView(guest, LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(40)).apply { topMargin = dp(7) })
        renderSlide = {
            val slide = slides[current]
            hero.text = slide.first
            heading.text = slide.second
            description.text = slide.third
            indicator.text = "Schritt " + (current + 1) + " von " + slides.size
            previous.isEnabled = current > 0
            previous.alpha = if (current > 0) 1f else 0.35f
            next.text = if (current == slides.lastIndex) "Browser starten" else "Weiter ›"
        }
        renderSlide()
        showDialog(parts.dialog)
    }

    private fun finishOnboarding(dialog: Dialog) {
        getSharedPreferences(PREFERENCES, MODE_PRIVATE).edit().putBoolean(KEY_ONBOARDING_DONE, true).apply()
        dialog.dismiss()
    }

    private fun addCurrentBookmark() {
        if (isGuestMode) {
            showToast("Lesezeichen sind im Gastmodus deaktiviert.")
            return
        }
        val session = activeSession() ?: return
        val url = sessionUrls[session]?.takeIf { it.startsWith("https://") || it.startsWith("http://") }
        if (url == null) {
            showToast("Für diese interne Seite kann kein Lesezeichen gespeichert werden.")
            return
        }
        val bookmarks = readBookmarks()
        if ((0 until bookmarks.length()).any { bookmarks.optJSONObject(it)?.optString("url") == url }) {
            showToast("Diese Seite ist bereits als Lesezeichen gespeichert.")
            return
        }
        bookmarks.put(JSONObject()
            .put("id", UUID.randomUUID().toString())
            .put("title", sessionTitles[session] ?: Uri.parse(url).host ?: url)
            .put("url", url)
            .put("createdAt", System.currentTimeMillis()))
        saveBookmarks(bookmarks)
        showToast("Lesezeichen gespeichert.")
    }

    private fun readBookmarks(): JSONArray = runCatching {
        JSONArray(getSharedPreferences(PREFERENCES, MODE_PRIVATE).getString(KEY_BOOKMARKS, "[]"))
    }.getOrElse { JSONArray() }

    private fun saveBookmarks(bookmarks: JSONArray) {
        if (isGuestMode) return
        getSharedPreferences(PREFERENCES, MODE_PRIVATE).edit().putString(KEY_BOOKMARKS, bookmarks.toString()).apply()
        scheduleAutomaticBackup()
    }

    private fun showBookmarksDialog() {
        if (isGuestMode) { showToast("Lesezeichen sind im Gastmodus nicht verfügbar."); return }
        val parts = createDialogShell("Lesezeichen", "Deine gespeicherten Webseiten.")
        parts.body.addView(makeWideActionButton("＋ Aktuelle Seite speichern") { addCurrentBookmark() },
            LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(42)).apply { bottomMargin = dp(8) })
        val bookmarks = readBookmarks()
        if (bookmarks.length() == 0) {
            parts.body.addView(dialogMessage("Noch keine Lesezeichen gespeichert. Tippe auf ☆ neben der Adressleiste, um eine Seite hinzuzufügen."))
        } else {
            for (index in 0 until bookmarks.length()) {
                val item = bookmarks.optJSONObject(index) ?: continue
                val id = item.optString("id")
                val row = LinearLayout(this).apply {
                    orientation = LinearLayout.VERTICAL
                    background = roundedBackground(surface, border, 10)
                    setPadding(dp(10), dp(9), dp(10), dp(9))
                }
                row.addView(TextView(this).apply {
                    text = item.optString("title", item.optString("url"))
                    textSize = 11f
                    typeface = Typeface.create("sans-serif-medium", Typeface.BOLD)
                    setTextColor(textPrimary)
                    maxLines = 1
                    ellipsize = android.text.TextUtils.TruncateAt.END
                })
                row.addView(TextView(this).apply {
                    text = item.optString("url")
                    textSize = 8f
                    setTextColor(textMuted)
                    maxLines = 2
                    ellipsize = android.text.TextUtils.TruncateAt.MIDDLE
                    setPadding(0, dp(3), 0, dp(7))
                })
                val buttons = LinearLayout(this).apply { orientation = LinearLayout.HORIZONTAL }
                buttons.addView(makeTextButton("Öffnen") {
                    parts.dialog.dismiss()
                    load(item.optString("url"))
                }, LinearLayout.LayoutParams(0, dp(34), 1f).apply { marginEnd = dp(5) })
                buttons.addView(makeTextButton("Bearbeiten") {
                    parts.dialog.dismiss()
                    editBookmark(id)
                }, LinearLayout.LayoutParams(0, dp(34), 1f).apply { marginEnd = dp(5) })
                buttons.addView(makeTextButton("Löschen") {
                    deleteBookmark(id)
                    parts.dialog.dismiss()
                    showBookmarksDialog()
                }, LinearLayout.LayoutParams(0, dp(34), 1f))
                row.addView(buttons)
                parts.body.addView(row, LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT).apply {
                    bottomMargin = dp(7)
                })
            }
        }
        showDialog(parts.dialog)
    }

    private fun editBookmark(id: String) {
        val bookmarks = readBookmarks()
        val index = (0 until bookmarks.length()).firstOrNull { bookmarks.optJSONObject(it)?.optString("id") == id } ?: return
        val item = bookmarks.getJSONObject(index)
        val content = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(20), dp(10), dp(20), 0)
        }
        val title = EditText(this).apply {
            hint = "Name des Lesezeichens"
            setSingleLine(true)
            setText(item.optString("title"))
        }
        val url = EditText(this).apply {
            hint = "https://example.com"
            setSingleLine(true)
            inputType = InputType.TYPE_CLASS_TEXT or InputType.TYPE_TEXT_VARIATION_URI
            setText(item.optString("url"))
        }
        content.addView(title)
        content.addView(url)
        AlertDialog.Builder(this)
            .setTitle("Lesezeichen bearbeiten")
            .setView(content)
            .setNegativeButton("Abbrechen", null)
            .setPositiveButton("Speichern") { _, _ ->
                val newUrl = url.text.toString().trim()
                if (newUrl.startsWith("https://") || newUrl.startsWith("http://")) {
                    item.put("title", title.text.toString().trim().ifBlank { newUrl })
                    item.put("url", newUrl)
                    saveBookmarks(bookmarks)
                    showBookmarksDialog()
                } else showToast("Bitte eine gültige HTTP- oder HTTPS-Adresse eingeben.")
            }
            .show()
    }

    private fun deleteBookmark(id: String) {
        val bookmarks = readBookmarks()
        val filtered = JSONArray()
        for (index in 0 until bookmarks.length()) {
            val item = bookmarks.optJSONObject(index) ?: continue
            if (item.optString("id") != id) filtered.put(item)
        }
        saveBookmarks(filtered)
    }

    private fun ensureVaultUnlocked(onUnlocked: () -> Unit, onCancelled: () -> Unit = {}) {
        if (isGuestMode) {
            showToast("Der Passwort-Manager ist im Gastmodus deaktiviert.")
            onCancelled()
            return
        }
        if (passwordVaultUnlocked) {
            onUnlocked()
            return
        }
        val keyguard = getSystemService(KeyguardManager::class.java)
        if (keyguard?.isDeviceSecure != true) {
            AlertDialog.Builder(this)
                .setTitle("Displaysperre erforderlich")
                .setMessage("Richte zuerst eine sichere Displaysperre mit PIN, Muster oder Passwort in Android ein. Danach kann der Passwort-Manager geschützt geöffnet werden.")
                .setNegativeButton("Abbrechen", null)
                .setPositiveButton("Android-Einstellungen") { _, _ ->
                    runCatching { startActivity(Intent(Settings.ACTION_SECURITY_SETTINGS)) }
                }
                .show()
            onCancelled()
            return
        }
        val intent = keyguard.createConfirmDeviceCredentialIntent(
            "Passwort-Manager entsperren",
            "Bestätige deine Displaysperre, um gespeicherte Anmeldedaten zu öffnen."
        )
        if (intent == null) {
            showToast("Android kann die sichere Geräteentsperrung auf diesem Gerät nicht starten.")
            onCancelled()
            return
        }
        pendingVaultUnlock = onUnlocked
        pendingVaultCancelled = onCancelled
        try {
            startActivityForResult(intent, REQUEST_VAULT_UNLOCK)
        } catch (error: Exception) {
            pendingVaultUnlock = null
            pendingVaultCancelled = null
            onCancelled()
            showToast("Entsperrung konnte nicht gestartet werden: ${error.message ?: "Fehler"}")
        }
    }

    private fun showPasswordManager() {
        if (isGuestMode) {
            showToast("Der Passwort-Manager ist im Gastmodus deaktiviert.")
            return
        }
        ensureVaultUnlocked(onUnlocked = { showPasswordManagerUnlocked() })
    }

    private fun showPasswordManagerUnlocked() {
        if (isGuestMode || !passwordVaultUnlocked) return
        val parts = createDialogShell("Passwort-Manager", "Anmeldedaten werden verschlüsselt mit dem Android-Keystore geschützt.")
        val prefs = getSharedPreferences(PREFERENCES, MODE_PRIVATE)
        val autofill = CheckBox(this).apply {
            text = "Gespeicherte Anmeldungen auf passenden Webseiten vorschlagen"
            textSize = 10f
            setTextColor(textPrimary)
            buttonTintList = android.content.res.ColorStateList.valueOf(accent)
            isChecked = prefs.getBoolean(KEY_PASSWORD_AUTOFILL, false)
            setOnCheckedChangeListener { _, checked ->
                if (!isGuestMode) {
                    prefs.edit().putBoolean(KEY_PASSWORD_AUTOFILL, checked).apply()
                    scheduleAutomaticBackup()
                    showToast(if (checked) "Passwortvorschläge aktiviert." else "Passwortvorschläge deaktiviert.")
                }
            }
        }
        parts.body.addView(autofill, LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT).apply {
            bottomMargin = dp(8)
        })
        parts.body.addView(dialogMessage("Neue Logins werden erst nach deiner Bestätigung gespeichert. Die Zugangsdaten werden nicht im normalen Browser-Verlauf abgelegt."))
        parts.body.addView(makeWideActionButton("Passwort-Manager jetzt sperren") {
            passwordVaultUnlocked = false
            parts.dialog.dismiss()
        }, LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(40)).apply {
            topMargin = dp(8)
            bottomMargin = dp(8)
        })
        val entries = readPasswordEntries()
        if (entries.length() == 0) {
            parts.body.addView(dialogMessage("Noch keine Anmeldedaten gespeichert. Melde dich auf einer Webseite an und bestätige anschließend das Speichern."))
        } else {
            for (index in 0 until entries.length()) {
                val item = entries.optJSONObject(index) ?: continue
                val guid = item.optString("guid")
                val row = LinearLayout(this).apply {
                    orientation = LinearLayout.VERTICAL
                    background = roundedBackground(surface, border, 10)
                    setPadding(dp(10), dp(9), dp(10), dp(9))
                }
                row.addView(TextView(this).apply {
                    text = item.optString("origin")
                    textSize = 10f
                    setTextColor(textPrimary)
                    typeface = Typeface.create("sans-serif-medium", Typeface.BOLD)
                    maxLines = 1
                    ellipsize = android.text.TextUtils.TruncateAt.END
                })
                row.addView(TextView(this).apply {
                    text = "Benutzername: " + item.optString("username")
                    textSize = 9f
                    setTextColor(textMuted)
                    setPadding(0, dp(3), 0, dp(4))
                })
                val passwordView = TextView(this).apply {
                    text = "Passwort: ••••••••••"
                    textSize = 9f
                    setTextColor(textMuted)
                    setPadding(0, 0, 0, dp(6))
                }
                row.addView(passwordView)
                val buttons = LinearLayout(this).apply { orientation = LinearLayout.HORIZONTAL }
                var revealed = false
                buttons.addView(makeTextButton("Anzeigen") {
                    revealed = !revealed
                    passwordView.text = if (revealed) "Passwort: " + item.optString("password") else "Passwort: ••••••••••"
                }, LinearLayout.LayoutParams(0, dp(34), 1f).apply { marginEnd = dp(5) })
                buttons.addView(makeTextButton("Bearbeiten") {
                    parts.dialog.dismiss()
                    editPasswordEntry(guid)
                }, LinearLayout.LayoutParams(0, dp(34), 1f).apply { marginEnd = dp(5) })
                buttons.addView(makeTextButton("Löschen") {
                    deletePasswordEntry(guid)
                    parts.dialog.dismiss()
                    showPasswordManagerUnlocked()
                }, LinearLayout.LayoutParams(0, dp(34), 1f))
                row.addView(buttons)
                parts.body.addView(row, LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT).apply {
                    bottomMargin = dp(7)
                })
            }
        }
        showDialog(parts.dialog)
        passwordManagerDialog = parts.dialog
    }

    private fun editPasswordEntry(guid: String) {
        if (!passwordVaultUnlocked || isGuestMode) return
        val entries = readPasswordEntries()
        val index = (0 until entries.length()).firstOrNull { entries.optJSONObject(it)?.optString("guid") == guid } ?: return
        val item = entries.getJSONObject(index)
        val content = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(20), dp(8), dp(20), 0)
        }
        val origin = EditText(this).apply {
            hint = "Webseite / Origin"
            setSingleLine(true)
            setText(item.optString("origin"))
        }
        val username = EditText(this).apply {
            hint = "Benutzername"
            setSingleLine(true)
            setText(item.optString("username"))
        }
        val password = EditText(this).apply {
            hint = "Passwort"
            setSingleLine(true)
            inputType = InputType.TYPE_CLASS_TEXT or InputType.TYPE_TEXT_VARIATION_PASSWORD
            setText(item.optString("password"))
        }
        content.addView(origin)
        content.addView(username)
        content.addView(password)
        AlertDialog.Builder(this)
            .setTitle("Anmeldedaten bearbeiten")
            .setView(content)
            .setNegativeButton("Abbrechen", null)
            .setPositiveButton("Speichern") { _, _ ->
                val url = origin.text.toString().trim()
                if (!url.startsWith("https://") && !url.startsWith("http://")) {
                    showToast("Bitte eine gültige HTTP- oder HTTPS-Adresse eingeben.")
                    return@setPositiveButton
                }
                item.put("origin", url)
                    .put("username", username.text.toString())
                    .put("password", password.text.toString())
                    .put("updatedAt", System.currentTimeMillis())
                writePasswordEntries(entries)
                showPasswordManagerUnlocked()
            }
            .show()
    }

    private fun deletePasswordEntry(guid: String) {
        if (!passwordVaultUnlocked || isGuestMode) return
        val entries = readPasswordEntries()
        val filtered = JSONArray()
        for (index in 0 until entries.length()) {
            val item = entries.optJSONObject(index) ?: continue
            if (item.optString("guid") != guid) filtered.put(item)
        }
        writePasswordEntries(filtered)
    }

    private fun showAccountDialog() {
        if (isGuestMode) {
            showToast("Im Gastmodus ist keine Konto-Anmeldung oder Synchronisierung möglich.")
            return
        }
        val account = cloudSync.currentAccount()
        val parts = createDialogShell("Konto", "Schleim Browser – Konto und private Cloud-Sicherung")
        parts.body.addView(createInfoRow(
            "Privates Repository erforderlich",
            "Für die Synchronisierung wird ausschließlich das private GitHub-Repository schleim-os-cloud verwendet. Die Sicherungsdatei wird vor dem Upload mit AES-256-GCM verschlüsselt. Das Backup-Passwort brauchst du auch auf jedem weiteren Gerät."
        ), LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT).apply {
            bottomMargin = dp(8)
        })
        parts.body.addView(createInfoRow(
            "Datenschutz im Gastmodus",
            "Im Gastmodus gibt es keine Konto-Anmeldung, keine dauerhafte Speicherung und keine Cloud-Synchronisierung. Das reguläre Profil bleibt getrennt."
        ), LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT).apply {
            bottomMargin = dp(8)
        })
        if (account == null) {
            parts.body.addView(dialogMessage("Du bist nicht angemeldet. Ohne erfolgreiche GitHub-Anmeldung sind Sicherung und Wiederherstellung gesperrt."))
            val installStarted = getSharedPreferences(PREFERENCES, MODE_PRIVATE)
                .getBoolean(KEY_ACCOUNT_INSTALL_STARTED, false)
            parts.body.addView(makeWideActionButton(
                if (installStarted) "Weiter – Gerätecode anzeigen" else "Schleim OS Account öffnen"
            ) {
                parts.dialog.dismiss()
                if (installStarted) {
                    startGitHubDeviceLogin()
                } else {
                    getSharedPreferences(PREFERENCES, MODE_PRIVATE).edit()
                        .putBoolean(KEY_ACCOUNT_INSTALL_STARTED, true).apply()
                    createTab(GITHUB_APP_INSTALL_URL)
                    showToast("Schleim OS Account wurde in einem neuen Tab geöffnet. Installiere die GitHub-App und kehre danach zu Einstellungen → Schleim-Konto zurück.")
                }
            }, LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(44)).apply {
                topMargin = dp(7)
            })
            if (installStarted) {
                parts.body.addView(makeTextButton("GitHub-App erneut öffnen") {
                    parts.dialog.dismiss()
                    createTab(GITHUB_APP_INSTALL_URL)
                }, LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(40)).apply {
                    topMargin = dp(6)
                })
                parts.body.addView(dialogMessage("Nach der Installation tippe auf „Weiter – Gerätecode anzeigen“. Der Code wird angezeigt und kopiert; die GitHub-Gerätefreigabe öffnet sich in einem weiteren Tab. Die Anmeldung wird automatisch geprüft."))
            } else {
                parts.body.addView(dialogMessage("Zuerst öffnet sich die GitHub-App „Schleim OS Account“ in einem neuen Tab. Installiere sie dort. Du kannst den Tab anschließend schließen und hier mit „Weiter“ fortfahren. Dein GitHub-Passwort gibst du nur direkt bei GitHub ein – nicht in Schleim Browser."))
            }
        } else {
            parts.body.addView(createInfoRow(
                "Angemeldet als " + account.name,
                account.login + " · " + account.email + "\nPrivates Repository: " + account.repository
            ), LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT).apply {
                bottomMargin = dp(8)
            })
            parts.body.addView(makeWideActionButton("Browser-App-Daten verschlüsselt sichern") {
                parts.dialog.dismiss()
                ensureBackupPassphrase { passphrase -> startProfileBackup(passphrase, false) }
            }, LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(44)).apply {
                bottomMargin = dp(7)
            })
            parts.body.addView(makeWideActionButton("Browser-Profil wiederherstellen") {
                parts.dialog.dismiss()
                requestRestorePassphrase()
            }, LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(44)).apply {
                bottomMargin = dp(7)
            })
            val automatic = CheckBox(this).apply {
                text = "Automatische Sicherung aktivieren"
                textSize = 10f
                setTextColor(textPrimary)
                buttonTintList = android.content.res.ColorStateList.valueOf(accent)
                isChecked = getSharedPreferences(PREFERENCES, MODE_PRIVATE).getBoolean(KEY_AUTO_BACKUP, false)
                setOnCheckedChangeListener { _, checked ->
                    if (checked) {
                        ensureBackupPassphrase { _ ->
                            getSharedPreferences(PREFERENCES, MODE_PRIVATE).edit().putBoolean(KEY_AUTO_BACKUP, true).apply()
                            scheduleAutomaticBackup()
                            showToast("Automatische Profil-Sicherung wurde aktiviert.")
                        }
                    } else {
                        getSharedPreferences(PREFERENCES, MODE_PRIVATE).edit().putBoolean(KEY_AUTO_BACKUP, false).apply()
                        cloudBackupHandler.removeCallbacksAndMessages(null)
                        showToast("Automatische Profil-Sicherung wurde deaktiviert.")
                    }
                }
            }
            parts.body.addView(automatic, LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT).apply {
                topMargin = dp(4)
                bottomMargin = dp(7)
            })
            parts.body.addView(dialogMessage(
                if (account.lastBackupAt.isBlank()) "Es wurde noch kein Browser-Backup hochgeladen."
                else "Letzte Sicherung: " + account.lastBackupAt
            ))
            parts.body.addView(makeTextButton("Vom Konto abmelden") {
                cloudSync.signOut()
                getSharedPreferences(PREFERENCES, MODE_PRIVATE).edit().putBoolean(KEY_AUTO_BACKUP, false).apply()
                cloudBackupHandler.removeCallbacksAndMessages(null)
                parts.dialog.dismiss()
                showToast("Vom Schleim-Konto abgemeldet. Das private GitHub-Backup bleibt bestehen.")
            }, LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(42)).apply {
                topMargin = dp(8)
            })
        }
        showDialog(parts.dialog)
    }

    private fun startGitHubDeviceLogin() {
        if (isGuestMode) return
        deviceLoginCancelled = false
        val verificationTab = createTab("about:blank")
        showToast("GitHub-Gerätecode wird angefordert …")
        ioExecutor.execute {
            try {
                val code = cloudSync.beginDeviceFlow()
                runOnUiThread {
                    if (!isFinishing && !isDestroyed && !isGuestMode) {
                        showGitHubDeviceCode(code, verificationTab)
                    }
                }
            } catch (error: Exception) {
                runOnUiThread {
                    if (!isFinishing && !isDestroyed) {
                        val index = tabs.indexOf(verificationTab)
                        if (index >= 0 && tabs.size > 1) closeTab(index)
                        showToast("GitHub-Anmeldung fehlgeschlagen: ${error.message ?: "Fehler"}")
                    }
                }
            }
        }
    }

    private fun showGitHubDeviceCode(code: BrowserCloudSync.DeviceCode, verificationTab: GeckoSession) {
        if (isGuestMode || !::deviceCodeBanner.isInitialized) return
        deviceCodeBanner.removeAllViews()

        val header = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
        }
        header.addView(TextView(this).apply {
            text = "GitHub-Gerätecode"
            textSize = 10f
            typeface = Typeface.create("sans-serif-medium", Typeface.BOLD)
            setTextColor(textPrimary)
        }, LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f))
        header.addView(makeIconButton("×", "GitHub-Anmeldung abbrechen") {
            deviceLoginCancelled = true
            deviceCodeBanner.visibility = View.GONE
            showToast("GitHub-Anmeldung wird abgebrochen.")
        }, LinearLayout.LayoutParams(dp(30), dp(30)))
        deviceCodeBanner.addView(header)

        deviceCodeBanner.addView(TextView(this).apply {
            text = code.userCode
            textSize = 21f
            letterSpacing = 0.16f
            gravity = Gravity.CENTER
            typeface = Typeface.create("sans-serif-medium", Typeface.BOLD)
            setTextColor(accent)
            setTextIsSelectable(true)
            setPadding(0, dp(4), 0, dp(4))
        }, LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT))
        deviceCodeBanner.addView(TextView(this).apply {
            text = "Diesen Code auf der GitHub-Gerätefreigabe eingeben. Der Code wurde automatisch in die Zwischenablage kopiert."
            textSize = 8f
            setTextColor(textMuted)
            gravity = Gravity.CENTER
        })

        val actions = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER
            setPadding(0, dp(5), 0, 0)
        }
        actions.addView(makeTextButton("Code kopieren") {
            copyGitHubDeviceCode(code.userCode)
            showToast("GitHub-Gerätecode kopiert.")
        }, LinearLayout.LayoutParams(0, dp(34), 1f).apply { marginEnd = dp(5) })
        actions.addView(makeTextButton("Zurück") {
            val index = tabs.indexOf(verificationTab)
            if (index >= 0 && tabs.size > 1) closeTab(index)
        }, LinearLayout.LayoutParams(0, dp(34), 1f).apply { marginEnd = dp(5) })
        actions.addView(makeTextButton("GitHub öffnen") {
            if (tabs.contains(verificationTab)) {
                sessionUrls[verificationTab] = code.verificationUri
                verificationTab.loadUri(code.verificationUri)
                showSessionInBrowser(verificationTab)
            } else {
                createTab(code.verificationUri)
            }
        }, LinearLayout.LayoutParams(0, dp(34), 1f))
        deviceCodeBanner.addView(actions)
        deviceCodeBanner.visibility = View.VISIBLE

        runCatching { copyGitHubDeviceCode(code.userCode) }
            .onFailure { Log.w(TAG, "Could not copy GitHub device code automatically", it) }

        if (tabs.contains(verificationTab)) {
            sessionUrls[verificationTab] = code.verificationUri
            verificationTab.loadUri(code.verificationUri)
            showSessionInBrowser(verificationTab)
        } else {
            createTab(code.verificationUri)
        }
        pollGitHubDeviceLogin(code)
    }

    private fun copyGitHubDeviceCode(value: String) {
        val clipboard = getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
        clipboard.setPrimaryClip(ClipData.newPlainText("GitHub-Gerätecode", value))
    }

    private fun pollGitHubDeviceLogin(code: BrowserCloudSync.DeviceCode) {
        if (isGuestMode) return
        showToast("Warte auf die Bestätigung von GitHub …")
        ioExecutor.execute {
            try {
                var interval = code.intervalSeconds
                var loggedIn: BrowserCloudSync.Account? = null
                var failure: String? = null
                while (!deviceLoginCancelled && System.currentTimeMillis() < code.expiresAtMillis && loggedIn == null && failure == null) {
                    if (isFinishing || isDestroyed) break
                    val response = cloudSync.pollDeviceFlow(code)
                    val tokenError = response.optString("error")
                    when {
                        response.optString("access_token").isNotBlank() -> loggedIn = cloudSync.completeLogin(response)
                        tokenError == "authorization_pending" -> Thread.sleep(interval * 1000L)
                        tokenError == "slow_down" -> {
                            interval += 5
                            Thread.sleep(interval * 1000L)
                        }
                        tokenError == "expired_token" -> failure = "Der GitHub-Gerätecode ist abgelaufen. Bitte starte die Anmeldung erneut."
                        tokenError == "access_denied" -> failure = "Die Anmeldung wurde bei GitHub abgelehnt."
                        tokenError.isNotBlank() -> failure = response.optString("error_description", tokenError)
                        else -> Thread.sleep(interval * 1000L)
                    }
                }
                if (deviceLoginCancelled && failure == null) failure = "Die Anmeldung wurde abgebrochen."
                if (loggedIn == null && failure == null) failure = "Die Anmeldung wurde nicht rechtzeitig bestätigt."
                runOnUiThread {
                    if (isFinishing || isDestroyed) return@runOnUiThread
                    if (loggedIn != null) {
                        deviceCodeBanner.visibility = View.GONE
                        getSharedPreferences(PREFERENCES, MODE_PRIVATE).edit()
                            .putBoolean(KEY_ACCOUNT_INSTALL_STARTED, false).apply()
                        showToast("Schleim-Konto verbunden: " + loggedIn!!.login)
                        showAccountDialog()
                    } else {
                        if (deviceLoginCancelled || failure?.contains("abgelaufen") == true) {
                            deviceCodeBanner.visibility = View.GONE
                        }
                        showToast(failure ?: "GitHub-Anmeldung fehlgeschlagen.")
                    }
                }
            } catch (error: Exception) {
                runOnUiThread {
                    if (!isFinishing && !isDestroyed) {
                        deviceCodeBanner.visibility = View.GONE
                        showToast("GitHub-Anmeldung fehlgeschlagen: ${error.message ?: "Fehler"}")
                    }
                }
            }
        }
    }

    private fun ensureBackupPassphrase(onReady: (String) -> Unit) {
        if (isGuestMode || !cloudSync.hasSession()) {
            showToast("Bitte melde dich zuerst unter Konto an.")
            return
        }
        val existing = runCatching { secureProfileStore.getString(KEY_CLOUD_PASSPHRASE) }.getOrNull()
        if (!existing.isNullOrBlank()) {
            onReady(existing)
            return
        }
        val content = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(20), dp(8), dp(20), 0)
        }
        val password = EditText(this).apply {
            hint = "Backup-Passwort (mindestens 12 Zeichen)"
            inputType = InputType.TYPE_CLASS_TEXT or InputType.TYPE_TEXT_VARIATION_PASSWORD
            setSingleLine(true)
        }
        val confirm = EditText(this).apply {
            hint = "Backup-Passwort wiederholen"
            inputType = InputType.TYPE_CLASS_TEXT or InputType.TYPE_TEXT_VARIATION_PASSWORD
            setSingleLine(true)
        }
        content.addView(password)
        content.addView(confirm)
        AlertDialog.Builder(this)
            .setTitle("Backup-Passwort festlegen")
            .setMessage("Dieses Passwort verschlüsselt dein Browser-Profil vor dem Upload. Du brauchst es auch auf jedem weiteren Gerät. Es kann nicht von GitHub zurückgesetzt werden.")
            .setView(content)
            .setNegativeButton("Abbrechen", null)
            .setPositiveButton("Sicher speichern") { _, _ ->
                val first = password.text.toString()
                if (first.length < 12 || first != confirm.text.toString()) {
                    showToast("Die Passwörter müssen übereinstimmen und mindestens 12 Zeichen lang sein.")
                    return@setPositiveButton
                }
                try {
                    secureProfileStore.putString(KEY_CLOUD_PASSPHRASE, first)
                    onReady(first)
                } catch (error: Exception) {
                    showToast("Backup-Passwort konnte nicht sicher gespeichert werden: ${error.message ?: "Fehler"}")
                }
            }
            .show()
    }

    private fun requestRestorePassphrase() {
        if (isGuestMode || !cloudSync.hasSession()) {
            showToast("Bitte melde dich zuerst unter Konto an.")
            return
        }
        val input = EditText(this).apply {
            hint = "Backup-Passwort"
            setSingleLine(true)
            inputType = InputType.TYPE_CLASS_TEXT or InputType.TYPE_TEXT_VARIATION_PASSWORD
        }
        AlertDialog.Builder(this)
            .setTitle("Browser-Profil wiederherstellen")
            .setMessage("Gib das Passwort ein, mit dem das private Browser-Backup verschlüsselt wurde.")
            .setView(input)
            .setNegativeButton("Abbrechen", null)
            .setPositiveButton("Entschlüsseln und prüfen") { _, _ ->
                val passphrase = input.text.toString()
                if (passphrase.length < 12) {
                    showToast("Das Backup-Passwort ist zu kurz.")
                    return@setPositiveButton
                }
                ensureVaultUnlocked(onUnlocked = { startProfileRestore(passphrase) })
            }
            .show()
    }

    private fun scheduleAutomaticBackup() {
        if (isGuestMode) return
        if (cloudBackupRunning) {
            cloudBackupQueued = true
            return
        }
        val prefs = getSharedPreferences(PREFERENCES, MODE_PRIVATE)
        if (!prefs.getBoolean(KEY_AUTO_BACKUP, false) || !cloudSync.hasSession()) return
        val passphrase = runCatching { secureProfileStore.getString(KEY_CLOUD_PASSPHRASE) }.getOrNull()
        if (passphrase.isNullOrBlank()) return
        cloudBackupHandler.removeCallbacksAndMessages(null)
        cloudBackupQueued = true
        cloudBackupHandler.postDelayed({
            cloudBackupQueued = false
            if (!isGuestMode && cloudSync.hasSession()) startProfileBackup(passphrase, true)
        }, 90_000L)
    }

    private fun readExtensionIdFromXpi(file: File): String? = runCatching {
        ZipFile(file).use { archive ->
            val entry = archive.getEntry("manifest.json") ?: return@use null
            val manifest = archive.getInputStream(entry).bufferedReader(Charsets.UTF_8).use {
                JSONObject(it.readText())
            }
            val gecko = manifest.optJSONObject("browser_specific_settings")?.optJSONObject("gecko")
                ?: manifest.optJSONObject("applications")?.optJSONObject("gecko")
            gecko?.optString("id")?.takeIf { it.isNotBlank() }
        }
    }.getOrNull()

    private fun finishCloudBackup() {
        cloudBackupRunning = false
        if (cloudBackupQueued && !isGuestMode) {
            cloudBackupQueued = false
            scheduleAutomaticBackup()
        }
    }

    private fun startProfileBackup(passphrase: String, automatic: Boolean) {
        if (isGuestMode || !cloudSync.hasSession()) {
            if (!automatic) showToast("Bitte melde dich zuerst unter Konto an.")
            return
        }
        if (cloudBackupRunning) {
            if (!automatic) showToast("Eine Profil-Sicherung läuft bereits.")
            return
        }
        cloudBackupRunning = true
        if (!automatic) showToast("Browser-Profil wird verschlüsselt und gesichert …")
        runtime.getWebExtensionController().list().accept({ installed ->
            val addOns = installed ?: emptyList()
            ioExecutor.execute {
                try {
                    if (isGuestMode) throw IllegalStateException("Im Gastmodus ist keine Sicherung erlaubt.")
                    val prefs = getSharedPreferences(PREFERENCES, MODE_PRIVATE)
                    val passwords = runCatching { readPasswordEntries() }.getOrElse { JSONArray() }
                    val preferences = JSONObject()
                    prefs.all.forEach { (key, value) ->
                        when (value) {
                            is String, is Boolean, is Int, is Long, is Double -> preferences.put(key, value)
                        }
                    }
                    val files = mutableListOf<Pair<File, String>>()
                    val packageDirs = listOf(
                        File(filesDir, "extension-packages"),
                        File(cacheDir, "extension-import")
                    )
                    packageDirs.forEachIndexed { dirIndex, dir ->
                        dir.listFiles()?.filter { it.isFile && it.extension.equals("xpi", true) }?.forEach { file ->
                            if (files.none { it.first.canonicalPath == file.canonicalPath }) {
                                files.add(file to ("extensions/installed/" + dirIndex + "-" + files.size + "-" + file.name))
                            }
                        }
                    }
                    downloadsDirectory().listFiles()?.filter { it.isFile && it.extension.equals("xpi", true) }?.forEach { file ->
                        if (files.none { it.first.canonicalPath == file.canonicalPath }) {
                            files.add(file to ("extensions/downloads/" + files.size + "-" + file.name))
                        }
                    }
                    val packageEntriesById = files.mapNotNull { (file, entryName) ->
                        readExtensionIdFromXpi(file)?.let { it to entryName }
                    }.toMap()
                    val addonMetadata = JSONArray()
                    addOns.forEach { item ->
                        addonMetadata.put(JSONObject()
                            .put("id", item.id)
                            .put("name", item.metaData.name ?: item.id)
                            .put("version", item.metaData.version)
                            .put("enabled", item.metaData.enabled)
                            .put("builtIn", item.isBuiltIn)
                            .put("packageEntry", packageEntriesById[item.id] ?: ""))
                    }
                    val total = files.sumOf { it.first.length() }
                    require(total <= MAX_CLOUD_BACKUP_BYTES) {
                        "Die XPI-Dateien sind zusammen größer als 45 MB. Entferne nicht benötigte Downloads und versuche es erneut."
                    }
                    val profile = JSONObject()
                        .put("format", "schleim-browser-profile")
                        .put("schemaVersion", 1)
                        .put("exportedAt", java.time.Instant.now().toString())
                        .put("ownerLogin", cloudSync.currentAccount()?.login ?: "")
                        .put("preferences", preferences)
                        .put("passwords", passwords)
                        .put("addons", addonMetadata)
                    val buffer = ByteArrayOutputStream()
                    ZipOutputStream(buffer).use { zip ->
                        zip.putNextEntry(ZipEntry("profile.json"))
                        zip.write((profile.toString(2) + "\n").toByteArray(Charsets.UTF_8))
                        zip.closeEntry()
                        files.forEach { (file, entryName) ->
                            if (isGuestMode) throw IllegalStateException("Gastmodus wurde während der Sicherung aktiviert.")
                            zip.putNextEntry(ZipEntry(entryName))
                            file.inputStream().use { input -> input.copyTo(zip) }
                            zip.closeEntry()
                        }
                    }
                    require(buffer.size() <= MAX_CLOUD_BACKUP_BYTES) {
                        "Das komprimierte Browser-Profil überschreitet die maximale Größe für GitHub-Backups."
                    }
                    require(!isGuestMode) { "Gastmodus wurde vor dem Cloud-Upload aktiviert." }
                    val encrypted = SecureProfileStore.encryptBackup(buffer.toByteArray(), passphrase)
                    require(!isGuestMode) { "Gastmodus wurde vor dem Cloud-Upload aktiviert." }
                    cloudSync.uploadEncryptedBackup(encrypted)
                    runOnUiThread {
                        finishCloudBackup()
                        if (!isFinishing && !isDestroyed && !isGuestMode && !automatic) {
                            showToast("Verschlüsseltes Browser-Profil erfolgreich in das private Repository gesichert.")
                        }
                    }
                } catch (error: Exception) {
                    runOnUiThread {
                        finishCloudBackup()
                        if (!isFinishing && !isDestroyed && !automatic) {
                            showToast("Browser-Backup fehlgeschlagen: ${error.message ?: "Fehler"}")
                        } else if (automatic) {
                            Log.w(TAG, "Automatic browser profile backup failed", error)
                        }
                    }
                }
            }
        }, { error ->
            finishCloudBackup()
            if (!automatic) showToast("Add-ons konnten für das Backup nicht gelesen werden: ${error?.message ?: "Fehler"}")
        })
    }

    private fun readZipEntryBounded(input: ZipInputStream, remainingBytes: Long): ByteArray {
        require(remainingBytes >= 0) { "Die Sicherung überschreitet die maximale entpackte Größe." }
        val output = ByteArrayOutputStream()
        val chunk = ByteArray(16 * 1024)
        while (true) {
            val count = input.read(chunk)
            if (count < 0) break
            require(output.size().toLong() + count <= remainingBytes) {
                "Die Sicherung überschreitet die maximale entpackte Größe."
            }
            output.write(chunk, 0, count)
        }
        return output.toByteArray()
    }

    private fun startProfileRestore(passphrase: String) {
        if (isGuestMode || !cloudSync.hasSession()) return
        showToast("Verschlüsselte Browser-Sicherung wird geladen …")
        ioExecutor.execute {
            try {
                val envelope = cloudSync.downloadEncryptedBackup()
                val zipBytes = SecureProfileStore.decryptBackup(envelope, passphrase)
                require(zipBytes.size <= MAX_CLOUD_BACKUP_BYTES) { "Die Sicherung ist größer als erlaubt." }
                var profile: JSONObject? = null
                val restoredFiles = mutableListOf<Pair<String, ByteArray>>()
                var expandedBytes = 0L
                ZipInputStream(ByteArrayInputStream(zipBytes)).use { zip ->
                    var entry = zip.nextEntry
                    while (entry != null) {
                        val name = entry.name
                        require(!name.startsWith("/") && !name.contains("..") && !name.contains("\\")) {
                            "Die Sicherungsdatei enthält einen ungültigen Dateipfad."
                        }
                        val data = readZipEntryBounded(zip, MAX_CLOUD_BACKUP_BYTES - expandedBytes)
                        expandedBytes += data.size
                        if (name == "profile.json") {
                            profile = JSONObject(String(data, Charsets.UTF_8))
                        } else if (name.startsWith("extensions/") && name.endsWith(".xpi", true)) {
                            restoredFiles.add(name to data)
                        }
                        zip.closeEntry()
                        entry = zip.nextEntry
                    }
                }
                val snapshot = profile ?: throw IllegalStateException("Die Sicherung enthält keine Profildaten.")
                require(snapshot.optString("format") == "schleim-browser-profile" && snapshot.optInt("schemaVersion") == 1) {
                    "Das Browser-Backup hat ein unbekanntes Format."
                }
                val loggedIn = cloudSync.currentAccount()?.login.orEmpty()
                require(loggedIn.isNotBlank() && snapshot.optString("ownerLogin") == loggedIn) {
                    "Die Sicherung gehört nicht zum aktuell angemeldeten GitHub-Konto."
                }
                runOnUiThread {
                    if (isFinishing || isDestroyed || isGuestMode) return@runOnUiThread
                    val prefs = getSharedPreferences(PREFERENCES, MODE_PRIVATE)
                    val editor = prefs.edit()
                    val storedPreferences = snapshot.optJSONObject("preferences") ?: JSONObject()
                    val keys = storedPreferences.keys()
                    while (keys.hasNext()) {
                        val key = keys.next()
                        if (key == KEY_AUTO_BACKUP) continue
                        when (val value = storedPreferences.opt(key)) {
                            is String -> editor.putString(key, value)
                            is Boolean -> editor.putBoolean(key, value)
                            is Int -> editor.putInt(key, value)
                            is Long -> editor.putLong(key, value)
                            is Double -> editor.putFloat(key, value.toFloat())
                        }
                    }
                    editor.putBoolean(KEY_AUTO_BACKUP, false).apply()
                    secureProfileStore.putString(KEY_PASSWORDS, snapshot.optJSONArray("passwords")?.toString() ?: "[]")
                    secureProfileStore.putString(KEY_CLOUD_PASSPHRASE, passphrase)
                    val extensionDirectory = File(filesDir, "extension-packages").apply { mkdirs() }
                    val downloadDirectory = downloadsDirectory()
                    val restoredPackageFiles = mutableMapOf<String, File>()
                    restoredFiles.forEach { (name, bytes) ->
                        val fileName = name.substringAfterLast('/').replace(Regex("[^A-Za-z0-9._-]"), "_")
                        val folder = if (name.startsWith("extensions/downloads/")) downloadDirectory else extensionDirectory
                        val destination = File(folder, fileName)
                        FileOutputStream(destination).use { it.write(bytes) }
                        restoredPackageFiles[name] = destination
                    }
                    desktopMode = prefs.getBoolean(KEY_DESKTOP_MODE, false)
                    closeAllBrowserTabs()
                    restoreOpenTabs(null)
                    restoreBrowserAddons(snapshot.optJSONArray("addons") ?: JSONArray(), restoredPackageFiles)
                    showToast("Browser-Profil wiederhergestellt. Einstellungen, Verlauf, Tabs, Lesezeichen und Passwörter wurden übernommen; gespeicherte Add-ons werden jetzt wiederhergestellt.")
                }
            } catch (error: Exception) {
                runOnUiThread {
                    if (!isFinishing && !isDestroyed) showToast("Wiederherstellung fehlgeschlagen: ${error.message ?: "Fehler"}")
                }
            }
        }
    }

    private fun restoreBrowserAddons(addons: JSONArray, packageFiles: Map<String, File>) {
        val desired = mutableListOf<JSONObject>()
        for (index in 0 until addons.length()) {
            val item = addons.optJSONObject(index) ?: continue
            if (!item.optBoolean("builtIn", false)) desired.add(item)
        }
        val controller = runtime.getWebExtensionController()
        controller.list().accept({ current ->
            val byId = (current ?: emptyList()).associateBy { it.id }.toMutableMap()
            runOnUiThread {
                val wantedIds = desired.map { it.optString("id") }.toSet()
                val extras = (current ?: emptyList()).filter { !it.isBuiltIn && it.id !in wantedIds }
                fun removeExtras(index: Int, afterRemoval: () -> Unit) {
                    if (index >= extras.size || isFinishing || isDestroyed || isGuestMode) {
                        afterRemoval()
                        return
                    }
                    controller.uninstall(extras[index]).accept({
                        removeExtras(index + 1, afterRemoval)
                    }, { error ->
                        Log.w(TAG, "Could not remove add-on not present in backup: ${extras[index].id}", error)
                        removeExtras(index + 1, afterRemoval)
                    })
                }
                fun next(index: Int) {
                    if (index >= desired.size || isFinishing || isDestroyed || isGuestMode) return
                    val target = desired[index]
                    val id = target.optString("id")
                    val wantedEnabled = target.optBoolean("enabled", true)
                    val existing = byId[id]
                    fun applyEnabledState(extension: WebExtension) {
                        val operation = when {
                            wantedEnabled && !extension.metaData.enabled ->
                                controller.enable(extension, WebExtensionController.EnableSource.USER)
                            !wantedEnabled && extension.metaData.enabled ->
                                controller.disable(extension, WebExtensionController.EnableSource.USER)
                            else -> null
                        }
                        if (operation == null) {
                            next(index + 1)
                        } else {
                            operation.accept({ next(index + 1) }, { error ->
                                Log.w(TAG, "Could not restore add-on state for $id", error)
                                next(index + 1)
                            })
                        }
                    }

                    if (existing != null) {
                        applyEnabledState(existing)
                    } else {
                        val packageFile = packageFiles[target.optString("packageEntry")]
                        if (packageFile == null || !packageFile.isFile) {
                            Log.w(TAG, "No backed-up XPI package available for add-on $id")
                            next(index + 1)
                        } else {
                            controller.install(
                                Uri.fromFile(packageFile).toString(),
                                WebExtensionController.INSTALLATION_METHOD_FROM_FILE
                            ).accept({ installed ->
                                if (installed != null) {
                                    byId[installed.id] = installed
                                    applyEnabledState(installed)
                                } else {
                                    Log.w(TAG, "Add-on restore returned no extension for $id")
                                    next(index + 1)
                                }
                            }, { error ->
                                Log.w(TAG, "Could not reinstall add-on $id", error)
                                next(index + 1)
                            })
                        }
                    }
                }
                removeExtras(0) { if (desired.isNotEmpty()) next(0) }
            }
        }, { error ->
            Log.w(TAG, "Could not list add-ons before profile restore", error)
            showToast("Die Browser-Daten wurden wiederhergestellt; Add-ons konnten nicht automatisch abgeglichen werden.")
        })
    }

    private fun showSettingsDialog() {
        if (isGuestMode) { showToast("Einstellungen sind im Gastmodus nicht verfügbar."); return }
        val parts = createDialogShell("Einstellungen", "Browser- und Android-Funktionen.")
        parts.body.addView(createInfoRow(
            "Sichere DNS-Verbindung",
            "Der Browser verwendet einen fest eingestellten DNS-Server über HTTPS. Diese Einstellung kann nicht geändert werden."
        ), LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT).apply {
            bottomMargin = dp(7)
        })
        parts.body.addView(createMenuTile("☁️", "Schleim-Konto", "GitHub-Anmeldung, Profil-Backup und Synchronisierung") {
            parts.dialog.dismiss()
            showAccountDialog()
        }, LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(78)).apply {
            bottomMargin = dp(7)
        })
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
        }, LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(78)).apply { bottomMargin = dp(7) })
        parts.body.addView(createMenuTile("⬆", "Nach Updates suchen", "GitHub-Release auf eine neuere App-Version prüfen") {
            parts.dialog.dismiss()
            checkForAppUpdates(showNoUpdate = true)
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
        if (isGuestMode) { showToast("Downloads sind im Gastmodus deaktiviert."); return }
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
        if (isGuestMode) {
            response.body?.close()
            runOnUiThread { showToast("Downloads sind im Gastmodus deaktiviert.") }
            return
        }
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
                runOnUiThread {
                    showToast("Download abgeschlossen: " + file.name)
                    if (file.extension.equals("xpi", true)) scheduleAutomaticBackup()
                }
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

    private fun extensionOpenUrl(item: WebExtension): String? {
        val metadata = item.metaData
        if (!metadata.enabled && !item.isBuiltIn) return null

        val optionsPage = metadata.optionsPageUrl?.trim().orEmpty()
        if (optionsPage.isNotBlank()) {
            return if (Uri.parse(optionsPage).scheme.isNullOrBlank()) {
                metadata.baseUrl.trimEnd('/') + "/" + optionsPage.trimStart('/')
            } else {
                optionsPage
            }
        }

        val homepage = metadata.homepageUrl?.trim().orEmpty()
        if (homepage.startsWith("https://", true) ||
            homepage.startsWith("http://", true) ||
            homepage.startsWith("moz-extension://", true)
        ) return homepage

        return if (item.id == EXTENSION_ID) extensionHomeUrl else null
    }

    private fun showExtensionsDialog() {
        if (isGuestMode) { showToast("Add-ons können im Gastmodus nicht verwaltet werden."); return }
        val parts = createDialogShell("Erweiterungen", "Installierte GeckoView-Add-ons verwalten und kompatible Erweiterungen hinzufügen.")
        parts.body.addView(makeWideActionButton("＋  XPI-Datei installieren") {
            pickExtensionFile()
        }, LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(42)).apply {
            bottomMargin = dp(7)
        })
        parts.body.addView(makeWideActionButton("Mozilla Firefox Add-ons öffnen") {
            parts.dialog.dismiss()
            load("https://addons.mozilla.org/firefox/")
        }, LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(42)).apply {
            bottomMargin = dp(9)
        })
        parts.body.addView(dialogMessage(
            "Mozilla Add-ons (AMO) ist der offizielle Katalog für Firefox-Erweiterungen. Suche nach kompatiblen Add-ons und lade bei Bedarf eine von Mozilla signierte XPI-Datei herunter. Installiere sie anschließend über „XPI-Datei installieren“. Nicht jede Firefox-Erweiterung ist mit GeckoView kompatibel."
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
                        val openPage = extensionOpenUrl(item)
                        val actions = LinearLayout(this).apply {
                            orientation = LinearLayout.HORIZONTAL
                        }
                        if (!openPage.isNullOrBlank()) {
                            actions.addView(makeTextButton("Öffnen") {
                                parts.dialog.dismiss()
                                createTab(openPage)
                            }, LinearLayout.LayoutParams(0, dp(34), 1f).apply { marginEnd = dp(6) })
                        }
                        if (!item.isBuiltIn) {
                            actions.addView(makeTextButton(if (item.metaData.enabled) "Deaktivieren" else "Aktivieren") {
                                val operation = if (item.metaData.enabled) {
                                    runtime.getWebExtensionController().disable(item, WebExtensionController.EnableSource.USER)
                                } else {
                                    runtime.getWebExtensionController().enable(item, WebExtensionController.EnableSource.USER)
                                }
                                operation.accept({
                                    scheduleAutomaticBackup()
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
                                            scheduleAutomaticBackup()
                                            showToast("Erweiterung entfernt.")
                                            showExtensionsDialog()
                                        }, { error ->
                                            showToast("Entfernen fehlgeschlagen: " + (error?.message ?: "Fehler"))
                                        })
                                        parts.dialog.dismiss()
                                    }
                                    .show()
                            }, LinearLayout.LayoutParams(0, dp(34), 1f))
                        }
                        if (actions.childCount > 0) row.addView(actions)
                        if (item.isBuiltIn) {
                            row.addView(TextView(this).apply {
                                text = if (openPage != null) {
                                    "Integrierte Erweiterung des Browsers."
                                } else {
                                    "Diese integrierte Erweiterung stellt keine eigene Öffnungsseite bereit."
                                }
                                textSize = 8f
                                setTextColor(textMuted)
                            })
                        } else if (!item.metaData.enabled) {
                            row.addView(TextView(this).apply {
                                text = "Aktiviere die Erweiterung, um ihre Optionsseite zu öffnen."
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
        if (isGuestMode) { showToast("Add-ons können im Gastmodus nicht installiert werden."); return }
        showToast("XPI-Datei wird vorbereitet …")
        // Content providers (cloud drives, file managers, USB storage) may take
        // seconds to answer metadata queries. Never query them on the UI thread.
        ioExecutor.execute {
            try {
                val name = displayNameForUri(uri) ?: "extension.xpi"
                if (!name.endsWith(".xpi", true)) {
                    runOnUiThread {
                        if (!isFinishing && !isDestroyed) {
                            showToast("Bitte eine Mozilla-signierte .xpi-Datei auswählen. ZIP- und CRX-Dateien werden nicht unterstützt.")
                        }
                    }
                    return@execute
                }
                val safeName = name.replace(Regex("[^A-Za-z0-9._-]"), "_")
                val destination = File(File(filesDir, "extension-packages"), safeName)
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
        if (isGuestMode) { showToast("Add-ons können im Gastmodus nicht installiert werden."); return }
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
                    scheduleAutomaticBackup()
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


    private fun checkForAppUpdates(showNoUpdate: Boolean = false) {
        ioExecutor.execute {
            try {
                val api = URL("https://api.github.com/repos/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest")
                val connection = (api.openConnection() as HttpURLConnection).apply {
                    connectTimeout = 12000
                    readTimeout = 12000
                    requestMethod = "GET"
                    setRequestProperty("Accept", "application/vnd.github+json")
                    setRequestProperty("User-Agent", "Schleim-Browser-Android")
                }
                val release = try {
                    if (connection.responseCode !in 200..299) throw IllegalStateException("GitHub HTTP ${connection.responseCode}")
                    connection.inputStream.bufferedReader(Charsets.UTF_8).use { JSONObject(it.readText()) }
                } finally {
                    connection.disconnect()
                }
                val assets = release.optJSONArray("assets") ?: throw IllegalStateException("Release enthält keine Dateien.")
                var metadataUrl: String? = null
                for (index in 0 until assets.length()) {
                    val asset = assets.optJSONObject(index) ?: continue
                    if (asset.optString("name") == UPDATE_METADATA_ASSET) {
                        metadataUrl = asset.optString("browser_download_url").takeIf { it.startsWith("https://") }
                        break
                    }
                }
                if (metadataUrl == null) throw IllegalStateException("Update-Informationen fehlen im GitHub-Release.")
                val metadataConnection = (URL(metadataUrl).openConnection() as HttpURLConnection).apply {
                    connectTimeout = 12000
                    readTimeout = 12000
                    setRequestProperty("User-Agent", "Schleim-Browser-Android")
                }
                val metadata = try {
                    if (metadataConnection.responseCode !in 200..299) throw IllegalStateException("Update-Metadaten konnten nicht geladen werden.")
                    metadataConnection.inputStream.bufferedReader(Charsets.UTF_8).use { JSONObject(it.readText()) }
                } finally {
                    metadataConnection.disconnect()
                }
                if (metadata.optString("packageName") != packageName) {
                    throw IllegalStateException("Das GitHub-Update gehört zu einer anderen App.")
                }
                val update = AppUpdate(
                    metadata.optInt("versionCode", 0),
                    metadata.optString("versionName"),
                    metadata.optString("apkUrl"),
                    metadata.optString("sha256")
                )
                if (update.versionCode <= packageManager.getPackageInfo(packageName, 0).versionCode) {
                    if (showNoUpdate) runOnUiThread { if (!isFinishing && !isDestroyed) showToast("Schleim Browser ist bereits auf dem neuesten Stand.") }
                    return@execute
                }
                if (!update.apkUrl.startsWith("https://") || !update.sha256.matches(Regex("^[a-fA-F0-9]{64}$"))) {
                    throw IllegalStateException("Die Update-Datei ist unvollständig oder ungültig.")
                }
                runOnUiThread {
                    if (!isFinishing && !isDestroyed) showUpdateDialog(update)
                }
            } catch (error: Exception) {
                Log.w(TAG, "App update check failed", error)
                if (showNoUpdate) runOnUiThread {
                    if (!isFinishing && !isDestroyed) showToast("Update-Prüfung fehlgeschlagen: ${error.message ?: "Netzwerkfehler"}")
                }
            }
        }
    }

    private fun showUpdateDialog(update: AppUpdate) {
        if (isFinishing || isDestroyed) return
        AlertDialog.Builder(this)
            .setTitle("Schleim Browser – Update verfügbar")
            .setMessage(
                "Version ${update.versionName} ist verfügbar. Diese Ausgabe wird mit dem normalen Android-Debug-Schlüssel signiert. " +
                    "Ein direktes Aktualisieren ist deshalb nicht möglich. Lade zuerst die APK herunter, deinstalliere danach die bisherige App " +
                    "und installiere die neue APK aus deinem Download-Ordner. Bei der Deinstallation können lokale App-Daten verloren gehen."
            )
            .setNegativeButton("Später", null)
            .setNeutralButton("Alte App deinstallieren") { _, _ -> requestAppUninstall() }
            .setPositiveButton("APK herunterladen") { _, _ -> openUpdateDownload(update) }
            .show()
    }

    private fun openUpdateDownload(update: AppUpdate) {
        try {
            startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(update.apkUrl)))
        } catch (error: Exception) {
            showToast("Der APK-Download konnte nicht geöffnet werden: ${error.message ?: "Fehler"}")
        }
    }

    private fun requestAppUninstall() {
        try {
            startActivity(Intent(Intent.ACTION_DELETE, Uri.parse("package:$packageName")))
        } catch (error: Exception) {
            showToast("Die Android-Deinstallation konnte nicht geöffnet werden: ${error.message ?: "Fehler"}")
        }
    }

    private fun downloadAndInstallUpdate(update: AppUpdate) {
        showToast("Schleim Browser-Update wird heruntergeladen …")
        ioExecutor.execute {
            var connection: HttpURLConnection? = null
            try {
                connection = (URL(update.apkUrl).openConnection() as HttpURLConnection).apply {
                    connectTimeout = 20000
                    readTimeout = 30000
                    instanceFollowRedirects = true
                    setRequestProperty("User-Agent", "Schleim-Browser-Android")
                }
                if (connection.responseCode !in 200..299) throw IllegalStateException("Download fehlgeschlagen (HTTP ${connection.responseCode}).")
                val file = File(downloadsDirectory(), "Schleim-Browser-${update.versionName}.apk")
                val digest = MessageDigest.getInstance("SHA-256")
                connection.inputStream.use { input ->
                    FileOutputStream(file).use { output ->
                        val buffer = ByteArray(32 * 1024)
                        while (true) {
                            val count = input.read(buffer)
                            if (count < 0) break
                            digest.update(buffer, 0, count)
                            output.write(buffer, 0, count)
                        }
                        output.flush()
                    }
                }
                val actualHash = digest.digest().joinToString("") { "%02x".format(it) }
                if (!actualHash.equals(update.sha256, ignoreCase = true)) {
                    file.delete()
                    throw SecurityException("Die SHA-256-Prüfung der APK ist fehlgeschlagen.")
                }
                runOnUiThread {
                    if (!isFinishing && !isDestroyed) {
                        pendingUpdateApk = file
                        installDownloadedUpdate(file)
                    }
                }
            } catch (error: Exception) {
                Log.e(TAG, "App update download failed", error)
                runOnUiThread {
                    if (!isFinishing && !isDestroyed) showToast("Update konnte nicht installiert werden: ${error.message ?: "Unbekannter Fehler"}")
                }
            } finally {
                connection?.disconnect()
            }
        }
    }

    private fun installDownloadedUpdate(file: File) {
        if (!file.isFile || !file.name.endsWith(".apk", true)) {
            pendingUpdateApk = null
            showToast("Die heruntergeladene Update-Datei wurde nicht gefunden.")
            return
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && !packageManager.canRequestPackageInstalls()) {
            try {
                startActivity(Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES, Uri.parse("package:$packageName")))
                showToast("Erlaube Schleim Browser die Installation aus dieser Quelle. Danach wird der Installer geöffnet.")
            } catch (error: Exception) {
                showToast("Android-Einstellung konnte nicht geöffnet werden: ${error.message ?: "Fehler"}")
            }
            return
        }
        try {
            val apkUri = FileProvider.getUriForFile(this, packageName + ".fileprovider", file)
            val installIntent = Intent(Intent.ACTION_VIEW).setDataAndType(apkUri, "application/vnd.android.package-archive")
                .addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION or Intent.FLAG_ACTIVITY_NEW_TASK)
            pendingUpdateApk = null
            startActivity(installIntent)
        } catch (error: Exception) {
            pendingUpdateApk = file
            showToast("Android-Installer konnte nicht geöffnet werden: ${error.message ?: "Fehler"}")
        }
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
        pendingUpdateApk?.takeIf { it.isFile }?.let { file ->
            if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O || packageManager.canRequestPackageInstalls()) {
                installDownloadedUpdate(file)
            }
        }
    }

    override fun onPause() {
        if (!isGuestMode) saveOpenTabs()
        if (pendingVaultUnlock == null) {
            passwordVaultUnlocked = false
            passwordManagerDialog?.dismiss()
            passwordManagerDialog = null
        }
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
        if (requestCode == REQUEST_VAULT_UNLOCK) {
            val callback = pendingVaultUnlock
            val cancelled = pendingVaultCancelled
            pendingVaultUnlock = null
            pendingVaultCancelled = null
            if (resultCode == RESULT_OK) {
                passwordVaultUnlocked = true
                callback?.invoke()
            } else {
                passwordVaultUnlocked = false
                cancelled?.invoke()
                showToast("Passwort-Manager wurde nicht entsperrt.")
            }
            return
        }
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
        if (!isGuestMode) saveOpenTabs()
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
        downloadExecutor.shutdownNow()
        ioExecutor.shutdownNow()
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
        private const val REQUEST_VAULT_UNLOCK = 1507
        private const val EXTRA_OPEN_APP = "schleim_os_open_app"
        private const val PREFERENCES = "schleim_os_browser_settings"
        private const val KEY_DESKTOP_MODE = "desktop_mode"
        private const val KEY_SAVED_TABS = "saved_open_tabs"
        private const val KEY_ACTIVE_TAB = "saved_active_tab"
        private const val KEY_HISTORY = "browser_history"
        private const val KEY_BOOKMARKS = "browser_bookmarks"
        private const val KEY_PASSWORD_AUTOFILL = "password_autofill_enabled"
        private const val KEY_AUTO_BACKUP = "profile_auto_backup"
        private const val KEY_ONBOARDING_DONE = "onboarding_done_v1"
        private const val KEY_ACCOUNT_INSTALL_STARTED = "account_install_started_v1"
        private const val KEY_CLOUD_PASSPHRASE = "profile_backup_passphrase_v1"
        private const val KEY_PASSWORDS = "password_vault_entries_v1"
        private const val MAX_HISTORY_ROWS = 250
        private const val MAX_OPEN_TABS = 4
        private const val MAX_CLOUD_BACKUP_BYTES = 45L * 1024L * 1024L
        private const val PRIMARY_DNS_URL = "https://dns.nextdns.io/36e7f3/Schleim-Browser"
        private const val GITHUB_APP_INSTALL_URL = "https://github.com/apps/schleim-os-account"
        private const val MAX_DOWNLOAD_ROWS = 100
        private const val UPDATE_METADATA_ASSET = "Schleim-Browser-Android-update.json"
    }
}
