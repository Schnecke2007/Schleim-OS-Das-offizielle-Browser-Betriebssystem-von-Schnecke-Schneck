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
- An ARM64 device for the preconfigured ABI output

## Build the project

1. Open Android Studio and select **Open**.
2. Select the extracted **Android-App Template** folder.
3. Run Gradle Sync.
4. Build a test APK through **Build → Build Bundle(s) / APK(s) → Build APK(s)**.
5. Configure your own persistent signing key before publishing.

The template contains no private keys, tokens or credentials. Never put secrets directly in source code or a public repository.

## Technical note

The template is based on a GeckoView browser with a bundled WebExtension. Customize the example Extension before first use. Android camera and microphone capture are not enabled by default in the included Android browser logic.

[Deutsche Anleitung](README.md) · [Nederlandse handleiding](README.nl.md) · [Android browser documentation](../docs/Englisch/ANDROID-BROWSER.md)
