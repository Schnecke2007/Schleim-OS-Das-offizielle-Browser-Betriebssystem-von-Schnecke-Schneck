#!/usr/bin/env python3
"""Create a privacy-scrubbed, self-contained Android Studio browser template."""
from __future__ import annotations

import argparse
import base64
import json
import re
import shutil
import struct
import zlib
from pathlib import Path

TEXT_SUFFIXES = {
    ".kt", ".kts", ".xml", ".json", ".html", ".js", ".css", ".md",
    ".properties", ".txt", ".svg", ".yml", ".yaml"
}

REPLACEMENTS = [
    ("Schleim-Browser-Android-Studio-Template.zip", "Android-Studio-Template.zip"),
    ("Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck",
     "YOUR_GITHUB_REPOSITORY"),
    ("schleim-os-android@schneckeschneck.de", "your-browser@example.com"),
    ("https://schnecke1.wixsite.com/schnecke-schneck", "https://example.com"),
    ("https://www.instagram.com/schnecke_schneck2007/", "https://example.com/social"),
    ("https://www.tiktok.com/@schnecke_schneck2007", "https://example.com/video"),
    ("https://wa.me/491773988636", "https://example.com/contact"),
    ("info.schnecke.schneck@gmail.com", "YOUR_CONTACT_EMAIL"),
    ("491773988636", "YOUR_WHATSAPP_NUMBER"),
    ("Schnecke Schneck", "YOUR_DEVELOPER_NAME"),
    ("Schnecke2007", "YOUR_GITHUB_OWNER"),
    ("Schleim Browser", "YOUR_BROWSER_NAME"),
    ("Schleim OS", "YOUR_PRODUCT_NAME"),
    ("Schleim-OS", "YOUR_PRODUCT_SLUG"),
    ("SchleimOS", "YourBrowser"),
    ("schnecke_schneck2007", "YOUR_SOCIAL_HANDLE"),
    ("schneckeschneck.de", "YOUR_DOMAIN"),
    ("Bottrop", "YOUR_CITY"),
    ("de.schneckeschneck.schleimos", "com.example.yourbrowser"),
    ("de.schneckeschneck.schleimbrowser", "com.example.yourbrowser"),
]

FORBIDDEN_MARKERS = (
    "Schnecke Schneck",
    "Schnecke2007",
    "schnecke1.wixsite.com",
    "info.schnecke.schneck@gmail.com",
    "491773988636",
    "schleim-os-android@schneckeschneck.de",
)

def png_rgba(width: int, height: int, color=(112, 82, 53, 255)) -> bytes:
    """Generate a simple placeholder PNG without third-party image libraries."""
    raw = b"".join(b"\x00" + bytes(color) * width for _ in range(height))
    def chunk(kind: bytes, payload: bytes) -> bytes:
        checksum = zlib.crc32(kind + payload) & 0xffffffff
        return struct.pack(">I", len(payload)) + kind + payload + struct.pack(">I", checksum)
    return (
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", struct.pack(">2I5B", width, height, 8, 6, 0, 0, 0))
        + chunk(b"IDAT", zlib.compress(raw, 9))
        + chunk(b"IEND", b"")
    )

def patch_text_files(root: Path) -> None:
    for file in root.rglob("*"):
        if not file.is_file() or file.suffix.lower() not in TEXT_SUFFIXES:
            continue
        try:
            value = file.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue
        for source, target in REPLACEMENTS:
            value = value.replace(source, target)
        file.write_text(value, encoding="utf-8")

def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--android", type=Path, required=True)
    parser.add_argument("--extension", type=Path, required=True)
    parser.add_argument("--docs", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()

    if args.output.exists():
        shutil.rmtree(args.output)
    args.output.mkdir(parents=True)

    project = args.output / "Android-App"
    shutil.copytree(
        args.android,
        project,
        ignore=shutil.ignore_patterns(".gradle", "build", "*.jks", "*.keystore", "local.properties")
    )

    # Bundle the actual GeckoView-compatible Extension source.
    extension_target = project / "app/src/main/assets/extension"
    if extension_target.exists():
        shutil.rmtree(extension_target)
    shutil.copytree(args.extension, extension_target)

    manifest_path = extension_target / "manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    manifest["browser_specific_settings"] = {"gecko": {"id": "your-browser@example.com"}}
    manifest["permissions"] = list(dict.fromkeys(
        manifest.get("permissions", []) + ["geckoViewAddons", "nativeMessaging"]
    ))
    background = manifest.get("background") or {}
    service_worker = background.pop("service_worker", None)
    if service_worker:
        background["scripts"] = [service_worker]
    if background:
        manifest["background"] = background
    manifest["permissions"] = [p for p in manifest.get("permissions", []) if p != "offscreen"]
    manifest.pop("minimum_chrome_version", None)
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    # Generalize Gradle coordinates and pin a usable GeckoView default.
    build_file = project / "app/build.gradle.kts"
    build_text = build_file.read_text(encoding="utf-8")
    build_text = build_text.replace(
        'providers.gradleProperty("geckoviewVersion").get()',
        'providers.gradleProperty("geckoviewVersion").orElse("153.0.20260810162159").get()'
    )
    build_text = re.sub(
        r'''/\*\s*Use the repository's supplied Schleim Browser PNG.*?tasks\.named\("preBuild"\)\.configure\s*\{\s*dependsOn\(prepareLauncherIcon\)\s*\}\s*''',
        "",
        build_text,
        flags=re.S
    )
    build_file.write_text(build_text, encoding="utf-8")

    # Move Kotlin sources to the neutral Java package.
    old_package = project / "app/src/main/java/de/schneckeschneck/schleimos"
    new_package = project / "app/src/main/java/com/example/yourbrowser"
    new_package.parent.mkdir(parents=True, exist_ok=True)
    if old_package.exists():
        shutil.move(str(old_package), str(new_package))
        shutil.rmtree(project / "app/src/main/java/de", ignore_errors=True)

    # Remove the original branded image and use a neutral adaptive placeholder icon.
    for candidate in project.glob("app/src/main/file_*.png"):
        candidate.unlink()
    for candidate in project.glob("app/src/main/res/mipmap-xxxhdpi/ic_launcher.*"):
        candidate.unlink()
    values = project / "app/src/main/res/values"
    values.mkdir(parents=True, exist_ok=True)
    (values / "colors.xml").write_text(
        '<?xml version="1.0" encoding="utf-8"?>\n'
        '<resources><color name="browser_icon_background">#705235</color></resources>\n',
        encoding="utf-8"
    )
    drawable = project / "app/src/main/res/drawable"
    drawable.mkdir(parents=True, exist_ok=True)
    (drawable / "browser_icon_foreground.xml").write_text(
        '<vector xmlns:android="http://schemas.android.com/apk/res/android"\n'
        '    android:width="108dp" android:height="108dp" android:viewportWidth="108" android:viewportHeight="108">\n'
        '    <path android:fillColor="#FFFFFFFF" android:pathData="M24,28h60a8,8 0,0 1,8 8v36a8,8 0,0 1,-8 8h-60a8,8 0,0 1,-8 -8v-36a8,8 0,0 1,8 -8z"/>\n'
        '    <path android:fillColor="#FF705235" android:pathData="M26,38h56v6h-56zM26,50h56v6h-56zM26,62h36v6h-36z"/>\n'
        '</vector>\n',
        encoding="utf-8"
    )
    adaptive = project / "app/src/main/res/mipmap-anydpi-v26"
    adaptive.mkdir(parents=True, exist_ok=True)
    icon_xml = (
        '<?xml version="1.0" encoding="utf-8"?>\n'
        '<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">\n'
        '    <background android:drawable="@color/browser_icon_background"/>\n'
        '    <foreground android:drawable="@drawable/browser_icon_foreground"/>\n'
        '</adaptive-icon>\n'
    )
    (adaptive / "ic_launcher.xml").write_text(icon_xml, encoding="utf-8")
    (adaptive / "ic_launcher_round.xml").write_text(icon_xml, encoding="utf-8")

    # Replace the Extension PNG marks with neutral generated placeholders.
    icons = extension_target / "assets/icons"
    icons.mkdir(parents=True, exist_ok=True)
    for size in (16, 48, 128, 192, 512):
        (icons / f"icon-{size}.png").write_bytes(png_rgba(size, size))

    # Replace embedded SVG snail marks in HTML with a neutral browser placeholder mark.
    neutral_svg = (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">'
        '<rect width="512" height="512" rx="112" fill="#705235"/>'
        '<path d="M96 132h320v248H96z" fill="#fff"/>'
        '<path d="M120 168h272v28H120zm0 64h272v28H120zm0 64h180v28H120z" fill="#705235"/>'
        '</svg>'
    )
    neutral_b64 = base64.b64encode(neutral_svg.encode("utf-8")).decode("ascii")
    for html in extension_target.rglob("*.html"):
        content = html.read_text(encoding="utf-8")
        content = re.sub(
            r"data:image/svg\+xml;base64,[A-Za-z0-9+/=]+",
            "data:image/svg+xml;base64," + neutral_b64,
            content
        )
        html.write_text(content, encoding="utf-8")

    # Apply all identity replacements only to this generated Android-App directory.
    patch_text_files(project)
    settings_file = project / "settings.gradle.kts"
    settings_text = settings_file.read_text(encoding="utf-8")
    settings_file.write_text(
        re.sub(r'(?m)^\s*rootProject\.name\s*=\s*"[^"]+"', 'rootProject.name = "YourBrowser"', settings_text),
        encoding="utf-8"
    )
    for name in ("README.md", "README.en.md", "README.nl.md"):
        shutil.copy2(args.docs / name, project / name)
        readme = project / name
        readme_text = readme.read_text(encoding="utf-8")
        # These repository guides are outside the exported project ZIP.
        # Keep the template README self-contained by turning those links into
        # an explicit URL placeholder the template owner can configure.
        readme_text = re.sub(
            r'\]\(\.\./docs/(?:Deutsch|Englisch|Niederländisch)/ANDROID-BROWSER\.md\)',
            '](https://example.com/docs/android-browser)',
            readme_text
        )
        readme.write_text(readme_text, encoding="utf-8")
    patch_text_files(project)

    # Keep a valid, neutral display name after replacing the production label.
    app_manifest = project / "app/src/main/AndroidManifest.xml"
    manifest_text = app_manifest.read_text(encoding="utf-8").replace(
        'android:label="YOUR_BROWSER_NAME"', 'android:label="Your Browser"'
    )
    app_manifest.write_text(manifest_text, encoding="utf-8")

    leftovers = []
    for file in project.rglob("*"):
        if not file.is_file() or file.suffix.lower() not in TEXT_SUFFIXES:
            continue
        try:
            value = file.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue
        for marker in FORBIDDEN_MARKERS:
            if marker.lower() in value.lower():
                leftovers.append(f"{file.relative_to(project)}: {marker}")
    if leftovers:
        raise SystemExit("Personal data remained in template:\n" + "\n".join(leftovers))

    assert (project / "app/src/main/assets/extension/pages/newtab.html").is_file()
    assert (project / "app/src/main/java/com/example/yourbrowser/MainActivity.kt").is_file()
    assert (project / "app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml").is_file()
    assert "com.example.yourbrowser" in build_file.read_text(encoding="utf-8")
    assert "prepareLauncherIcon" not in build_file.read_text(encoding="utf-8")
    assert 'rootProject.name = "YourBrowser"' in settings_file.read_text(encoding="utf-8")
    for name in ("README.md", "README.en.md", "README.nl.md"):
        readme_text = (project / name).read_text(encoding="utf-8")
        assert "../docs/" not in readme_text, f"Broken repository-only documentation link in {name}"
    print(f"Android Studio template prepared at {project}")

if __name__ == "__main__":
    main()
