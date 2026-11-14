# Schleim-Store – English guide

The Schleim-Store is the app catalogue in Schleim OS. It contains websites and web apps that you can install as tiles on your home screen. Store apps open in a new browser tab.

## Access and sign-in

The Store inside the browser extension is available only when you are signed in with a **Schleim account**. Without sign-in, the catalogue, search, ratings, installation, removal and suggestions stay locked.

1. Open the Schleim-Store and select **Connect with GitHub**.
2. Schleim OS opens the [Schleim OS Account GitHub App page](https://github.com/apps/schleim-os-account).
3. Install the app for your GitHub account.
4. Return to Schleim OS and select **I installed the app – continue**.
5. Schleim OS displays a one-time device code. After a short delay, it attempts to copy the code to your clipboard.
6. The GitHub device authorization page then opens automatically. You can also copy the code manually and use the visible authorization link.
7. Enter the code on GitHub and approve **Schleim OS Account**.
8. After authorization, Schleim OS checks whether GitHub has detected the app installation. This check can take up to five minutes.

Schleim OS can query GitHub's installation list only after device authorization. If the app is not detected, make sure it is installed in the same GitHub account and start the flow again.

## Browse and install apps

- Use categories, recommendations or search to find apps.
- Select **Install** to add an app tile to the home screen.
- Select **Open** to open the website in a new browser tab.
- Select **Uninstall** to remove the Store tile from the home screen.

The catalogue currently contains 15 entries in nine categories:

| Category | Examples |
|---|---|
| AI & chatbots | ChatGPT, Claude |
| Communication | WhatsApp Web |
| Knowledge | Google, Wikipedia |
| Media | Deezer, Instagram, Spotify, TikTok, YouTube |
| Navigation | Google Maps |
| Search & privacy | DuckDuckGo |
| Productivity | Google Drive |
| Shopping & online stores | Amazon |
| Tools | NextDNS |

Browse the [public catalogue](../README.md) for category folders and individual app JSON files.

## Ratings and app suggestions

- The star buttons open a rating form on GitHub.
- You can add an optional feedback message.
- Your GitHub username, rating and feedback are publicly visible.
- GitHub Actions stores ratings as JSON and updates the displayed averages.
- App suggestions are submitted as GitHub issues and reviewed before publication. Suggestions do not appear automatically.

## Sign out and cloud backup

Signing out locks the Schleim-Store again. Store tiles are hidden from the home screen and appear again after the next sign-in. Custom websites added separately from the Store remain available.

**Cloud backup is not part of the Store.** It is available only under **Settings → Schleim account**. You can save or restore it manually there. Backup format 2 includes saved Schleim OS settings, home-screen app order, installed Store apps and the wallpaper. Changes are not synchronized automatically.

## Visibility and privacy

Files in this GitHub repository are public. Sign-in protects the Store interface inside Schleim OS; it does not make the GitHub catalogue private. Do not submit passwords, tokens or private information as app suggestions or feedback.

Further reading: [Schleim account and cloud backup](../../extension/docs/SCHLEIM-KONTO.md) · [Plain-language Store guide](../../docs/Leichte-Sprache/Englisch/SCHLEIM-STORE.md) · [German Store guide](../Deutsch/README.md) · [Nederlandse Store-handleiding](../Niederländisch/README.md)
