(() => {
  'use strict';
  // Supabase publishable key: public by design. Never place a service-role key here.
  const CONFIG = Object.freeze({
    supabaseUrl: 'https://hrtunnupqcpklejpfsvq.supabase.co',
    supabaseAnonKey: 'sb_publishable_87WPVR-4mWS3hluaI7G4PQ_9RFe8aQO',
    accountSummaryFunction: 'account-summary',
    checkoutFunction: 'create-checkout'
  });
  const GIB = 1024 ** 3;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const language = () => document.body?.dataset.language || 'de';
  const TEXT = {
    de: {title:'Schleim Cloud & Abo',intro:'Dein gemeinsamer Cloud-Speicher für Schleim OS und die Android-App.',free:'Geplanter Free-Tarif',included:'Vorgesehen: 1 GB Cloud-Speicher',plans:'Weitere Tarife',premium:'Premium · 10 GB',plus:'Premium Plus · 50 GB',disabled:'Noch nicht verfügbar',setup:'Supabase-Projekt hinterlegt',setupText:'Das Projekt ist konfiguriert. Die sichere Konto-Verknüpfung und der Abruf deiner echten Kontodaten fehlen noch.',safe:'Zahlungen sind deaktiviert. Es wird nichts abgebucht.',noData:'Noch keine authentifizierten Cloud-Daten verfügbar.'},
    en: {title:'Schleim Cloud & subscription',intro:'Your shared cloud storage for Schleim OS and the Android app.',free:'Planned Free plan',included:'Planned: 1 GB cloud storage',plans:'More plans',premium:'Premium · 10 GB',plus:'Premium Plus · 50 GB',disabled:'Not available yet',setup:'Supabase project configured',setupText:'The project is configured. Secure account linking and retrieval of your real account data are still pending.',safe:'Payments are disabled. Nothing will be charged.',noData:'No authenticated cloud data available yet.'},
    nl: {title:'Schleim Cloud & abonnement',intro:'Je gedeelde cloudopslag voor Schleim OS en de Android-app.',free:'Gepland Free-abonnement',included:'Gepland: 1 GB cloudopslag',plans:'Andere abonnementen',premium:'Premium · 10 GB',plus:'Premium Plus · 50 GB',disabled:'Nog niet beschikbaar',setup:'Supabase-project ingesteld',setupText:'Het project is ingesteld. De veilige accountkoppeling en het ophalen van je echte accountgegevens ontbreken nog.',safe:'Betalingen zijn uitgeschakeld. Er wordt niets afgeschreven.',noData:'Nog geen geauthenticeerde cloudgegevens beschikbaar.'}
  };
  const t = key => (TEXT[language()] || TEXT.de)[key] || TEXT.de[key] || key;
  const formatBytes = bytes => {
    const n = Number(bytes || 0);
    if (n < 1024 ** 2) return (n / 1024).toFixed(0) + ' KB';
    if (n < GIB) return (n / 1024 ** 2).toFixed(1) + ' MB';
    return (n / GIB).toFixed(2) + ' GB';
  };
  function render() {
    return '<section class="ssos-card ssos-subscription-card" data-ssos-subscription-panel>' +
      '<h4>☁️ ' + esc(t('title')) + '</h4><p>' + esc(t('intro')) + '</p>' +
      '<div class="ssos-subscription-current"><b>' + esc(t('free')) + ' · 1 GB</b><p>' + esc(t('included')) + '</p>' +
      '<div class="ssos-subscription-meter"><span style="width:0%"></span></div><small>' + esc(t('noData')) + '</small></div>' +
      '<h5>' + esc(t('plans')) + '</h5><div class="ssos-subscription-plans">' +
      '<div><b>' + esc(t('premium')) + '</b><small>' + esc(t('disabled')) + '</small></div>' +
      '<div><b>' + esc(t('plus')) + '</b><small>' + esc(t('disabled')) + '</small></div></div>' +
      '<p class="ssos-cloud-note">' + esc(t('setup')) + ': ' + esc(t('setupText')) + '</p>' +
      '<p class="ssos-cloud-note">' + esc(t('safe')) + '</p></section>';
  }
  async function refresh() {
    // GitHub Device Flow tokens are not Supabase Auth sessions. Do not send
    // them to Supabase or pretend that they authenticate the billing API.
    // The public project configuration is present, but no trusted user JWT
    // exists until the server-side identity bridge has been implemented.
    return {
      configured: Boolean(CONFIG.supabaseUrl && CONFIG.supabaseAnonKey),
      authenticated: false,
      paymentsEnabled: false
    };
  }
  function mount() {
    document.querySelectorAll('.ssos-settings-cloud[data-ssos-cloud-account]').forEach(host => {
      if (host.dataset.ssosSubscriptionMounted === '1') return;
      host.dataset.ssosSubscriptionMounted = '1';
      host.insertAdjacentHTML('afterend', render());
    });
  }
  function init() {
    mount();
    new MutationObserver(mount).observe(document.body, {childList:true, subtree:true});
    window.addEventListener('ssos-account-state-changed', mount);
    void refresh();
  }
  window.SSOSSubscriptions = Object.freeze({mount, refresh, formatBytes});
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
