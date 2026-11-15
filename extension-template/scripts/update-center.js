(() => {
  'use strict';

  const OWNER = 'YOUR_GITHUB_USERNAME';
  const REPOSITORY = 'YOUR_REPOSITORY_NAME';
  const RAW_MANIFEST_URL = `https://raw.githubusercontent.com/${OWNER}/${REPOSITORY}/main/manifest.json`;
  const ZIP_DOWNLOAD_URL = `https://github.com/${OWNER}/${REPOSITORY}/releases/latest/download/Browser-OS-Extension-Template.zip`;
  const DOCUMENTATION_URLS = {
    de: `https://github.com/${OWNER}/${REPOSITORY}/blob/main/docs/Deutsch/INSTALLATION.md`,
    en: `https://github.com/${OWNER}/${REPOSITORY}/blob/main/docs/Englisch/INSTALLATION.md`,
    nl: `https://github.com/${OWNER}/${REPOSITORY}/blob/main/docs/Niederländisch/INSTALLATIE.md`
  };

  const TEXT = {
    de: {
      title: 'Browser OS aktualisieren',
      intro: 'Prüfe, ob auf GitHub eine neuere Version verfügbar ist.',
      installed: 'Installierte Version',
      check: 'Nach Updates suchen',
      checking: 'GitHub-Version wird geprüft …',
      latest: 'Du verwendest bereits die neueste veröffentlichte Version.',
      available: 'Eine neuere Version ist verfügbar:',
      download: 'Template-ZIP herunterladen',
      older: 'Die GitHub-Version ist älter als deine installierte Version. Es wird kein Downgrade angeboten.',
      invalid: 'GitHub hat keine gültige Browser-OS-Version zurückgegeben.',
      error: 'Die GitHub-Version konnte nicht abgerufen werden. Prüfe deine Internetverbindung und versuche es erneut.',
      checked: 'Zuletzt geprüft:',
      note: 'Der Button lädt das Template-ZIP aus dem neuesten Release deines konfigurierten GitHub-Repositories herunter. Entpacke die ZIP-Datei nicht. Öffne danach die Erweiterungsverwaltung eines Browsers mit ZIP-Import, wähle „From .zip/.crx/.user.js“, suche die heruntergeladene Template-Datei und bestätige den Import oder das Update manuell.',
      guide: 'Update-Anleitung öffnen',
      checkAgain: 'Erneut prüfen'
    },
    en: {
      title: 'Update Browser OS',
      intro: 'Check whether a newer version is available on GitHub.',
      installed: 'Installed version',
      check: 'Check for updates',
      checking: 'Checking the GitHub version …',
      latest: 'You are already using the latest published version.',
      available: 'A newer version is available:',
      download: 'Download the Template ZIP',
      older: 'The GitHub version is older than your installed version. No downgrade is offered.',
      invalid: 'GitHub did not return a valid Browser OS version.',
      error: 'Could not retrieve the GitHub version. Check your internet connection and try again.',
      checked: 'Last checked:',
      note: 'This button downloads the Template ZIP from the latest release of your configured GitHub repository. Do not extract the ZIP. Then open the extension manager in a browser with ZIP import, select “From .zip/.crx/.user.js”, choose the downloaded template file and manually confirm the import or update.',
      guide: 'Open update guide',
      checkAgain: 'Check again'
    },
    nl: {
      title: 'Browser OS bijwerken',
      intro: 'Controleer of er op GitHub een nieuwere versie beschikbaar is.',
      installed: 'Geïnstalleerde versie',
      check: 'Controleren op updates',
      checking: 'GitHub-versie controleren …',
      latest: 'Je gebruikt al de nieuwste gepubliceerde versie.',
      available: 'Er is een nieuwere versie beschikbaar:',
      download: 'Template-ZIP downloaden',
      older: 'De GitHub-versie is ouder dan je geïnstalleerde versie. Er wordt geen downgrade aangeboden.',
      invalid: 'GitHub heeft geen geldige Browser OS-versie teruggegeven.',
      error: 'De GitHub-versie kon niet worden opgehaald. Controleer je internetverbinding en probeer het opnieuw.',
      checked: 'Laatst gecontroleerd:',
      note: 'Deze knop downloadt het Template-ZIP-bestand uit de nieuwste release van je ingestelde GitHub-repository. Pak het ZIP-bestand niet uit. Open daarna het extensiebeheer van een browser met ZIP-import, kies “From .zip/.crx/.user.js”, selecteer het gedownloade templatebestand en bevestig de import of update handmatig.',
      guide: 'Updatehandleiding openen',
      checkAgain: 'Opnieuw controleren'
    }
  };

  const language = () => {
    const value = String(document.body?.dataset?.language || document.documentElement?.lang || 'de').toLowerCase();
    return value.startsWith('en') ? 'en' : value.startsWith('nl') ? 'nl' : 'de';
  };

  const getInstalledManifest = () => {
    try {
      return globalThis.chrome?.runtime?.getManifest?.() || null;
    } catch {
      return null;
    }
  };

  const compareVersions = (left, right) => {
    const a = String(left).split('.').map(Number);
    const b = String(right).split('.').map(Number);
    if (!a.length || !b.length || [...a, ...b].some(value => !Number.isInteger(value) || value < 0)) {
      throw new Error('invalid-version');
    }
    const length = Math.max(a.length, b.length);
    for (let i = 0; i < length; i += 1) {
      const av = a[i] || 0;
      const bv = b[i] || 0;
      if (av > bv) return 1;
      if (av < bv) return -1;
    }
    return 0;
  };

  const formatTime = value => {
    try {
      return new Intl.DateTimeFormat(language() === 'de' ? 'de-DE' : language() === 'nl' ? 'nl-NL' : 'en-GB', {
        dateStyle: 'short',
        timeStyle: 'short'
      }).format(value);
    } catch {
      return value.toLocaleString();
    }
  };

  function mountUpdateCenter(root) {
    if (!root || root.dataset.updateCenterMounted === 'true') return;
    root.dataset.updateCenterMounted = 'true';

    const lang = language();
    const text = TEXT[lang];
    const installed = getInstalledManifest();
    const installedVersion = installed?.version || 'unbekannt';

    root.innerHTML = `
      <section class="ssos-card ssos-update-card" aria-labelledby="ssosUpdateTitle">
        <div class="ssos-update-heading">
          <div>
            <h4 id="ssosUpdateTitle">↻ ${text.title}</h4>
            <p class="ssos-update-intro">${text.intro}</p>
          </div>
          <span class="ssos-update-version" data-ssos-update-installed></span>
        </div>
        <div class="ssos-form-actions ssos-update-actions">
          <button class="app-button" type="button" data-ssos-update-check>${text.check}</button>
          <a class="app-button secondary" data-ssos-update-download href="${ZIP_DOWNLOAD_URL}" download="Browser-OS-Extension-Template.zip" rel="noopener noreferrer" hidden>${text.download}</a>
        </div>
        <p class="ssos-update-status" data-ssos-update-status role="status" aria-live="polite"></p>
        <p class="ssos-update-note">${text.note}</p>
        <a class="ssos-cloud-help" href="${DOCUMENTATION_URLS[lang]}" target="_blank" rel="noopener noreferrer">${text.guide} ↗</a>
      </section>
    `;

    const versionLabel = root.querySelector('[data-ssos-update-installed]');
    if (versionLabel) versionLabel.textContent = `${text.installed}: ${installedVersion}`;

    const checkButton = root.querySelector('[data-ssos-update-check]');
    const downloadLink = root.querySelector('[data-ssos-update-download]');
    const status = root.querySelector('[data-ssos-update-status]');

    downloadLink?.addEventListener('click', () => {
      if (status) {
        status.textContent = lang === 'de'
          ? 'Der Template-Download wurde gestartet. Importiere die ZIP-Datei anschließend manuell in der Erweiterungsverwaltung.'
          : lang === 'nl'
            ? 'De template-download is gestart. Importeer het ZIP-bestand daarna handmatig via het extensiebeheer.'
            : 'The template download has started. Then manually import the ZIP file through your browser’s extension manager.';
      }
    });

    checkButton?.addEventListener('click', async () => {
      if (!checkButton || !status || !downloadLink) return;
      const currentManifest = getInstalledManifest();
      const currentVersion = currentManifest?.version;
      checkButton.disabled = true;
      downloadLink.hidden = true;
      status.classList.remove('is-error', 'is-success');
      status.textContent = text.checking;

      try {
        if (!currentVersion || !/^\d+(?:\.\d+){1,3}$/.test(currentVersion)) {
          throw new Error('installed-version');
        }

        const separator = RAW_MANIFEST_URL.includes('?') ? '&' : '?';
        const response = await fetch(`${RAW_MANIFEST_URL}${separator}check=${Date.now()}`, {
          method: 'GET',
          cache: 'no-store',
          headers: { Accept: 'application/json' },
          credentials: 'omit'
        });
        if (!response.ok) throw new Error('http-' + response.status);

        const remoteManifest = await response.json();
        if (
          !remoteManifest ||
          remoteManifest.name !== currentManifest.name ||
          remoteManifest.manifest_version !== 3 ||
          typeof remoteManifest.version !== 'string' ||
          !/^\d+(?:\.\d+){1,3}$/.test(remoteManifest.version)
        ) {
          throw new Error('invalid-manifest');
        }

        const comparison = compareVersions(remoteManifest.version, currentVersion);
        const checkedAt = formatTime(new Date());

        if (comparison > 0) {
          status.textContent = `${text.available} ${remoteManifest.version} · ${text.checked} ${checkedAt}`;
          status.classList.add('is-success');
          downloadLink.hidden = false;
        } else if (comparison === 0) {
          status.textContent = `${text.latest} · ${text.checked} ${checkedAt}`;
          status.classList.add('is-success');
        } else {
          status.textContent = `${text.older} · ${text.checked} ${checkedAt}`;
          status.classList.add('is-error');
        }
      } catch (error) {
        console.warn('[Browser OS updater]', error);
        status.textContent = error.message === 'invalid-manifest' ? text.invalid : text.error;
        status.classList.add('is-error');
      } finally {
        checkButton.disabled = false;
      }
    });

    checkButton?.addEventListener('click', () => {
      checkButton.textContent = text.checkAgain;
    }, { once: true });
  }

  function scan() {
    document.querySelectorAll('[data-ssos-update-center]').forEach(mountUpdateCenter);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scan, { once: true });
  } else {
    scan();
  }

  const observer = new MutationObserver(scan);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
