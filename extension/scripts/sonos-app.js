(() => {
  'use strict';

  const COPY = {
    de: {
      intro: 'Steuere dein Sonos-System ohne eigene API-Schlüssel oder Server-Einrichtung.',
      title: 'Direkt mit Sonos verbinden',
      description: 'Schleim OS öffnet die offizielle Sonos-Websteuerung. Melde dich dort mit deinem normalen Sonos-Konto an und wähle deine Lautsprecher aus.',
      open: 'Offizielle Sonos-Websteuerung öffnen',
      noteTitle: 'Keine technische Einrichtung nötig',
      note: 'Du brauchst keinen Sonos-Developer-Key, keinen Cloudflare-Worker, keinen KV-Speicher und keine eigene Anwendung. Deine Sonos-Anmeldedaten werden ausschließlich direkt bei Sonos eingegeben.',
      external: 'Die Steuerung öffnet sich aus Sicherheits- und Kompatibilitätsgründen in einem eigenen Browser-Tab.',
      help: 'Offizielle Sonos-Hilfe öffnen',
      advancedTitle: 'Steuerung direkt in Schleim OS',
      advanced: 'Eine direkte Einbettung mit API-Steuerung wäre weiterhin möglich, benötigt aber einen zusätzlichen Dienst wie Home Assistant und dessen Zugriffstoken. Das ist optional und für den einfachen Start nicht erforderlich.'
    },
    en: {
      intro: 'Control your Sonos system without creating API keys or setting up a server.',
      title: 'Connect to Sonos',
      description: 'Schleim OS opens the official Sonos web control. Sign in there with your normal Sonos account and choose your speakers.',
      open: 'Open official Sonos web control',
      noteTitle: 'No technical setup required',
      note: 'You do not need a Sonos developer key, Cloudflare Worker, KV storage or your own application. Enter your Sonos credentials only on the official Sonos website.',
      external: 'For security and compatibility, Sonos opens in its own browser tab.',
      help: 'Open official Sonos support',
      advancedTitle: 'Control directly inside Schleim OS',
      advanced: 'Direct in-app API control is still possible, but it requires an additional service such as Home Assistant and its access token. This is optional and not needed to get started.'
    },
    nl: {
      intro: 'Bedien je Sonos-systeem zonder API-sleutels aan te maken of een server in te stellen.',
      title: 'Rechtstreeks verbinden met Sonos',
      description: 'Schleim OS opent de officiële Sonos-webbediening. Meld je daar aan met je gewone Sonos-account en kies je luidsprekers.',
      open: 'Officiële Sonos-webbediening openen',
      noteTitle: 'Geen technische installatie nodig',
      note: 'Je hebt geen Sonos-ontwikkelaarssleutel, Cloudflare Worker, KV-opslag of eigen applicatie nodig. Voer je Sonos-inloggegevens alleen in op de officiële Sonos-website in.',
      external: 'Om veiligheids- en compatibiliteitsredenen opent Sonos in een eigen browsertabblad.',
      help: 'Officiële Sonos-ondersteuning openen',
      advancedTitle: 'Bediening rechtstreeks in Schleim OS',
      advanced: 'Rechtstreekse API-bediening in de app is nog steeds mogelijk, maar vereist een extra dienst zoals Home Assistant en het bijbehorende toegangstoken. Dit is optioneel en niet nodig om te beginnen.'
    }
  };

  function render() {
    const lang = document.body?.dataset?.language || 'de';
    const t = COPY[lang] || COPY.de;
    return '<div class="ssos-sonos-app">' +
      '<div class="ssos-sonos-hero"><div><p class="eyebrow">SCHLEIM OS · SONOS</p><h2>Sonos.</h2><p>' + t.intro + '</p></div><span class="ssos-sonos-hero-icon">🔊</span></div>' +
      '<section class="ssos-sonos-card ssos-sonos-setup">' +
        '<div class="ssos-sonos-section-head"><div><p class="eyebrow">SONOS WEB</p><h3>' + t.title + '</h3></div><span class="ssos-sonos-connected-mark">●</span></div>' +
        '<p class="ssos-sonos-muted">' + t.description + '</p>' +
        '<a class="app-button" href="https://play.sonos.com/" target="_blank" rel="noopener noreferrer">' + t.open + ' ↗</a>' +
        '<p class="ssos-sonos-muted">' + t.external + '</p>' +
      '</section>' +
      '<section class="ssos-sonos-card">' +
        '<div class="ssos-sonos-section-head"><h3>' + t.noteTitle + '</h3></div>' +
        '<p class="ssos-sonos-muted">' + t.note + '</p>' +
        '<a class="ssos-sonos-guide" href="https://support.sonos.com/de-at/article/control-your-sonos-system-with-ai-using-sonos-27mcp" target="_blank" rel="noopener noreferrer">' + t.help + ' ↗</a>' +
      '</section>' +
      '<section class="ssos-sonos-card">' +
        '<div class="ssos-sonos-section-head"><h3>' + t.advancedTitle + '</h3></div>' +
        '<p class="ssos-sonos-muted">' + t.advanced + '</p>' +
      '</section>' +
    '</div>';
  }

  function mount() {}
  window.SSOSSonosApp = Object.freeze({ render, mount });
})();
