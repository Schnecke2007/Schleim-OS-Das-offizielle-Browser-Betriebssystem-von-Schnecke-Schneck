(() => {
  'use strict';
  const CONFIG = Object.freeze({
    supabaseUrl: '',
    supabaseAnonKey: '',
    accountSummaryFunction: 'account-summary',
    checkoutFunction: 'create-checkout'
  });
  const GIB = 1024 ** 3;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const language = () => document.body?.dataset.language || 'de';
  const TEXT = {
    de: {title:'Schleim Cloud & Abo',intro:'Dein gemeinsamer Cloud-Speicher für Schleim OS und die Android-App.',free:'Geplanter Free-Tarif',included:'Vorgesehen: 1 GB Cloud-Speicher',plans:'Weitere Tarife',premium:'Premium · 10 GB',plus:'Premium Plus · 50 GB',disabled:'Noch nicht verfügbar',setup:'Cloud-Backend noch nicht verbunden',setupText:'Sobald das Backend eingerichtet ist, zeigen wir hier deinen echten Speicherverbrauch und deinen Tarif.',safe:'Zahlungen sind deaktiviert. Es wird nichts abgebucht.',noData:'Noch keine Cloud-Daten verfügbar.'},
    en: {title:'Schleim Cloud & subscription',intro:'Your shared cloud storage for Schleim OS and the Android app.',free:'Planned Free plan',included:'Planned: 1 GB cloud storage',plans:'More plans',premium:'Premium · 10 GB',plus:'Premium Plus · 50 GB',disabled:'Not available yet',setup:'Cloud backend not connected yet',setupText:'Once the backend is configured, your real storage usage and plan will appear here.',safe:'Payments are disabled. Nothing will be charged.',noData:'No cloud data available yet.'},
    nl: {title:'Schleim Cloud & abonnement',intro:'Je gedeelde cloudopslag voor Schleim OS en de Android-app.',free:'Gepland Free-abonnement',included:'Gepland: 1 GB cloudopslag',plans:'Andere abonnementen',premium:'Premium · 10 GB',plus:'Premium Plus · 50 GB',disabled:'Nog niet beschikbaar',setup:'Cloudbackend nog niet verbonden',setupText:'Zodra de backend is ingesteld, zie je hier je echte opslagverbruik en abonnement.',safe:'Betalingen zijn uitgeschakeld. Er wordt niets afgeschreven.',noData:'Nog geen cloudd gegevens beschikbaar.'}
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
    if (!CONFIG.supabaseUrl || !CONFIG.supabaseAnonKey) return null;
    return null;
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
