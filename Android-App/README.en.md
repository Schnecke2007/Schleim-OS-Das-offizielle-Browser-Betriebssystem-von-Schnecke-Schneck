# Android App – Android Studio template

This folder contains the instructions and generator for the neutral Android Studio project. The complete ZIP package is produced during the main Schleim OS release from the current Android project and Extension.

## Download

The latest GitHub Release provides **Schleim-Browser-Android-Studio-Template.zip**. Extract the archive and open the contained project folder **Android-App Template** in Android Studio.

## Placeholders and customization

The template is separate from the production Schleim Browser. Inside the template, personal and project-specific details are replaced with neutral values, including the app name, application ID, GitHub repository, website, contact details and extension ID. The production app and the regular Extension outside this template folder are not changed by these substitutions.

Before building your own version, customize at least:

1. app/build.gradle.kts: namespace, applicationId and version.
2. app/src/main/AndroidManifest.xml: app name and required permissions.
3. app/src/main/java/com/example/yourbrowser/: package declaration and Android logic.
4. app/src/main/assets/extension/: your own WebExtension and its manifest.
5. GitHub, website and contact placeholders in the Extension files.
6. App icon and signing configuration for your own release.

## Requirements

- Android Studio with Android SDK Platform 36
- JDK 17
- Gradle 8.13 / Android Gradle Plugin 8.13.2
- Kotlin Gradle Plugin 2.3.0
- Internet access to download GeckoView and Android dependencies
- An ARMv7, ARM64 or x86_64 device; 32-bit x86 is not supported

## Build the project

1. Open Android Studio and select **Open**.
2. Select the extracted **Android-App Template** folder.
3. Run Gradle Sync.
4. Build a test APK through **Build → Build Bundle(s) / APK(s) → Build APK(s)**.
5. Configure your own persistent signing key before publishing.

The template contains no private keys, tokens or credentials. Never put secrets directly in source code or a public repository.

The ZIP includes the Gradle 8.13 wrapper, so no system-wide Gradle installation is required for the template. The Android launcher icon and Extension icons are neutral placeholders and should be replaced before publishing your own app.

## Technical note

The template is based on a GeckoView browser with a bundled WebExtension. Customize the example Extension before first use. Android camera and microphone capture are not enabled by default in the included Android browser logic.

[Deutsche Anleitung](README.md) · [Nederlandse handleiding](README.nl.md) · [Android browser documentation](../docs/Englisch/ANDROID-BROWSER.md)


## VPN integration and universal APK

Schleim Browser integrates WireGuard directly into the Android browser menu. No separate VPN app is created. The original extension has a VPN entry that opens the native VPN panel through GeckoView native messaging.

Import your current personal WireGuard configuration (.conf) from your Proton account. Profiles are encrypted with Android Keystore (AES-GCM). The tunnel is restricted to Schleim Browser. The location list is fetched from the public repository catalog when the panel opens; Proton no longer reliably exposes its former public server-list endpoint. The catalog is therefore maintained in the repository, not live-discovered from Proton.

Public server files contain no private keys. Previously exposed keys should be regenerated with Proton. Old OpenVPN files have been removed.

The APK bundles ARMv7 (armeabi-v7a), ARM64 (arm64-v8a) and x86_64. 32-bit x86 is not supported by the pinned GeckoView version. Minimum Android version remains Android 8.0 / API 26.
