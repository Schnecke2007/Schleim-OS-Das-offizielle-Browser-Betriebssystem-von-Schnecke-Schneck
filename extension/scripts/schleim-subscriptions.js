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
    de: {title:'Schleim Cloud & Abo',intro:'Dein gemeinsamer Cloud-Speicher für Schleim OS und die Android-App.',free:'Free',included:'1 GB Cloud-Speicher kostenlos',plans:'Dein Upgrade',premium:'Premium · 10 GB',price:'2,99 € / Monat',disabled:'Checkout wird nach Einrichtung freigeschaltet',setup:'Supabase-Projekt hinterlegt',setupText:'Das Backend bleibt unter deiner bisherigen Supabase-URL erreichbar. Die sichere Konto-Verknüpfung muss noch fertiggestellt werden.',safe:'Automatische monatliche SEPA-Lastschrift über Mollie nach ausdrücklicher Mandatserteilung.',noData:'Noch keine authentifizierten Cloud-Daten verfügbar.'},
    en: {title:'Schleim Cloud & subscription',intro:'Your shared cloud storage for Schleim OS and the Android app.',free:'Free',included:'1 GB cloud storage at no cost',plans:'Your upgrade',premium:'Premium · 10 GB',price:'€2.99 / month',disabled:'Checkout will be enabled after setup',setup:'Supabase project configured',setupText:'The backend remains available at your existing Supabase URL. Secure account linking still needs to be completed.',safe:'Automatic monthly SEPA direct debit through Mollie after explicit mandate authorization.',noData:'No authenticated cloud data available yet.'},
    nl: {title:'Schleim Cloud & abonnement',intro:'Je gedeelde cloudopslag voor Schleim OS en de Android-app.',free:'Free',included:'1 GB cloudopslag gratis',plans:'Je upgrade',premium:'Premium · 10 GB',price:'€ 2,99 / maand',disabled:'Checkout wordt na configuratie geactiveerd',setup:'Supabase-project ingesteld',setupText:'De backend blijft bereikbaar via je bestaande Supabase-URL. De veilige accountkoppeling moet nog worden voltooid.',safe:'Automatische maandelijkse SEPA-incasso via Mollie na uitdrukkelijke machtiging.',noData:'Nog geen geauthenticeerde cloudgegevens beschikbaar.'}
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
      '<div><b>' + esc(t('premium')) + '</b><strong>' + esc(t('price')) + '</strong><small>' + esc(t('disabled')) + '</small></div>' +
      '</div>' +
      '<p class="ssos-cloud-note">' + esc(t('setup')) + ': ' + esc(t('setupText')) + '</p>' +
      '<p class="ssos-cloud-note">' + esc(t('safe')) + '</p></section>';
  }
  async function refresh() {
    // GitHub Device Flow tokens are not Supabase Auth sessions. Do not send
    // them to Supabase or pretend that they authenticate the billing API.
    // Checkout remains unavailable until a trusted identity bridge is deployed.
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
