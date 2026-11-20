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
        applicationId = "de.schneckeschneck.schleimos"
        minSdk = 26
        targetSdk = 35
        versionCode = 11
        versionName = "0.1.0-alpha11"
        // The current Android target is ARM64; avoid bundling unused x86/32-bit GeckoView binaries.
        ndk {
            abiFilters += listOf("arm64-v8a")
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
        debug { applicationIdSuffix = ".debug" }
        release {
            isMinifyEnabled = false
            // Release signing is intentionally not configured until a private,
            // persistent keystore is supplied through GitHub Actions secrets.
        }
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.15.0")
    implementation("androidx.activity:activity:1.13.0")
    implementation("androidx.camera:camera-camera2:1.7.0")
    implementation("androidx.camera:camera-lifecycle:1.7.0")
    implementation("androidx.camera:camera-view:1.7.0")
    implementation("androidx.camera:camera-video:1.7.0")
    implementation("org.mozilla.geckoview:geckoview:${providers.gradleProperty("geckoviewVersion").get()}")
}
