/* Shared extras for every MigaBuilder tool page (loaded by tutorials.js):
 *  - 🔒 a badge that says the tool runs in the browser — click it for what stays private and to turn
 *    anonymous visit counting off;
 *  - live green/red checks on email, phone, website and other rule-bound fields as you type;
 *  - #links for tool tabs, so refresh, bookmarks and the Back button keep your place;
 *  - a Describe → Check & edit → Download progress bar on pages that opt in (data-miga-steps);
 *  - 🌙 a dark-mode toggle, remembered on this device;
 *  - 💾 auto-save of what you type, with “Restore your work?” when you come back,
 *    plus Save work to a .miga file / Open a .miga file — no account needed.
 * Tools that already keep their own drafts are skipped for the auto-save part.
 * Everything stays in this browser.
 */
(function () {
  'use strict';
  if (window.__migaExtras) return; window.__migaExtras = true;
  const file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const nav = document.querySelector('.tool-nav');
  const root = document.querySelector('main') || document.body;
  const OWN_DRAFTS = ['alphabet-forge.html', 'flashcard-forge.html', 'cv-forge.html', 'contract-forge.html', 'form-forge.html', 'repurpose-forge.html', 'post-forge.html',
    'music-forge.html', 'video-forge.html', 'paint-forge.html', 'cad-forge.html', 'invoice-forge.html', 'meet-forge.html', 'project-hub.html', 'visits.html', 'sample-viewer.html', 'templates.html'];
  const ls = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } },
    del(k) { try { localStorage.removeItem(k); } catch (e) {} }
  };

  const st = document.createElement('style');
  st.textContent = '.miga-bar{display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-left:auto}.miga-bar>*{font:600 12px "IBM Plex Sans",system-ui,sans-serif}' +
    '.miga-badge{color:#9fe0b8;border:1px solid rgba(159,224,184,.35);border-radius:999px;padding:3px 9px;white-space:nowrap}' +
    '.miga-bar button{background:transparent;color:#6fd1e0;border:1px solid rgba(111,209,224,.4);border-radius:999px;padding:3px 10px;cursor:pointer}.miga-bar button:hover{background:rgba(111,209,224,.12)}' +
    '.miga-menu{position:absolute;z-index:9998;background:#0E2A47;border:1px solid rgba(111,209,224,.35);border-radius:8px;padding:6px;display:grid;gap:4px;box-shadow:0 12px 30px rgba(0,0,0,.35);min-width:230px}' +
    '.miga-menu button{text-align:left;border-radius:6px!important;padding:8px 10px!important;color:#EDEAE0!important;border-color:transparent!important;font-size:13px!important}.miga-menu small{color:rgba(237,234,224,.6);padding:2px 10px 4px;font-size:11px}' +
    '.miga-toast{position:fixed;left:50%;top:14px;transform:translateX(-50%);z-index:9999;background:#fff7e6;color:#16202B;border:1px solid #E2A63B;border-radius:8px;padding:10px 12px;display:flex;gap:10px;align-items:center;flex-wrap:wrap;box-shadow:0 10px 30px rgba(0,0,0,.25);max-width:calc(100vw - 20px);font:14px "IBM Plex Sans",system-ui,sans-serif}' +
    '.miga-toast button{border:0;border-radius:4px;padding:7px 12px;font-weight:700;cursor:pointer}.miga-toast .yes{background:#E2A63B;color:#3b2a0c}.miga-toast .no{background:#fff;border:1px solid rgba(22,32,43,.25);color:#16202B}' +
    // Dark mode: invert the light panels, then flip media back so photos and videos keep their colours.
    '.tool-nav{flex-wrap:wrap}html.miga-dark .panel{filter:invert(.92) hue-rotate(180deg)}' +
    'html.miga-dark .panel img,html.miga-dark .panel video,html.miga-dark .panel canvas,html.miga-dark .panel iframe,html.miga-dark .panel picture,html.miga-dark .panel svg image,html.miga-dark .panel [style*="background-image"],html.miga-dark .panel input[type=color]{filter:invert(1) hue-rotate(180deg)}' +
    'html.miga-dark .panel .panel{filter:none}' +
    // Pages with their own design get a small floating pill instead of the nav bar.
    '.miga-float{position:fixed;left:10px;bottom:10px;z-index:60;margin:0;background:rgba(8,24,38,.88);padding:4px;border-radius:999px;box-shadow:0 6px 18px rgba(0,0,0,.3);opacity:.85}.miga-float:hover{opacity:1}' +
    '.miga-float .miga-badge{border:0;padding:3px 6px}' +
    // Privacy panel, live validation and progress steps.
    '.miga-privacy{max-width:300px}.miga-privacy small{line-height:1.45}.miga-privacy label{display:flex;gap:8px;align-items:center;color:#EDEAE0;padding:6px 10px;font-size:12.5px;cursor:pointer}' +
    '.miga-ok{border-color:#4E9E73!important;box-shadow:0 0 0 3px rgba(78,158,115,.18)!important;transition:box-shadow .25s,border-color .25s}' +
    '.miga-bad{border-color:#D8604A!important;box-shadow:0 0 0 3px rgba(216,96,74,.2)!important;animation:miga-nudge .28s ease}' +
    '.miga-hint{display:block;color:#C2412B;font:500 12px/1.4 "IBM Plex Sans",system-ui,sans-serif;margin-top:4px;animation:miga-fade .2s ease}' +
    '@keyframes miga-nudge{25%{transform:translateX(-3px)}75%{transform:translateX(3px)}}@keyframes miga-fade{from{opacity:0;transform:translateY(-2px)}}' +
    '.miga-steps{list-style:none;display:flex;gap:8px;margin:18px auto 0;padding:0 clamp(20px,4vw,48px);max-width:1300px;counter-reset:s;flex-wrap:wrap}.miga-steps li{flex:1 1 150px}' +
    '.miga-steps button{width:100%;display:flex;gap:10px;align-items:center;background:rgba(111,209,224,.06);color:rgba(237,234,224,.7);border:1px solid rgba(111,209,224,.22);border-radius:10px;padding:9px 12px;cursor:pointer;font:600 13.5px "IBM Plex Sans",system-ui,sans-serif;text-align:left;transition:background .2s,border-color .2s,color .2s}' +
    '.miga-steps b{flex:none;width:24px;height:24px;border-radius:50%;display:grid;place-items:center;background:rgba(111,209,224,.15);font-size:12px}' +
    '.miga-steps .current button{color:#EDEAE0;border-color:#6FD1E0;background:rgba(111,209,224,.14)}.miga-steps .current b{background:#6FD1E0;color:#081826}' +
    '.miga-steps .done button{color:#9fe0b8;border-color:rgba(78,158,115,.55)}.miga-steps .done b{background:#4E9E73;color:#fff}' +
    '@media(prefers-reduced-motion:reduce){.miga-bad,.miga-hint{animation:none}}' +
    '@media(max-width:620px){.miga-badge{display:none}.miga-steps li{flex-basis:0}.miga-steps button{flex-direction:column;gap:4px;text-align:center;font-size:12px;padding:8px 4px}}';
  document.head.appendChild(st);

  const bar = document.createElement('div'); bar.className = 'miga-bar' + (nav ? '' : ' miga-float');
  const lightPanels = !!document.querySelector('.panel');
  bar.innerHTML = '<span class="miga-badge" title="This tool works inside your browser. Your text and files are not uploaded unless you use an AI or sharing feature.">🔒 ' + (nav ? 'Private · runs in your browser' : 'Private') + '</span>' + (lightPanels ? '<button type="button" class="miga-theme" aria-label="Toggle dark mode"></button>' : '');
  (nav || document.body).appendChild(bar);

  // ---------- on-screen keyboard for any text field (loaded on demand) ----------
  let lastField = null;
  const typeable = el => el && (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT' && /^(text|search|email|url|)$/i.test(el.type || '')) && !el.readOnly && !el.closest('.mkb');
  document.addEventListener('focusin', e => { if (typeable(e.target)) lastField = e.target; });
  const kbBtn = document.createElement('button'); kbBtn.type = 'button'; kbBtn.textContent = '⌨️ Keyboard'; kbBtn.title = 'On-screen keyboard for other languages and alphabets (Arabic, Russian, Chinese, Hindi, Korean, accents…)';
  kbBtn.addEventListener('pointerdown', e => e.preventDefault());
  kbBtn.onclick = () => {
    const go = () => {
      if (window.MigaKeyboard.isOpen()) { window.MigaKeyboard.close(); return; }
      const t = typeable(document.activeElement) ? document.activeElement : lastField || Array.from(root.querySelectorAll('textarea, input')).find(typeable);
      if (!t) { alert('Click in a text box first, then open the keyboard.'); return; }
      window.MigaKeyboard.open({ target: t });
    };
    if (window.MigaKeyboard) return go();
    const sc = document.createElement('script'); sc.src = 'script-keyboard.js'; sc.onload = go; document.head.appendChild(sc);
  };
  bar.insertBefore(kbBtn, bar.children[1] || null);

  // ---------- dark mode ----------
  const themeBtn = bar.querySelector('.miga-theme') || document.createElement('button');
  function applyTheme(dark) { document.documentElement.classList.toggle('miga-dark', dark && lightPanels); themeBtn.textContent = dark ? '☀️ Light' : '🌙 Dark'; }
  applyTheme(ls.get('migaTheme', '') === 'dark');
  themeBtn.onclick = () => { const dark = !document.documentElement.classList.contains('miga-dark'); ls.set('migaTheme', dark ? 'dark' : 'light'); applyTheme(dark); };

  // ---------- 🔒 privacy panel (click the badge) ----------
  const badge = bar.querySelector('.miga-badge');
  const dnt = !!(navigator.globalPrivacyControl || navigator.doNotTrack === '1' || window.doNotTrack === '1');
  let privacyMenu = null;
  badge.setAttribute('role', 'button'); badge.tabIndex = 0; badge.style.cursor = 'pointer';
  function togglePrivacy(e) {
    e.stopPropagation();
    if (privacyMenu) { privacyMenu.remove(); privacyMenu = null; return; }
    let off = false; try { off = localStorage.getItem('migaNoCount') === '1'; } catch (err) {}
    privacyMenu = document.createElement('div'); privacyMenu.className = 'miga-menu miga-bar miga-privacy';
    privacyMenu.innerHTML = '<small><b>What stays on this device:</b> everything you type, open or make here. No account, cookies, ads or trackers. ' +
      'AI and sharing features send only what you ask them to.</small>' +
      '<small>AI-made sites, games and apps run in a locked sandbox, so their code cannot read this site or your saved work.</small>' +
      (dnt ? '<small>✅ Your browser asks not to be tracked, so visits are not counted at all.</small>'
        : '<label><input type="checkbox"' + (off ? '' : ' checked') + '> Count my visit anonymously (page name only)</label>');
    document.body.appendChild(privacyMenu);
    const r = badge.getBoundingClientRect();
    privacyMenu.style.top = (nav ? r.bottom + scrollY + 6 : r.top + scrollY - 190) + 'px'; privacyMenu.style.left = Math.max(8, Math.min(innerWidth - 300, r.left)) + 'px';
    const cb = privacyMenu.querySelector('input');
    if (cb) cb.onchange = () => { try { cb.checked ? localStorage.removeItem('migaNoCount') : localStorage.setItem('migaNoCount', '1'); } catch (err) {} };
  }
  badge.addEventListener('click', togglePrivacy);
  badge.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); togglePrivacy(e); } });
  document.addEventListener('click', e => { if (privacyMenu && !privacyMenu.contains(e.target)) { privacyMenu.remove(); privacyMenu = null; } });

  // ---------- live inline validation ----------
  // Fields show green/red as you type, not after you press a button. Covers the browser's own
  // rules (required, min/max, pattern, type=email/url) plus fields named like an email, phone or website.
  const RX = {
    email: /^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]{2,}$/,
    phone: /^\+?[\d\s().\-]{6,}$/,
    url: /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(:\d+)?(\/\S*)?$/i
  };
  const MSG = {
    email: 'Check the email — it should look like name@example.com',
    emails: 'One of these emails looks wrong — separate them with commas',
    phone: 'Use digits, spaces and + ( ) - only, at least 6 digits',
    url: 'Check the address — it should look like example.com'
  };
  function kindOf(el) {
    if (el.tagName === 'SELECT' || el.readOnly || el.disabled || el.getAttribute('tabindex') === '-1') return null;
    const t = (el.type || '').toLowerCase(), id = (el.id + ' ' + (el.name || '') + ' ' + (el.getAttribute('autocomplete') || '')).toLowerCase();
    if (!/^(text|email|url|tel|search|number|)$/.test(t) && el.tagName !== 'TEXTAREA') return null;
    if (el.tagName === 'INPUT') {
      if (t === 'email' || /e-?mail/.test(id)) return /emails/.test(id) || el.multiple ? 'emails' : 'email';
      if (t === 'tel' || /phone|mobile|(^|[^a-z])tel([^a-z]|$)/.test(id)) return 'phone';
      if (t === 'url' || /website|url|homepage|linkedin/.test(id)) return 'url';
    }
    if (el.required || el.pattern || t === 'number' || el.maxLength > 0 || el.minLength > 0) return 'native';
    return null;
  }
  function problem(el, kind) {
    const v = el.value.trim();
    // Step mismatches are ignored: tools read decimals from number boxes whatever their step.
    const vs = el.validity;
    if (vs.valueMissing || vs.typeMismatch || vs.patternMismatch || vs.tooLong || vs.tooShort || vs.rangeUnderflow || vs.rangeOverflow || vs.badInput) return el.validationMessage || 'Check this field';
    if (!v || kind === 'native') return '';
    if (kind === 'emails') return v.split(/[\s,;]+/).filter(Boolean).every(x => RX.email.test(x)) ? '' : MSG.emails;
    if (kind === 'phone') return RX.phone.test(v) && v.replace(/\D/g, '').length >= 6 ? '' : MSG.phone;
    return RX[kind].test(v) ? '' : MSG[kind];
  }
  const touched = new WeakSet();
  function check(el, final) {
    const kind = kindOf(el); if (!kind) return;
    const empty = !el.value.trim();
    let msg = problem(el, kind);
    // An empty required box only turns red after you leave it; half-typed text gets a moment before it is judged.
    if (empty && !final) msg = '';
    let hint = el.nextElementSibling && el.nextElementSibling.classList.contains('miga-hint') ? el.nextElementSibling : null;
    el.classList.toggle('miga-bad', !!msg);
    el.classList.toggle('miga-ok', !msg && !empty && kind !== 'native');
    if (msg) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid');
    if (msg) {
      if (!hint) { hint = document.createElement('small'); hint.className = 'miga-hint'; hint.setAttribute('aria-live', 'polite'); el.insertAdjacentElement('afterend', hint); }
      hint.textContent = msg;
    } else if (hint) hint.remove();
    // Character counter once a length-limited field is 80% full.
    if (el.maxLength > 0 && el.value.length >= el.maxLength * 0.8) el.title = el.value.length + ' / ' + el.maxLength + ' characters';
  }
  const vTimers = new WeakMap();
  document.addEventListener('input', e => {
    const el = e.target; if (!root.contains(el) || !kindOf(el)) return;
    touched.add(el);
    clearTimeout(vTimers.get(el));
    // Clear a red mark straight away once the value is fixed; wait a little before showing a new one.
    if (el.classList.contains('miga-bad')) check(el, false);
    vTimers.set(el, setTimeout(() => check(el, false), 450));
  }, true);
  document.addEventListener('focusout', e => { const el = e.target; if (root.contains(el) && touched.has(el)) check(el, true); }, true);

  // ---------- deep links for tool tabs ----------
  // Tabs such as “Drawings” in CAD Forge or “Meme” in Image Studio get their own #address, so a link or a
  // refresh opens the same tab, and the browser’s Back button steps back through the tabs you visited.
  const HASH_OWNERS = ['alphabet-forge.html', 'geo-forge.html', 'flashcard-forge.html', 'idea-atlas.html'];
  const tabKey = el => el.dataset.tab || el.dataset.mode;
  const tabs = HASH_OWNERS.includes(file) ? [] : Array.from(root.querySelectorAll('.tab[data-tab], .tab[data-mode], [role="tab"][data-tab]'));
  if (tabs.length > 1) {
    let routing = false;
    const openHash = () => {
      const key = decodeURIComponent(location.hash.slice(1));
      const t = tabs.find(x => tabKey(x) === key) || (!key && tabs[0]);
      if (t && !t.classList.contains('active') && t.getAttribute('aria-selected') !== 'true') { routing = true; t.click(); routing = false; }
    };
    root.addEventListener('click', e => {
      const t = e.target.closest && e.target.closest('.tab');
      if (routing || !t || !tabs.includes(t)) return;
      const hash = '#' + encodeURIComponent(tabKey(t));
      if (location.hash !== hash) history.pushState(null, '', hash);
    });
    window.addEventListener('popstate', openHash);
    if (location.hash) setTimeout(openHash, 0);
  }

  // ---------- progress steps: Describe → Check & edit → Download ----------
  // Opt in with <main data-miga-steps data-miga-ready="#downloadBtn">. The result counts as ready once
  // that button is enabled; clicking it (or data-miga-done) completes the last step.
  const stepsHost = document.querySelector('main[data-miga-steps]');
  if (stepsHost) {
    const LABELS = {
      en: ['Describe it', 'Check & edit', 'Download'], es: ['Descríbelo', 'Revisa y edita', 'Descarga'], ar: ['صِفه', 'راجع وعدّل', 'نزّل'],
      zh: ['描述', '检查和编辑', '下载'], sw: ['Eleza', 'Kagua na hariri', 'Pakua']
    };
    const readySel = stepsHost.dataset.migaReady || '#downloadBtn';
    const doneSel = stepsHost.dataset.migaDone || readySel;
    const targets = [stepsHost.querySelector('.panel'), stepsHost.querySelector('.table'), document.querySelector(readySel)];
    const ol = document.createElement('ol'); ol.className = 'miga-steps';
    ol.innerHTML = [0, 1, 2].map(i => '<li><button type="button" data-i="' + i + '"><b>' + (i + 1) + '</b><span></span></button></li>').join('');
    stepsHost.parentNode.insertBefore(ol, stepsHost);
    const label = () => { const L = LABELS[(document.documentElement.lang || 'en').slice(0, 2)] || LABELS.en; ol.querySelectorAll('span').forEach((s, i) => { s.textContent = L[i]; }); };
    let downloaded = false;
    const update = () => {
      const ready = document.querySelector(readySel), isReady = !!ready && !ready.disabled;
      if (!isReady) downloaded = false;
      const current = downloaded ? 3 : isReady ? 1 : 0;
      ol.querySelectorAll('li').forEach((li, i) => {
        li.className = i < current ? 'done' : i === current ? 'current' : '';
        li.querySelector('b').textContent = i < current ? '✓' : i + 1;
        if (i === current) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
      });
    };
    ol.onclick = e => { const b = e.target.closest('button'); const t = b && targets[+b.dataset.i]; if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
    document.addEventListener('click', e => { if (e.target.closest && e.target.closest(doneSel)) { downloaded = true; setTimeout(update, 0); } });
    new MutationObserver(update).observe(stepsHost, { subtree: true, attributes: true, attributeFilter: ['disabled'] });
    document.addEventListener('i18n:change', label);
    label(); update();
  }

  // ---------- work auto-save ----------
  if (OWN_DRAFTS.includes(file) || document.body.hasAttribute('data-no-autosave')) return;
  const KEY = 'migaWork:' + file, MAX = 100000;
  const skip = el => !el.id || el.closest('.mkb,.miga-tutorial,.miga-menu,.miga-toast,.miga-bar,[data-no-autosave]') || /^(file|password|hidden|button|submit|reset|image)$/i.test(el.type || '');
  const fields = () => Array.from(root.querySelectorAll('input, textarea, select')).filter(el => !skip(el));
  const valueOf = el => el.type === 'checkbox' || el.type === 'radio' ? !!el.checked : el.value;
  const isText = el => el.tagName === 'TEXTAREA' || el.tagName === 'INPUT' && /^(text|search|email|url|tel|number|)$/i.test(el.type || '');
  let defaults = null;
  function snapshot() {
    const v = {};
    fields().forEach(el => { const x = valueOf(el); if (typeof x === 'string' && x.length > MAX) return; v[el.id] = x; });
    return v;
  }
  // Only worth saving if something typed differs from how the page started.
  function meaningful(v) { return fields().some(el => isText(el) && typeof v[el.id] === 'string' && v[el.id].trim() && v[el.id] !== (defaults || {})[el.id]); }
  let timer = null, restoring = false;
  function save() {
    if (restoring || !defaults) return;
    const v = snapshot();
    if (meaningful(v)) ls.set(KEY, { t: Date.now(), v }); else ls.del(KEY);
  }
  const later = () => { clearTimeout(timer); timer = setTimeout(save, 700); };
  document.addEventListener('input', e => { if (root.contains(e.target)) later(); }, true);
  document.addEventListener('change', e => { if (root.contains(e.target)) later(); }, true);
  window.addEventListener('pagehide', () => { if (timer) { clearTimeout(timer); save(); } });

  function apply(v) {
    restoring = true;
    Object.keys(v || {}).forEach(id => {
      const el = document.getElementById(id); if (!el || skip(el) || !root.contains(el)) return;
      if (el.type === 'checkbox' || el.type === 'radio') { if (el.checked === !!v[id]) return; el.checked = !!v[id]; }
      else if (el.tagName === 'SELECT') { if (!Array.from(el.options).some(o => o.value === v[id]) || el.value === v[id]) return; el.value = v[id]; }
      else { if (el.value === v[id]) return; el.value = v[id]; }
      el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true }));
    });
    restoring = false; later();
  }
  const ago = t => { const m = Math.round((Date.now() - t) / 60000); return m < 1 ? 'just now' : m < 60 ? m + ' min ago' : m < 1440 ? Math.round(m / 60) + ' h ago' : Math.round(m / 1440) + ' day' + (m >= 2880 ? 's' : '') + ' ago'; };
  function toast(html, yes, no, yesLabel) {
    const t = document.createElement('div'); t.className = 'miga-toast'; t.setAttribute('role', 'status');
    t.innerHTML = '<span>' + html + '</span><button type="button" class="yes">' + (yesLabel || 'Restore') + '</button><button type="button" class="no">Dismiss</button>';
    document.body.appendChild(t);
    t.querySelector('.yes').onclick = () => { t.remove(); yes && yes(); };
    t.querySelector('.no').onclick = () => { t.remove(); no && no(); };
    setTimeout(() => { if (t.isConnected) t.remove(); }, 30000);
  }

  // Menu: save / open a work file.
  const workBtn = document.createElement('button'); workBtn.type = 'button'; workBtn.textContent = '💾 My work'; workBtn.setAttribute('aria-haspopup', 'true');
  bar.appendChild(workBtn);
  let menu = null;
  workBtn.onclick = e => {
    e.stopPropagation();
    if (menu) { menu.remove(); menu = null; return; }
    menu = document.createElement('div'); menu.className = 'miga-menu miga-bar';
    menu.innerHTML = '<small>What you type here is auto-saved in this browser.</small><button type="button" data-a="save">💾 Save my work to a file (.miga)</button><button type="button" data-a="open">📂 Open a saved work file</button><button type="button" data-a="clear">🗑 Clear the auto-saved copy</button>';
    document.body.appendChild(menu);
    const r = workBtn.getBoundingClientRect();
    menu.style.top = (nav ? r.bottom + scrollY + 6 : r.top + scrollY - 150) + 'px'; menu.style.left = Math.max(8, Math.min(innerWidth - 250, r.right - 240)) + 'px';
    menu.onclick = ev => {
      const a = ev.target.closest('[data-a]'); if (!a) return;
      menu.remove(); menu = null;
      if (a.dataset.a === 'save') {
        const data = { app: 'MigaBuilder', tool: file, saved: new Date().toISOString(), fields: snapshot() };
        const u = URL.createObjectURL(new Blob([JSON.stringify(data, null, 1)], { type: 'application/json' })), link = document.createElement('a');
        link.href = u; link.download = file.replace('.html', '') + '-' + new Date().toISOString().slice(0, 10) + '.miga'; link.click(); setTimeout(() => URL.revokeObjectURL(u), 1500);
      } else if (a.dataset.a === 'open') {
        const inp = document.createElement('input'); inp.type = 'file'; inp.accept = '.miga,.json';
        inp.onchange = async () => {
          const f = inp.files[0]; if (!f) return;
          try {
            const d = JSON.parse(await f.text());
            if (!d || !d.fields) throw new Error('not a work file');
            if (d.tool && d.tool !== file && !confirm('This file was saved from ' + d.tool + '. Load it here anyway?')) return;
            apply(d.fields);
          } catch (err) { alert('This is not a MigaBuilder work file.'); }
        };
        inp.click();
      } else { ls.del(KEY); }
    };
  };
  document.addEventListener('click', e => { if (menu && !menu.contains(e.target) && e.target !== workBtn) { menu.remove(); menu = null; } });

  // Let the tool finish setting up, then remember its starting values and offer the saved copy.
  setTimeout(() => {
    defaults = snapshot();
    const saved = ls.get(KEY, null);
    if (!saved || !saved.v || !meaningful(saved.v)) return;
    const differs = Object.keys(saved.v).some(id => defaults[id] !== undefined && defaults[id] !== saved.v[id]);
    if (!differs) return;
    toast('📝 You have work from ' + ago(saved.t) + ' saved in this browser. Restore it?', () => apply(saved.v), () => ls.del(KEY));
  }, 900);
})();
