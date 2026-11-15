(() => {
  'use strict';

  // Chrome's built-in Prompt API runs Gemini Nano on-device when the browser
  // and hardware support it. No API key or remote inference endpoint is used.
  const MODEL_OPTIONS = {
    expectedInputs: [{ type: 'text' }, { type: 'image' }],
    expectedOutputs: [{ type: 'text' }]
  };
  const IMAGE_SCHEMA = {
    type: 'object',
    properties: {
      description: { type: 'string' },
      keywords: { type: 'array', items: { type: 'string' } }
    },
    required: ['description', 'keywords'],
    additionalProperties: false
  };
  const TERMS_SCHEMA = {
    type: 'object',
    properties: {
      terms: { type: 'array', items: { type: 'string' } }
    },
    required: ['terms'],
    additionalProperties: false
  };
  const TEXT = {
    de: {
      enable: '✨ Lokale KI aktivieren', ready: '✓ Lokale KI ist bereit',
      search: 'KI-Suche', activating: 'Lokales KI-Modell wird geprüft …',
      downloading: 'Lokales KI-Modell wird geladen: {percent} %',
      active: 'Lokale KI ist bereit. Neue Fotos können automatisch beschrieben werden.',
      unsupported: 'Lokale KI ist auf diesem Browser oder Gerät nicht verfügbar. Die normale Suche bleibt nutzbar.',
      query: 'Gib zuerst einen Suchbegriff ein.',
      expanded: 'KI-Suche erweitert: {terms}',
      failed: 'Die lokale KI konnte nicht gestartet werden. Die Metadatensuche bleibt verfügbar.',
      analysing: 'Foto wird direkt auf diesem Gerät mit KI beschrieben …',
      described: 'Foto lokal analysiert. Beschreibung und Stichwörter wurden gespeichert.',
      note: 'Ohne API-Schlüssel. Auf unterstützten Chrome-Desktopgeräten läuft Gemini Nano lokal; auf anderen Geräten bleibt die Metadatensuche verfügbar.'
    },
    en: {
      enable: '✨ Enable on-device AI', ready: '✓ On-device AI is ready',
      search: 'AI search', activating: 'Checking local AI model …',
      downloading: 'Downloading local AI model: {percent}%',
      active: 'On-device AI is ready. New photos can be described automatically.',
      unsupported: 'On-device AI is unavailable in this browser or device. Standard search remains available.',
      query: 'Enter a search term first.',
      expanded: 'AI search expanded: {terms}',
      failed: 'On-device AI could not start. Metadata search remains available.',
      analysing: 'Describing photo with AI on this device …',
      described: 'Photo analysed on-device. Description and keywords were saved.',
      note: 'No API key. Gemini Nano runs locally on supported Chrome desktop devices; metadata search remains available elsewhere.'
    },
    nl: {
      enable: '✨ Lokale AI activeren', ready: '✓ Lokale AI is gereed',
      search: 'AI-zoeken', activating: 'Lokaal AI-model controleren …',
      downloading: 'Lokaal AI-model downloaden: {percent}%',
      active: 'Lokale AI is gereed. Nieuwe foto’s kunnen automatisch worden beschreven.',
      unsupported: 'Lokale AI is niet beschikbaar in deze browser of op dit apparaat. Normaal zoeken blijft mogelijk.',
      query: 'Voer eerst een zoekterm in.',
      expanded: 'AI-zoekopdracht uitgebreid: {terms}',
      failed: 'Lokale AI kon niet starten. Zoeken op metadata blijft beschikbaar.',
      analysing: 'Foto wordt lokaal met AI beschreven …',
      described: 'Foto lokaal geanalyseerd. Beschrijving en trefwoorden zijn opgeslagen.',
      note: 'Geen API-sleutel. Gemini Nano draait lokaal op ondersteunde Chrome-desktopapparaten; elders blijft zoeken op metadata beschikbaar.'
    }
  };
  const state = { session: null, initializing: null, terms: [], queue: Promise.resolve() };
  const lang = () => document.body?.dataset.language || 'de';
  const t = key => TEXT[lang()]?.[key] || TEXT.de[key] || key;
  const $ = selector => document.querySelector(selector);
  function status(message, isError = false) {
    const host = $('[data-photos-ai-status]');
    if (!host) return;
    host.textContent = message || '';
    host.classList.toggle('is-error', !!isError);
  }
  function updateLabels() {
    const enable = $('[data-photos-ai-enable]');
    const search = $('[data-photos-ai-search]');
    const note = $('[data-photos-ai-note]');
    if (enable) enable.textContent = state.session ? t('ready') : t('enable');
    if (search) search.textContent = t('search');
    if (note) note.textContent = t('note');
  }
  function parseObject(value) {
    const text = String(value || '').trim();
    try { return JSON.parse(text); } catch {}
    const start = text.indexOf('{'), end = text.lastIndexOf('}');
    if (start < 0 || end <= start) return null;
    try { return JSON.parse(text.slice(start, end + 1)); } catch { return null; }
  }
  function cleanTerms(values) {
    if (!Array.isArray(values)) return [];
    return [...new Set(values.map(value => String(value || '').toLocaleLowerCase()
      .normalize('NFKC').replace(/[^\p{L}\p{N}\s-]/gu, ' ').trim()
      .replace(/\s+/g, ' ').slice(0, 48))
      .filter(value => value.length >= 2 && value.length <= 48))].slice(0, 12);
  }
  async function initialize() {
    if (state.session) return state.session;
    if (state.initializing) return state.initializing;
    state.initializing = (async () => {
      status(t('activating'));
      const api = globalThis.LanguageModel;
      if (!api || typeof api.availability !== 'function' || typeof api.create !== 'function') {
        throw new Error(t('unsupported'));
      }
      const availability = await api.availability(MODEL_OPTIONS);
      if (availability === 'unavailable') throw new Error(t('unsupported'));
      state.session = await api.create({
        ...MODEL_OPTIONS,
        monitor(monitor) {
          monitor.addEventListener('downloadprogress', event => {
            const percent = Math.max(0, Math.min(100, Math.round(Number(event.loaded || 0) * 100)));
            status(t('downloading').replace('{percent}', String(percent)));
          });
        }
      });
      status(t('active'));
      updateLabels();
      return state.session;
    })().catch(error => {
      status(error?.message || t('failed'), true);
      throw error;
    }).finally(() => { state.initializing = null; });
    return state.initializing;
  }
  function prompt(input, options) {
    const task = state.queue.then(() => state.session.prompt(input, options));
    state.queue = task.catch(() => {});
    return task;
  }
  async function describeImage(file) {
    if (!state.session || !file?.type?.startsWith('image/')) return null;
    status(t('analysing'));
    const instruction = [
      'Describe this photo for a private photo library.',
      'Return a short factual scene description and 5 to 12 useful search keywords.',
      'Mention visible objects, setting, activities, animals, food, transport, nature, weather or landmarks when clearly visible.',
      'Do not identify people, infer identity, age, gender, ethnicity, health, religion or other sensitive personal traits.',
      'Do not guess hidden details. Use the interface language: ' + lang() + '.',
      'Return only the required JSON object.'
    ].join(' ');
    try {
      const message = [{ role: 'user', content: [
        { type: 'text', value: instruction },
        { type: 'image', value: file }
      ] }];
      let result;
      try { result = await prompt(message, { responseConstraint: IMAGE_SCHEMA }); }
      catch { result = await prompt(message); }
      const parsed = parseObject(result);
      const description = String(parsed?.description || '').replace(/[<>]/g, '').trim().slice(0, 260);
      const keywords = cleanTerms(parsed?.keywords);
      status(t('described'));
      return description || keywords.length ? { description, keywords } : null;
    } catch (error) {
      status(t('failed'), true);
      throw error;
    }
  }
  async function expandSearch(query) {
    const value = String(query || '').trim();
    if (!value) throw new Error(t('query'));
    await initialize();
    const instruction = [
      'You expand search terms for a personal photo and video library.',
      'Given the user query, produce up to 10 short relevant synonyms, translations and visually related concepts.',
      'Keep the terms specific. Do not invent dates, locations or objects not implied by the query.',
      'Return only a JSON object with a terms array. Use the interface language ' + lang() + '.',
      'User query: ' + JSON.stringify(value)
    ].join(' ');
    let result;
    try { result = await prompt(instruction, { responseConstraint: TERMS_SCHEMA }); }
    catch { result = await prompt(instruction); }
    const parsed = parseObject(result);
    state.terms = cleanTerms(parsed?.terms).filter(term => term !== value.toLocaleLowerCase());
    window.dispatchEvent(new Event('ssos-photo-ai-terms-updated'));
    status(state.terms.length
      ? t('expanded').replace('{terms}', state.terms.join(', '))
      : t('expanded').replace('{terms}', value));
    return [...state.terms];
  }
  function clearExpandedTerms() { state.terms = []; }
  async function handleClick(event) {
    const enable = event.target.closest('[data-photos-ai-enable]');
    if (enable) {
      enable.disabled = true;
      try { await initialize(); }
      catch {}
      finally { enable.disabled = false; updateLabels(); }
      return;
    }
    const search = event.target.closest('[data-photos-ai-search]');
    if (search) {
      search.disabled = true;
      try {
        const query = $('[data-photos-search]')?.value || '';
        await expandSearch(query);
      } catch (error) { status(error?.message || t('failed'), true); }
      finally { search.disabled = false; }
    }
  }
  document.addEventListener('click', handleClick);
  window.addEventListener('ssos-app-opened', event => {
    if (event.detail?.id === 'images') updateLabels();
  });
  window.SSOSPhotoAI = Object.freeze({
    initialize,
    describeImage,
    expandSearch,
    clearExpandedTerms,
    getExpandedTerms: () => [...state.terms],
    isReady: () => !!state.session
  });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', updateLabels, { once: true });
  else updateLabels();
})();