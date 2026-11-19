package de.schneckeschneck.schleimos

import android.app.Activity
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.role.RoleManager
import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.view.Gravity
import android.view.ViewGroup
import android.view.inputmethod.EditorInfo
import android.widget.Button
import android.widget.EditText
import android.widget.LinearLayout
import android.widget.TextView
import androidx.core.app.NotificationCompat
import org.mozilla.geckoview.GeckoRuntime
import org.mozilla.geckoview.GeckoSession
import org.mozilla.geckoview.GeckoView

class MainActivity : Activity() {
    private lateinit var geckoView: GeckoView
    private lateinit var session: GeckoSession
    private lateinit var address: EditText
    private var runtime: GeckoRuntime? = null
    private var homePageUrl: String? = null
    private var pendingExternalUrl: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        createNotificationChannel()
        buildBrowserUi()
        openBrowser(intent?.data?.toString())
        requestNotificationPermissionIfNeeded()
    }

    private fun buildBrowserUi() {
        val root = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setBackgroundColor(Color.rgb(37, 18, 5))
        }
        val toolbar = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
            setPadding(8, 8, 8, 8)
        }
        address = EditText(this).apply {
            hint = "Webadresse oder Suchbegriff"
            setSingleLine(true)
            setTextColor(Color.WHITE)
            setHintTextColor(Color.LTGRAY)
            setBackgroundColor(Color.rgb(75, 49, 31))
            imeOptions = EditorInfo.IME_ACTION_GO
            setOnEditorActionListener { _, action, _ ->
                if (action == EditorInfo.IME_ACTION_GO) { navigate(address.text.toString()); true } else false
            }
        }
        toolbar.addView(address, LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f))
        toolbar.addView(makeButton("Los") { navigate(address.text.toString()) })
        toolbar.addView(makeButton("⌂") { homePageUrl?.let { load(it) } })
        toolbar.addView(makeButton("↻") { session.reload() })
        root.addView(toolbar)
        geckoView = GeckoView(this)
        root.addView(geckoView, LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 0, 1f))
        val bottom = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER
            setPadding(6, 4, 6, 8)
        }
        bottom.addView(makeButton("Benachrichtigung testen") { showNotification("Schleim OS", "Android-Benachrichtigungen sind eingerichtet.") })
        bottom.addView(makeButton("Standardbrowser") { requestDefaultBrowserRole() })
        root.addView(bottom)
        setContentView(root)
    }

    private fun makeButton(label: String, action: () -> Unit) = Button(this).apply {
        text = label
        textSize = 11f
        setOnClickListener { action() }
    }

    private fun openBrowser(initialUrl: String?) {
        val geckoRuntime = runtime ?: GeckoRuntime.create(this).also { runtime = it }

        // Install the real Schleim OS extension from the APK assets. GeckoView
        // exposes extension pages through their moz-extension:// base URL,
        // not through Android WebView's file:///android_asset/ path.
        geckoRuntime.getWebExtensionController()
            .ensureBuiltIn(BUNDLED_EXTENSION_URI, EXTENSION_ID)
            .accept({ extension ->
                homePageUrl = extension.metaData.baseUrl + "pages/newtab.html"
                session = GeckoSession()
                session.open(geckoRuntime)
                geckoView.setSession(session)
                val destination = pendingExternalUrl ?: initialUrl ?: homePageUrl!!
                pendingExternalUrl = null
                load(destination)
            }, { error ->
                showNotification(
                    "Schleim OS konnte nicht starten",
                    error.message ?: "Die integrierte Schleim-OS-Erweiterung konnte nicht geladen werden."
                )
            })
    }

    private fun load(url: String) {
        val target = when {
            url.startsWith("moz-extension://") -> url
            url.startsWith("resource://") -> url
            url.startsWith("file://") -> url
            url.startsWith("https://") || url.startsWith("http://") -> url
            else -> normalizeUrl(url)
        }
        address.setText(target)
        session.loadUri(target)
    }

    private fun navigate(input: String) {
        val value = input.trim()
        if (value.isEmpty()) return
        val target = if (value.contains(" ") || (!value.contains(".") && !value.startsWith("http"))) {
            "https://www.google.com/search?q=" + Uri.encode(value)
        } else normalizeUrl(value)
        load(target)
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
            val channel = NotificationChannel(CHANNEL_ID, "Schleim OS", NotificationManager.IMPORTANCE_DEFAULT)
            getSystemService(NotificationManager::class.java).createNotificationChannel(channel)
        }
    }

    private fun requestNotificationPermissionIfNeeded() {
        if (Build.VERSION.SDK_INT >= 33 && checkSelfPermission(android.Manifest.permission.POST_NOTIFICATIONS) != android.content.pm.PackageManager.PERMISSION_GRANTED) {
            requestPermissions(arrayOf(android.Manifest.permission.POST_NOTIFICATIONS), REQUEST_NOTIFICATIONS)
        }
    }

    private fun showNotification(title: String, message: String) {
        val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        val openApp = PendingIntent.getActivity(this, 0, Intent(this, MainActivity::class.java), PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)
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
        intent.data?.toString()?.let {
            if (::session.isInitialized) load(it) else pendingExternalUrl = it
        }
    }

    override fun onDestroy() {
        if (::session.isInitialized) session.close()
        super.onDestroy()
    }

    companion object {
        private const val BUNDLED_EXTENSION_URI = "resource://android/assets/extension/"
        private const val EXTENSION_ID = "schleim-os-android@schneckeschneck.de"
        private const val CHANNEL_ID = "schleim_os_general"
        private const val NOTIFICATION_ID = 1501
        private const val REQUEST_NOTIFICATIONS = 1502
        private const val REQUEST_BROWSER_ROLE = 1503
    }
}
