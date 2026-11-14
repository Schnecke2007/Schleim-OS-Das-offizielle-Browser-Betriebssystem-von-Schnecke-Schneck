(() => {
  'use strict';

  const OWNER = 'Schnecke2007';
  const REPOSITORY = 'Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck';
  const RAW_MANIFEST_URL = `https://raw.githubusercontent.com/${OWNER}/${REPOSITORY}/main/extension/manifest.json`;
  const ZIP_DOWNLOAD_URL = `https://github.com/${OWNER}/${REPOSITORY}/archive/refs/heads/main.zip`;
  const DOCUMENTATION_URLS = {
    de: `https://github.com/${OWNER}/${REPOSITORY}/blob/main/docs/Deutsch/UPDATES.md`,
    en: `https://github.com/${OWNER}/${REPOSITORY}/blob/main/docs/Englisch/UPDATES.md`,
    nl: `https://github.com/${OWNER}/${REPOSITORY}/blob/main/docs/Niederländisch/UPDATES.md`
  };

  const TEXT = {
    de: {
      title: 'Schleim OS aktualisieren',
      intro: 'Prüfe, ob auf GitHub eine neuere Version verfügbar ist.',
      installed: 'Installierte Version',
      check: 'Nach Updates suchen',
      checking: 'GitHub-Version wird geprüft …',
      latest: 'Du verwendest bereits die neueste veröffentlichte Version.',
      available: 'Eine neuere Version ist verfügbar:',
      download: 'Neueste ZIP-Version herunterladen',
      older: 'Die GitHub-Version ist älter als deine installierte Version. Es wird kein Downgrade angeboten.',
      invalid: 'GitHub hat keine gültige Schleim-OS-Version zurückgegeben.',
      error: 'Die GitHub-Version konnte nicht abgerufen werden. Prüfe deine Internetverbindung und versuche es erneut.',
      checked: 'Zuletzt geprüft:',
      note: 'Der Download installiert das Update nicht selbst. Öffne danach die Erweiterungsverwaltung und aktualisiere Schleim OS mit der Import-Funktion deines Browsers. Eine automatische Installation aus einer ZIP-Datei wird von Chrome nicht freigegeben.',
      guide: 'Update-Anleitung öffnen',
      checkAgain: 'Erneut prüfen'
    },
    en: {
      title: 'Update Schleim OS',
      intro: 'Check whether a newer version is available on GitHub.',
      installed: 'Installed version',
      check: 'Check for updates',
      checking: 'Checking the GitHub version …',
      latest: 'You are already using the latest published version.',
      available: 'A newer version is available:',
      download: 'Download the latest ZIP version',
      older: 'The GitHub version is older than your installed version. No downgrade is offered.',
      invalid: 'GitHub did not return a valid Schleim OS version.',
      error: 'Could not retrieve the GitHub version. Check your internet connection and try again.',
      checked: 'Last checked:',
      note: 'The download does not install the update by itself. Then open your browser’s extension manager and update Schleim OS with the import function supported by your browser. Chrome does not allow silent installation from a ZIP file.',
      guide: 'Open update guide',
      checkAgain: 'Check again'
    },
    nl: {
      title: 'Schleim OS bijwerken',
      intro: 'Controleer of er op GitHub een nieuwere versie beschikbaar is.',
      installed: 'Geïnstalleerde versie',
      check: 'Controleren op updates',
      checking: 'GitHub-versie controleren …',
      latest: 'Je gebruikt al de nieuwste gepubliceerde versie.',
      available: 'Er is een nieuwere versie beschikbaar:',
      download: 'Nieuwste ZIP-versie downloaden',
      older: 'De GitHub-versie is ouder dan je geïnstalleerde versie. Er wordt geen downgrade aangeboden.',
      invalid: 'GitHub heeft geen geldige Schleim OS-versie teruggegeven.',
      error: 'De GitHub-versie kon niet worden opgehaald. Controleer je internetverbinding en probeer het opnieuw.',
      checked: 'Laatst gecontroleerd:',
      note: 'De download installeert de update niet vanzelf. Open daarna het extensiebeheer van je browser en werk Schleim OS bij met de importfunctie die je browser ondersteunt. Chrome staat stille installatie vanuit een ZIP-bestand niet toe.',
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
          <a class="app-button secondary" data-ssos-update-download href="${ZIP_DOWNLOAD_URL}" target="_blank" rel="noopener noreferrer" hidden>${text.download}</a>
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
        console.warn('[Schleim OS updater]', error);
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
