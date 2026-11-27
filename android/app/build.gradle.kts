plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "de.schneckeschneck.schleimos"
    compileSdk {
        version = release(36) {
            minorApiLevel = 1
        }
    }

    defaultConfig {
        applicationId = "de.schneckeschneck.schleimbrowser"
        minSdk = 26
        targetSdk = 35
        versionCode = 31
        versionName = "0.1.0-alpha31"
        // One universal APK includes all four GeckoView Android ABIs.
        // Devices install/use only the native libraries matching their CPU.
        ndk {
            abiFilters += listOf("armeabi-v7a", "arm64-v8a", "x86", "x86_64")
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlin {
        compilerOptions {
            jvmTarget.set(org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_17)
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            // Deliberately use Gradle's standard debug key for release APKs.
            // GitHub-hosted runners may generate a new key per build, so users
            // must uninstall the previous app before installing a new APK.
            signingConfig = signingConfigs.getByName("debug")
        }
    }
}

/*
 * Use the repository's supplied Schleim Browser PNG as the actual Android
 * launcher icon. Keeping this in Gradle also makes local builds use the same
 * source image as GitHub Actions.
 */
val prepareLauncherIcon by tasks.registering {
    val sourceIcon = file("src/main/file_00000000f7dc8210993324a486df07ef.png")
    val targetIcon = file("src/main/res/mipmap-xxxhdpi/ic_launcher.png")
    val oldIcon = file("src/main/res/mipmap-xxxhdpi/ic_launcher.webp")

    inputs.file(sourceIcon)
    outputs.file(targetIcon)

    doLast {
        check(sourceIcon.isFile) {
            "The supplied Schleim Browser launcher PNG is missing: ${sourceIcon.path}"
        }
        val header = sourceIcon.inputStream().use { input -> ByteArray(24).also { check(input.read(it) == it.size) } }
        check(
            header[0] == 0x89.toByte() &&
                header[1] == 0x50.toByte() &&
                header[2] == 0x4E.toByte() &&
                header[3] == 0x47.toByte()
        ) {
            "The supplied launcher image is not a valid PNG."
        }
        targetIcon.parentFile.mkdirs()
        sourceIcon.copyTo(targetIcon, overwrite = true)
        oldIcon.delete()
        println("Schleim Browser launcher icon copied from the supplied repository PNG.")
    }
}

tasks.named("preBuild").configure {
    dependsOn(prepareLauncherIcon)
}

dependencies {
    implementation("androidx.core:core-ktx:1.15.0")
    implementation("org.mozilla.geckoview:geckoview:${providers.gradleProperty("geckoviewVersion").get()}")
}
