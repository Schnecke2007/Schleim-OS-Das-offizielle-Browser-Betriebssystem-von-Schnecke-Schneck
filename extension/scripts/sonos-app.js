(() => {
  'use strict';

  const SONOS_URL = 'https://play.sonos.com/de-de/web-app';
  const DESKTOP_WIDTH = 1280;
  const FRAME_HEIGHT = 900;
  const COPY = {
    de: {
      intro: 'Die offizielle Sonos-Web-App direkt innerhalb von Schleim OS.',
      title: 'Sonos Web · Desktop-Ansicht',
      description: 'Die Sonos-Web-App wird hier eingebettet. Die Webseite erhält eine breite Desktop-Ansicht mit 1280 Pixeln Layoutbreite.',
      loading: 'Sonos-Web-App wird geladen …',
      loaded: 'Die Sonos-Web-App hat die Seite geladen. Falls sie weiterhin endlos lädt, kann Sonos die Einbettung oder die Anmeldung im Frame blockieren.',
      timeout: 'Sonos antwortet im eingebetteten Fenster nicht wie erwartet. Möglicherweise verhindert eine Sonos-Sicherheitsrichtlinie die Einbettung oder die Anmeldung benötigt nicht blockierte Drittanbieter-Cookies.',
      reload: 'Neu laden',
      fit: 'An Bildschirm anpassen',
      original: 'Desktopgröße 100 %',
      open: 'Separat öffnen',
      help: 'Sonos-Hilfe',
      note: 'Die Anmeldung erfolgt direkt bei Sonos. Schleim OS liest keine Zugangsdaten aus dem eingebetteten Fenster aus und speichert kein Sonos-Passwort oder API-Token.',
      blocked: 'Wichtiger Hinweis: Wenn Sonos das Einbetten per Content-Security-Policy (frame-ancestors) oder X-Frame-Options verbietet, kann Schleim OS diese Serversperre nicht aufheben. Die Schaltfläche „Separat öffnen“ bleibt dann der zuverlässige Ausweichweg.'
    },
    en: {
      intro: 'The official Sonos web app directly inside Schleim OS.',
      title: 'Sonos Web · Desktop view',
      description: 'The Sonos web app is embedded here with a wide 1280-pixel desktop layout viewport.',
      loading: 'Loading Sonos web app …',
      loaded: 'The Sonos web app document has loaded. If it keeps spinning, Sonos may be blocking embedding or sign-in inside a frame.',
      timeout: 'The embedded Sonos page has not responded as expected. A Sonos frame policy or third-party cookie restrictions may be preventing sign-in.',
      reload: 'Reload',
      fit: 'Fit to screen',
      original: 'Desktop size 100%',
      open: 'Open separately',
      help: 'Sonos support',
      note: 'Sign-in takes place directly with Sonos. Schleim OS does not read credentials from the embedded page or store your Sonos password or API token.',
      blocked: 'Important: If Sonos blocks embedding with Content-Security-Policy (frame-ancestors) or X-Frame-Options, Schleim OS cannot remove that server-side restriction. Use “Open separately” as the reliable fallback.'
    },
    nl: {
      intro: 'De officiële Sonos-webapp rechtstreeks binnen Schleim OS.',
      title: 'Sonos Web · Desktopweergave',
      description: 'De Sonos-webapp wordt hier ingebed met een brede desktopweergave van 1280 pixels.',
      loading: 'Sonos-webapp wordt geladen …',
      loaded: 'Het document van de Sonos-webapp is geladen. Als de app blijft laden, kan Sonos het insluiten of aanmelden in een frame blokkeren.',
      timeout: 'De ingesloten Sonos-pagina reageert niet zoals verwacht. Een Sonos-framebeleid of beperkingen voor cookies van derden kunnen het aanmelden blokkeren.',
      reload: 'Opnieuw laden',
      fit: 'Aan scherm aanpassen',
      original: 'Desktopformaat 100%',
      open: 'Apart openen',
      help: 'Sonos-ondersteuning',
      note: 'Je meldt je rechtstreeks bij Sonos aan. Schleim OS leest geen inloggegevens uit de ingesloten pagina en bewaart je Sonos-wachtwoord of API-token niet.',
      blocked: 'Belangrijk: Als Sonos insluiten met Content-Security-Policy (frame-ancestors) of X-Frame-Options verbiedt, kan Schleim OS deze serverbeperking niet opheffen. Gebruik dan “Apart openen”.'
    }
  };

  let root = null;
  let frameTimer = null;
  let resizeObserver = null;
  let fitToScreen = true;
  let frameLoaded = false;

  function copy() {
    const language = document.body?.dataset?.language || 'de';
    return COPY[language] || COPY.de;
  }

  function render() {
    const t = copy();
    return '<div class="ssos-sonos-app">' +
      '<div class="ssos-sonos-hero"><div><p class="eyebrow">SCHLEIM OS · SONOS</p><h2>Sonos.</h2><p>' + t.intro + '</p></div><span class="ssos-sonos-hero-icon">🔊</span></div>' +
      '<section class="ssos-sonos-card ssos-sonos-embed-card">' +
        '<div class="ssos-sonos-section-head"><div><p class="eyebrow">SONOS WEB</p><h3>' + t.title + '</h3></div><span class="ssos-sonos-state-dot"></span></div>' +
        '<p class="ssos-sonos-muted">' + t.description + '</p>' +
        '<div class="ssos-sonos-embed-toolbar">' +
          '<button class="app-button secondary" type="button" data-sonos-action="reload">' + t.reload + '</button>' +
          '<button class="app-button secondary" type="button" data-sonos-action="fit">' + t.original + '</button>' +
          '<a class="app-button secondary" href="https://play.sonos.com/" target="_blank" rel="noopener noreferrer">' + t.open + ' ↗</a>' +
        '</div>' +
        '<p class="ssos-sonos-status" id="ssosSonosFrameStatus" role="status" aria-live="polite">' + t.loading + '</p>' +
        '<div class="ssos-sonos-frame-shell" id="ssosSonosFrameShell">' +
          '<div class="ssos-sonos-frame-viewport" id="ssosSonosFrameViewport">' +
            '<div class="ssos-sonos-frame-canvas" id="ssosSonosFrameCanvas">' +
              '<iframe id="ssosSonosFrame" title="Sonos Web – Desktop-Ansicht" src="' + SONOS_URL + '" width="' + DESKTOP_WIDTH + '" height="' + FRAME_HEIGHT + '" loading="eager" referrerpolicy="strict-origin-when-cross-origin" allow="autoplay; clipboard-read; clipboard-write; fullscreen" allowfullscreen></iframe>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</section>' +
      '<section class="ssos-sonos-card">' +
        '<p class="ssos-sonos-muted">' + t.note + '</p>' +
        '<p class="ssos-sonos-muted">' + t.blocked + '</p>' +
        '<a class="ssos-sonos-guide" href="https://support.sonos.com/de-at/article/control-your-sonos-system-with-ai-using-sonos-27mcp" target="_blank" rel="noopener noreferrer">' + t.help + ' ↗</a>' +
      '</section>' +
    '</div>';
  }

  function setStatus(message, error = false) {
    const status = root?.querySelector('#ssosSonosFrameStatus');
    if (!status) return;
    status.textContent = message;
    status.classList.toggle('is-error', error);
  }

  function applyDesktopViewport() {
    const viewport = root?.querySelector('#ssosSonosFrameViewport');
    const canvas = root?.querySelector('#ssosSonosFrameCanvas');
    if (!viewport || !canvas) return;

    const availableWidth = Math.max(320, viewport.clientWidth);
    const scale = fitToScreen ? Math.min(1, availableWidth / DESKTOP_WIDTH) : 1;

    canvas.style.width = DESKTOP_WIDTH + 'px';
    canvas.style.height = (FRAME_HEIGHT * scale) + 'px';
    canvas.style.transform = 'scale(' + scale + ')';
    canvas.style.transformOrigin = 'top left';
    viewport.dataset.fit = fitToScreen ? 'true' : 'false';
  }

  function armLoadTimer() {
    if (frameTimer) clearTimeout(frameTimer);
    frameLoaded = false;
    setStatus(copy().loading);
    frameTimer = setTimeout(() => {
      if (!frameLoaded) setStatus(copy().timeout, true);
    }, 18000);
  }

  function bind() {
    if (!root || root.dataset.sonosBound === '1') return;
    root.dataset.sonosBound = '1';

    const frame = root.querySelector('#ssosSonosFrame');
    frame?.addEventListener('load', () => {
      frameLoaded = true;
      if (frameTimer) clearTimeout(frameTimer);
      setStatus(copy().loaded, false);
    });

    root.addEventListener('click', event => {
      const button = event.target.closest('[data-sonos-action]');
      if (!button) return;
      const action = button.dataset.sonosAction;

      if (action === 'reload') {
        armLoadTimer();
        try {
          frame.contentWindow.location.reload();
        } catch {
          frame.src = SONOS_URL + '?reload=' + Date.now();
        }
        return;
      }

      if (action === 'fit') {
        fitToScreen = !fitToScreen;
        button.textContent = fitToScreen ? copy().original : copy().fit;
        applyDesktopViewport();
      }
    });

    if (typeof ResizeObserver === 'function') {
      resizeObserver = new ResizeObserver(applyDesktopViewport);
      const viewport = root.querySelector('#ssosSonosFrameViewport');
      if (viewport) resizeObserver.observe(viewport);
    } else {
      window.addEventListener('resize', applyDesktopViewport, { passive: true });
    }

    armLoadTimer();
    applyDesktopViewport();
  }

  function mount(container) {
    if (frameTimer) clearTimeout(frameTimer);
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
    root = container?.querySelector('.ssos-sonos-app') || null;
    if (!root) return;
    fitToScreen = true;
    bind();
  }

  window.SSOSSonosApp = Object.freeze({ render, mount });
})();
