# 🛠️ Schleim OS – Fehlerbehebung

Hier findest du Lösungen für häufige Probleme bei der Installation und Verwendung von Schleim OS.

| Problem | Mögliche Lösung |
|---|---|
| **Der neue Tab bleibt unverändert.** | Prüfe unter `chrome://extensions`, ob Schleim OS installiert und aktiviert ist. Öffne danach einen neuen Tab. |
| **Chrome meldet einen Manifestfehler.** | Entpacke das GitHub-ZIP vollständig und wähle den Ordner aus, in dem `manifest.json` direkt liegt. |
| **Eine ZIP-Datei wurde bei „Entpackte Erweiterung laden“ ausgewählt.** | Diese Funktion erwartet einen Ordner. Entpacke das ZIP zuerst und wähle dann den Erweiterungsordner aus. |
| **Der falsche Ordner wurde ausgewählt.** | Wähle nicht den übergeordneten Repository-Ordner, sondern den Ordner, in dem `manifest.json` direkt liegt. |
| **Eine andere Erweiterung ersetzt ebenfalls den neuen Tab.** | Deaktiviere testweise andere Erweiterungen, die ebenfalls die Neuer-Tab-Seite ersetzen. |
| **Änderungen werden nicht angezeigt.** | Öffne `chrome://extensions`, aktualisiere Schleim OS über die Schaltfläche **Aktualisieren** und öffne einen neuen Tab. |
| **Externe Inhalte fehlen oder bleiben leer.** | Prüfe deine Internetverbindung. Manche Anbieter blockieren die Einbettung ihrer Seiten in andere Websites. |
| **Die Einstellungen fehlen nach einem Browserwechsel.** | Die Personalisierung wird im jeweiligen Browserprofil gespeichert. Exportiere im alten Profil eine JSON-Sicherung und importiere sie im neuen Profil, sofern die Funktion verfügbar ist. |
| **Die Installation funktioniert auf Android nicht.** | Chrome für Android unterstützt keine regulären Desktop-Erweiterungen. Verwende dafür eine separate PWA oder einen Browser mit Erweiterungsunterstützung. |

## Weitere Hilfe

Wenn das Problem weiterhin besteht, melde es bitte über [GitHub Issues](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/issues). Beschreibe dabei möglichst genau, welchen Browser und welche Version du verwendest und welche Schritte zum Fehler führen. Teile keine Passwörter oder vertraulichen Zugangsdaten.

---

[🇬🇧 English troubleshooting](../Englisch/TROUBLESHOOTING.md) · [🇳🇱 Nederlandse probleemoplossing](../Niederländisch/PROBLEMEN-OPLOSSEN.md)
