// ============================================================
// Vigus'B — Repair Tunnel UI  (5 étapes)
// Requires: repair-tunnel.js  (window.REPAIR_DATA global)
// Requires: window.VRT_CONFIG  (supabaseFunctionsUrl, supabaseAnonKey)
// ============================================================

(function () {
  'use strict';

  // ── Brand display names ────────────────────────────────────────────────
  const BRAND_LABELS = {
    'APPLE': 'Apple',
    'SAMSUNG GALAXY A': 'Samsung Galaxy A',
    'SAMSUNG GALAXY S': 'Samsung Galaxy S',
    'SAMSUNG GALAXY Z': 'Samsung Galaxy Z',
    'REDMI': 'Redmi',
    'XIAOMI': 'Xiaomi',
    'OPPO': 'Oppo',
    'GOOGLE': 'Google Pixel',
    'POCO': 'Poco',
    'HONOR': 'Honor',
    'HUAWEI': 'Huawei',
    'VIVO': 'Vivo',
    'REALME': 'Realme',
    'TCL': 'TCL',
    'MOTOROLA': 'Motorola',
    'ONEPLUS': 'OnePlus',
    'SONY': 'Sony',
    'NOKIA': 'Nokia',
  };

  // ── Repair type display names & icons ──────────────────────────────────
  const REPAIR_META = {
    'ECRAN': {
      label: 'Écran',
      desc: 'Remplacement de la dalle et du tactile',
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="9" y1="7" x2="15" y2="7" opacity=".4"/><path d="M10 11l1.5 1.5L14 9" stroke-dasharray="3 1.5"/><circle cx="12" cy="20" r=".75" fill="currentColor" stroke="none"/></svg>`,
    },
    'BATTERIE': {
      label: 'Batterie',
      desc: 'Remplacement de la batterie (santé garantie)',
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="18" height="10" rx="2"/><path d="M22 11v2" stroke-width="2"/><path d="M7 12h4m2 0h2" opacity=".5"/></svg>`,
    },
    'VITRE ARRIERE': {
      label: 'Vitre arrière',
      desc: 'Remplacement de la vitre ou coque arrière',
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="18.5" r="1.25" fill="currentColor" stroke="none"/><path d="M9 6h6M9 9h4" opacity=".4"/><path d="M10 13l1 1.5 2-3" opacity=".7"/></svg>`,
    },
    'APPAREIL PHOTO ARRIERE': {
      label: 'Appareil photo arrière',
      desc: 'Remplacement du module caméra principal',
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
    },
    'HUBLOT APPAREIL PHOTO': {
      label: 'Hublot appareil photo',
      desc: 'Remplacement de la lentille de protection',
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/></svg>`,
    },
    'CHASSIS COMPLET': {
      label: 'Châssis complet',
      desc: 'Remplacement du cadre et de la structure',
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><rect x="7" y="7" width="10" height="10" rx="1" opacity=".4"/><path d="M3 9h4M3 15h4M17 9h4M17 15h4M9 3v4M15 3v4M9 17v4M15 17v4" stroke-width="1.5"/></svg>`,
    },
    'TIROIR SIM': {
      label: 'Tiroir SIM',
      desc: 'Remplacement du tiroir de carte SIM',
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 4v4H4M4 14h5v6" opacity=".5"/><rect x="9" y="9" width="6" height="6" rx="1" opacity=".6"/></svg>`,
    },
    'CONNECTEUR DE CHARGE': {
      label: 'Connecteur de charge',
      desc: 'Remplacement du port de chargement',
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21v-4M12 3v4M8 17h8a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2zM9 11V7M15 11V7"/></svg>`,
    },
    'HP': {
      label: 'Haut-parleur',
      desc: 'Remplacement du haut-parleur principal',
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`,
    },
    'ECOUTEUR': {
      label: 'Écouteur interne',
      desc: "Remplacement de l'écouteur de conversation",
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>`,
    },
  };

  // ── Static data: Protection ────────────────────────────────────────────
  const PROTECTION = [
    { id: 'p_hydrogel_classique', name: 'Film Hydrogel Classique', desc: 'Protection anti-chocs transparente', prix: 14.99 },
    { id: 'p_hydrogel_mat', name: 'Film Hydrogel Mat', desc: 'Protection anti-reflets et anti-traces', prix: 14.99 },
    { id: 'p_hydrogel_privacy', name: 'Film Hydrogel Privacy', desc: 'Protection anti-regards indiscrets', prix: 19.99 },
  ];

  // ── Static data: Services ──────────────────────────────────────────────
  const SERVICES = [
    { id: 's_transfert', name: 'Transfert de données', desc: 'Sauvegarde et transfert de vos données', prix: 29.99 },
    { id: 's_compte', name: 'Création compte iCloud / Google', desc: 'Configuration de votre compte cloud', prix: 29.99 },
    { id: 's_raz', name: 'Remise à zéro', desc: "Réinitialisation complète de l'appareil", prix: 9.99 },
    { id: 's_mef', name: 'Mise en fonction', desc: 'Paramétrage complet de votre appareil', prix: 29.99 },
    { id: 's_nettoyage_charge', name: 'Nettoyage connecteur de charge', desc: 'Nettoyage du port de charge', prix: 14.99 },
    { id: 's_nettoyage_hp', name: 'Nettoyage haut-parleur', desc: 'Ouverture et nettoyage des haut-parleurs', prix: 39.99 },
    { id: 's_recuperation', name: 'Récupération de données', desc: 'Récupération sur appareil hors service', prix: 69.99 },
    { id: 's_virus', name: 'Suppression virus', desc: "Nettoyage et sécurisation de l'appareil", prix: 29.99 },
  ];

  // ── Stores → Magasin codes ────────────────────────────────────────────
  const STORES_MAP = [
    { name: 'Nantes Centre', code: 'NAN-C' },
    { name: 'Nantes Paridis', code: 'NAN-P' },
    { name: 'Rennes Centre', code: 'REN-C' },
    { name: 'Rennes Colombia', code: 'REN-CO' },
    { name: 'Angers', code: 'ANG' },
    { name: 'Toulouse', code: 'TLS' },
    { name: 'Bordeaux', code: 'BDX' },
    { name: 'Le Mans Centre', code: 'LMN-C' },
    { name: 'Le Mans Jacobins', code: 'LMN-J' },
    { name: 'Saint-Nazaire', code: 'SNZ' },
    { name: 'Guérande', code: 'GRD' },
    { name: 'Trignac', code: 'TRG' },
    { name: 'Saint-Grégoire', code: 'SGR' },
    { name: 'Tours Gare', code: 'TRS' },
  ];

  // ── State ──────────────────────────────────────────────────────────────
  let state = {
    step: 1,
    brand: null,
    model: null,
    selections: {},
    contact: {},
    magasinCode: null,
    rdv_date: null,
    rdv_heure: null,
  };

  const TOTAL_STEPS = 5;

  // ── DOM refs ───────────────────────────────────────────────────────────
  let $ = id => document.getElementById(id);

  // ── Init ───────────────────────────────────────────────────────────────
  function init() {
    if (typeof REPAIR_DATA === 'undefined') {
      console.error('[VRT] REPAIR_DATA not found — ensure repair-tunnel.js is loaded first');
      return;
    }

    buildProgressBar();
    initSearch();
    initCounter();
    renderProtection();
    renderServices();
    populateStores();
    initForm();
    initRdvStep();
  }

  // ── Progress Bar ───────────────────────────────────────────────────────
  function buildProgressBar() {
    const bar = $('vrt-progress');
    if (!bar) return;
    const labels = ['Appareil', 'Réparation', 'Coordonnées', 'RDV', 'Devis'];
    let html = '';
    labels.forEach((lbl, i) => {
      const n = i + 1;
      const st = n === 1 ? 'active' : 'pending';
      html += `<div class="vrt__prog-step" id="vrt-prog-${n}" data-state="${st}">
        <div class="vrt__prog-dot">${n}</div>
        <span class="vrt__prog-label">${lbl}</span>
      </div>`;
      if (n < labels.length) {
        html += `<div class="vrt__prog-line" id="vrt-line-${n}"></div>`;
      }
    });
    bar.innerHTML = html;
  }

  function updateProgress(step) {
    for (let n = 1; n <= TOTAL_STEPS; n++) {
      const el = $(`vrt-prog-${n}`);
      if (!el) continue;
      if (n < step) el.dataset.state = 'done';
      else if (n === step) el.dataset.state = 'active';
      else el.dataset.state = 'pending';
      const dot = el.querySelector('.vrt__prog-dot');
      if (n < step) dot.innerHTML = checkSvg();
      else dot.textContent = n;
    }
    for (let n = 1; n < TOTAL_STEPS; n++) {
      const line = $(`vrt-line-${n}`);
      if (line) line.dataset.done = n < step ? 'true' : 'false';
    }
  }

  function checkSvg() {
    return `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><polyline points="2,6 5,9 10,3"/></svg>`;
  }

  // ── Step navigation ────────────────────────────────────────────────────
  function goToStep(n) {
    for (let i = 1; i <= TOTAL_STEPS; i++) {
      const el = $(`vrt-step-${i}`);
      if (el) el.hidden = (i !== n);
    }
    state.step = n;
    updateProgress(n);

    const counter = $('vrt-counter');
    if (counter) counter.hidden = (n !== 2);

    window.scrollTo({ top: document.getElementById('vrt-anchor')?.offsetTop ?? 0, behavior: 'smooth' });
  }

  // ── Step 1 — Search ────────────────────────────────────────────────────
  function initSearch() {
    const input = $('vrt-search-input');
    const dropdown = $('vrt-dropdown');
    const btn = $('vrt-search-btn');
    if (!input || !dropdown) return;

    input.addEventListener('input', () => {
      const q = input.value.trim();
      if (q.length < 2) {
        dropdown.classList.remove('is-open');
        dropdown.innerHTML = '';
        return;
      }
      const results = searchModels(q);
      renderDropdown(results, dropdown);
    });

    document.addEventListener('click', e => {
      if (!e.target.closest('.vrt__search-wrap')) {
        dropdown.classList.remove('is-open');
      }
    });

    btn.addEventListener('click', () => {
      input.focus();
      const q = input.value.trim();
      if (q.length >= 2) {
        const results = searchModels(q);
        renderDropdown(results, dropdown);
      }
    });

    input.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        dropdown.classList.remove('is-open');
        input.blur();
      }
    });
  }

  function searchModels(q) {
    const lq = q.toLowerCase();
    const groups = [];
    for (const [brand, models] of Object.entries(REPAIR_DATA)) {
      const matches = Object.keys(models).filter(m => m.toLowerCase().includes(lq) || BRAND_LABELS[brand]?.toLowerCase().includes(lq));
      if (matches.length) groups.push({ brand, label: BRAND_LABELS[brand] || brand, models: matches });
    }
    return groups;
  }

  function renderDropdown(groups, dropdown) {
    if (!groups.length) {
      dropdown.innerHTML = `<div class="vrt__dd-empty">Aucun modèle trouvé — vérifiez l'orthographe</div>`;
      dropdown.classList.add('is-open');
      return;
    }
    let html = '';
    groups.forEach(g => {
      html += `<div class="vrt__dd-group-label">${g.label}</div>`;
      g.models.forEach(m => {
        html += `<button class="vrt__dd-item" data-brand="${g.brand}" data-model="${m}">${m}</button>`;
      });
    });
    dropdown.innerHTML = html;
    dropdown.classList.add('is-open');

    dropdown.querySelectorAll('.vrt__dd-item').forEach(btn => {
      btn.addEventListener('click', () => {
        selectModel(btn.dataset.brand, btn.dataset.model);
        dropdown.classList.remove('is-open');
        $('vrt-search-input').value = btn.dataset.model;
      });
    });
  }

  function selectModel(brand, model) {
    state.brand = brand;
    state.model = model;
    state.selections = {};

    const backLabel = BRAND_LABELS[brand] ? `${BRAND_LABELS[brand]} ${model}` : model;
    const backBtn = $('vrt-back-step1');
    if (backBtn) {
      backBtn.querySelector('.vrt__back-device').textContent = backLabel;
      backBtn.onclick = () => goToStep(1);
    }

    renderRepairs(brand, model);
    updateCounter();
    goToStep(2);
  }

  // ── Step 2 — Repairs / Protection / Services ────────────────────────────
  function isDevisPrice(v) {
    return !v || v === 'DEVIS' || v === 'SUR DEVIS' || v === 'x' || v === 'X' || isNaN(Number(v));
  }

  function renderRepairs(brand, model) {
    const grid = $('vrt-repairs-grid');
    if (!grid) return;
    const repairs = REPAIR_DATA[brand]?.[model] ?? {};
    let html = '<div class="vrt__cards vrt__cards-grid">';
    let hasAny = false;
    for (const [key, data] of Object.entries(repairs)) {
      const meta = REPAIR_META[key];
      if (!meta) continue;
      hasAny = true;
      const id = `r_${brand}_${model}_${key}`.replace(/\s+/g, '_');
      const devis = isDevisPrice(data.prix);
      const hasBonus = !devis && !isDevisPrice(data.bonus) && Number(data.bonus) > 0;
      let priceHtml = '';
      if (devis) {
        priceHtml = `<span class="vrt__price-devis">Sur devis</span>`;
      } else if (hasBonus) {
        priceHtml = `<span class="vrt__price-full">${fmt(data.prix)}</span>
          <span class="vrt__price-bonus">${fmt(data.bonus)}</span>
          <span class="vrt__price-bonus-tag">Bonus Réparation</span>`;
      } else {
        priceHtml = `<span class="vrt__price-single">${fmt(data.prix)}</span>`;
      }
      html += cardHtml(id, meta.icon, meta.label, meta.desc, priceHtml, { name: meta.label, prix: devis ? null : Number(data.bonus || data.prix), isDevis: devis });
    }
    if (!hasAny) html += `<p style="color:#6B6B6B;font-size:.9rem;padding:12px 0">Aucune réparation référencée pour ce modèle.</p>`;
    html += '</div>';
    grid.innerHTML = html;
    bindCards(grid);
  }

  function renderProtection() {
    const grid = $('vrt-protection-grid');
    if (!grid) return;
    let html = '<div class="vrt__cards vrt__cards-grid">';
    PROTECTION.forEach(p => {
      const priceHtml = `<span class="vrt__price-single">${fmt(p.prix)}</span>`;
      const icon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`;
      html += cardHtml(p.id, icon, p.name, p.desc, priceHtml, { name: p.name, prix: p.prix, isDevis: false });
    });
    html += '</div>';
    grid.innerHTML = html;
    bindCards(grid);
  }

  function renderServices() {
    const grid = $('vrt-services-grid');
    if (!grid) return;
    let html = '<div class="vrt__cards vrt__cards-grid">';
    SERVICES.forEach(s => {
      const priceHtml = `<span class="vrt__price-single">${fmt(s.prix)}</span>`;
      const icon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.42 1.42M4.93 4.93l1.42 1.42M19.07 19.07l-1.42-1.42M4.93 19.07l1.42-1.42M21 12h-2M5 12H3M12 21v-2M12 5V3"/></svg>`;
      html += cardHtml(s.id, icon, s.name, s.desc, priceHtml, { name: s.name, prix: s.prix, isDevis: false });
    });
    html += '</div>';
    grid.innerHTML = html;
    bindCards(grid);
  }

  function cardHtml(id, icon, name, desc, priceHtml, data) {
    return `<div class="vrt__card" data-id="${id}" data-name="${escAttr(data.name)}" data-prix="${data.prix ?? ''}" data-devis="${data.isDevis ? '1' : '0'}">
      <div class="vrt__card-icon">${icon}</div>
      <div class="vrt__card-text">
        <p class="vrt__card-name">${esc(name)}</p>
        <p class="vrt__card-desc">${esc(desc)}</p>
      </div>
      <div class="vrt__card-price">${priceHtml}</div>
      <div class="vrt__card-check"></div>
    </div>`;
  }

  function bindCards(container) {
    container.querySelectorAll('.vrt__card').forEach(card => {
      card.addEventListener('click', () => toggleCard(card));
    });
  }

  function toggleCard(card) {
    const id = card.dataset.id;
    if (state.selections[id]) {
      delete state.selections[id];
      card.classList.remove('is-selected');
    } else {
      state.selections[id] = {
        name: card.dataset.name,
        prix: card.dataset.prix ? Number(card.dataset.prix) : null,
        isDevis: card.dataset.devis === '1',
      };
      card.classList.add('is-selected');
    }
    updateCounter();
  }

  // ── Counter ────────────────────────────────────────────────────────────
  function initCounter() {
    const btn = $('vrt-counter-btn');
    if (btn) btn.addEventListener('click', () => goToStep(3));
  }

  function updateCounter() {
    const counter = $('vrt-counter');
    if (!counter) return;
    const items = Object.values(state.selections);
    if (!items.length) {
      counter.hidden = true;
      return;
    }
    counter.hidden = false;
    const total = items.reduce((s, i) => s + (i.prix ?? 0), 0);
    const hasDevis = items.some(i => i.isDevis);
    const countLabel = $('vrt-counter-count');
    const totalLabel = $('vrt-counter-total');
    if (countLabel) countLabel.textContent = `${items.length} intervention${items.length > 1 ? 's' : ''}`;
    if (totalLabel) totalLabel.textContent = hasDevis ? `${fmt(total)} + sur devis` : fmt(total);
  }

  // ── Step 3 — Contact Form ──────────────────────────────────────────────
  function populateStores() {
    const select = $('vrt-store');
    if (!select) return;
    STORES_MAP.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.code;
      opt.textContent = s.name;
      select.appendChild(opt);
    });
  }

  function initForm() {
    const form = $('vrt-form');
    if (!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!validateForm()) return;

      const storeCode = $('vrt-store').value;
      const storeName = STORES_MAP.find(s => s.code === storeCode)?.name ?? storeCode;

      state.contact = {
        prenom: $('vrt-prenom').value.trim(),
        nom: $('vrt-nom').value.trim(),
        email: $('vrt-email').value.trim(),
        tel: $('vrt-tel').value.trim(),
        store: storeName,
      };
      state.magasinCode = storeCode;

      // Reset RDV state
      state.rdv_date = null;
      state.rdv_heure = null;
      const dateInput = $('vrt-rdv-date');
      if (dateInput) dateInput.value = '';
      const slotsContainer = $('vrt-slots-container');
      if (slotsContainer) slotsContainer.innerHTML = '<p class="vrt__slots-hint">Choisis une date pour voir les créneaux disponibles</p>';
      const nextBtn = $('vrt-rdv-next-btn');
      if (nextBtn) nextBtn.disabled = true;

      goToStep(4);
    });

    const backBtn = $('vrt-back-step2');
    if (backBtn) backBtn.addEventListener('click', () => goToStep(2));
  }

  function validateForm() {
    let ok = true;
    ['vrt-prenom', 'vrt-nom', 'vrt-email', 'vrt-tel', 'vrt-store'].forEach(id => {
      const el = $(id);
      if (!el || !el.value.trim()) {
        el && el.closest('.vrt__field')?.classList.add('has-error');
        ok = false;
      } else {
        el.closest('.vrt__field')?.classList.remove('has-error');
      }
    });
    const emailEl = $('vrt-email');
    if (emailEl && !emailEl.value.includes('@')) {
      emailEl.closest('.vrt__field')?.classList.add('has-error');
      ok = false;
    }
    return ok;
  }

  // ── Step 4 — RDV Slots ────────────────────────────────────────────────
  function initRdvStep() {
    const dateInput = $('vrt-rdv-date');
    if (!dateInput) return;

    // Set min/max dates
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 60);
    dateInput.min = formatDateISO(today);
    dateInput.max = formatDateISO(maxDate);

    dateInput.addEventListener('change', () => {
      const date = dateInput.value;
      if (date) {
        state.rdv_date = date;
        state.rdv_heure = null;
        const nextBtn = $('vrt-rdv-next-btn');
        if (nextBtn) nextBtn.disabled = true;
        fetchSlots(state.magasinCode, date);
      }
    });

    // Back button
    const backBtn = $('vrt-back-step3');
    if (backBtn) backBtn.addEventListener('click', () => goToStep(3));

    // Next button → go to step 5
    const nextBtn = $('vrt-rdv-next-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (state.rdv_date && state.rdv_heure) {
          renderSummary();
          goToStep(5);
        }
      });
    }
  }

  async function fetchSlots(magasinCode, date) {
    const container = $('vrt-slots-container');
    if (!container) return;
    container.innerHTML = '<p class="vrt__slots-loading">Chargement des créneaux...</p>';

    const config = window.VRT_CONFIG || {};
    if (!config.supabaseFunctionsUrl || !config.supabaseAnonKey) {
      container.innerHTML = '<p class="vrt__slots-error">Configuration manquante — contactez le magasin directement.</p>';
      return;
    }

    try {
      const url = `${config.supabaseFunctionsUrl}/availability?magasin=${encodeURIComponent(magasinCode)}&date=${date}`;
      const res = await fetch(url, {
        headers: {
          'apikey': config.supabaseAnonKey,
          'Authorization': `Bearer ${config.supabaseAnonKey}`,
        },
      });
      const data = await res.json();

      if (!res.ok) {
        container.innerHTML = `<p class="vrt__slots-error">${esc(data.error || 'Erreur serveur')}</p>`;
        return;
      }

      if (data.ferme) {
        container.innerHTML = '<p class="vrt__slots-error">Le magasin est fermé ce jour-là. Choisis un autre jour.</p>';
        return;
      }

      renderSlots(data.slots || [], container);
    } catch (err) {
      console.error('[VRT] Fetch slots error:', err);
      container.innerHTML = '<p class="vrt__slots-error">Impossible de charger les créneaux. Réessaie.</p>';
    }
  }

  function renderSlots(slots, container) {
    if (!slots.length) {
      container.innerHTML = '<p class="vrt__slots-error">Aucun créneau disponible ce jour.</p>';
      return;
    }

    let html = '<div class="vrt__slots-grid">';
    slots.forEach(slot => {
      const full = !slot.dispo;
      html += `<button class="vrt__slot${full ? ' vrt__slot--full' : ''}"
        data-heure="${slot.heure}"
        ${full ? 'disabled title="Complet"' : ''}
        type="button">${slot.heure}</button>`;
    });
    html += '</div>';
    container.innerHTML = html;

    // Bind slot clicks
    container.querySelectorAll('.vrt__slot:not(.vrt__slot--full)').forEach(btn => {
      btn.addEventListener('click', () => {
        // Deselect others
        container.querySelectorAll('.vrt__slot').forEach(b => b.classList.remove('vrt__slot--selected'));
        btn.classList.add('vrt__slot--selected');
        state.rdv_heure = btn.dataset.heure;
        const nextBtn = $('vrt-rdv-next-btn');
        if (nextBtn) nextBtn.disabled = false;
      });
    });
  }

  // ── Step 5 — Summary ───────────────────────────────────────────────────
  function renderSummary() {
    const container = $('vrt-summary');
    if (!container) return;
    const c = state.contact;
    const items = Object.values(state.selections);
    const total = items.reduce((s, i) => s + (i.prix ?? 0), 0);
    const hasDevis = items.some(i => i.isDevis);
    const monthly = (total / 4).toFixed(2);

    // Format date for display
    const rdvDateObj = new Date(state.rdv_date + 'T12:00:00');
    const rdvDateFr = rdvDateObj.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    let itemsHtml = '';
    items.forEach(item => {
      itemsHtml += `<div class="vrt__summary-item">
        <span class="vrt__summary-item-name">${esc(item.name)}</span>
        <span class="vrt__summary-item-price ${item.isDevis ? 'is-devis' : ''}">${item.isDevis ? 'Sur devis' : fmt(item.prix)}</span>
      </div>`;
    });
    if (!items.length) itemsHtml = `<p style="padding:20px 0;color:#6B6B6B;font-size:.9rem;text-align:center">Aucune intervention sélectionnée.</p>`;

    container.innerHTML = `
      <div class="vrt__summary-card">
        <div class="vrt__summary-header">
          <p class="vrt__summary-device">${esc(BRAND_LABELS[state.brand] || state.brand)} — ${esc(state.model)}</p>
          <p class="vrt__summary-date">RDV le ${esc(rdvDateFr)} à ${esc(state.rdv_heure)} · ${esc(c.store)}</p>
        </div>
        <div class="vrt__summary-body">${itemsHtml}</div>
        <div class="vrt__summary-footer">
          <div class="vrt__summary-total">
            <span class="vrt__summary-total-label">Total estimé${hasDevis ? '*' : ''}</span>
            <span class="vrt__summary-total-amount">${fmt(total)}${hasDevis ? '+' : ''}</span>
          </div>
          ${total > 0 ? `<p class="vrt__summary-alma">4 × ${monthly}€ sans frais avec Alma</p>` : ''}
          ${hasDevis ? `<p style="font-size:.75rem;color:#6B6B6B;margin-top:6px">* Certaines réparations nécessitent un devis en magasin.</p>` : ''}
        </div>
      </div>`;

    const reserveBtn = $('vrt-reserve-btn');
    if (reserveBtn) {
      reserveBtn.onclick = () => submitReservation();
    }

    const backBtn = $('vrt-back-step4');
    if (backBtn) backBtn.addEventListener('click', () => goToStep(4));
  }

  async function submitReservation() {
    const btn = $('vrt-reserve-btn');
    if (btn) { btn.disabled = true; btn.textContent = 'Envoi en cours...'; }

    const c = state.contact;
    const items = Object.values(state.selections);
    const total = items.reduce((s, i) => s + (i.prix ?? 0), 0);

    const payload = {
      prenom: c.prenom,
      nom: c.nom,
      email: c.email,
      telephone: c.tel,
      marque: BRAND_LABELS[state.brand] || state.brand,
      modele: state.model,
      reparations: items.map(i => ({ label: i.name, prix: i.prix ?? 0 })),
      total_estime: total,
      magasin_code: state.magasinCode,
      rdv_date: state.rdv_date,
      rdv_heure: state.rdv_heure,
    };

    const config = window.VRT_CONFIG || {};

    try {
      if (!config.supabaseFunctionsUrl || !config.supabaseAnonKey) {
        throw new Error('Config manquante');
      }

      const res = await fetch(`${config.supabaseFunctionsUrl}/create-reparation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': config.supabaseAnonKey,
          'Authorization': `Bearer ${config.supabaseAnonKey}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur serveur');

      showConfirmation(data.ticket_number);
    } catch (err) {
      console.error('[VRT] Supabase fail, fallback /contact:', err);
      // Fallback: submit to Shopify contact form
      try {
        const form = $('vrt-hidden-form');
        if (form) {
          const bodyLines = [
            `Appareil : ${BRAND_LABELS[state.brand] || state.brand} — ${state.model}`,
            `Magasin : ${c.store}`,
            `RDV souhaité : ${state.rdv_date} à ${state.rdv_heure}`,
            '',
            'Interventions :',
            ...items.map(i => `• ${i.name} — ${i.isDevis ? 'Sur devis' : fmt(i.prix)}`),
            '',
            `Total estimé : ${fmt(total)}`,
            '',
            `Client : ${c.prenom} ${c.nom}`,
            `Email : ${c.email}`,
            `Téléphone : ${c.tel}`,
          ];
          $('vrt-hf-name').value = `${c.prenom} ${c.nom}`;
          $('vrt-hf-email').value = c.email;
          $('vrt-hf-phone').value = c.tel;
          $('vrt-hf-body').value = bodyLines.join('\n');
          const fd = new FormData(form);
          await fetch(form.action, { method: 'POST', body: fd });
        }
      } catch (_) {}

      // Show basic confirmation (no ticket)
      showConfirmation(null);
    }
  }

  function showConfirmation(ticketNumber) {
    const reserveBtn = $('vrt-reserve-btn');
    if (reserveBtn) reserveBtn.hidden = true;
    const backBtn = $('vrt-back-step4');
    if (backBtn) backBtn.hidden = true;

    const conf = $('vrt-confirmation');
    if (conf) conf.hidden = false;

    const c = state.contact;
    const rdvDateObj = new Date(state.rdv_date + 'T12:00:00');
    const rdvDateFr = rdvDateObj.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

    // Ticket
    const ticketEl = $('vrt-conf-ticket');
    if (ticketEl) {
      if (ticketNumber) {
        ticketEl.innerHTML = `<span class="vrt__ticket-badge">${esc(ticketNumber)}</span>`;
      } else {
        ticketEl.innerHTML = '';
      }
    }

    // Recap
    const recapEl = $('vrt-conf-recap');
    if (recapEl) {
      recapEl.innerHTML = `
        <p><strong>${esc(BRAND_LABELS[state.brand] || state.brand)} ${esc(state.model)}</strong></p>
        <p>${esc(rdvDateFr)} à ${esc(state.rdv_heure)} — ${esc(c.store)}</p>`;
    }

    // Email message
    const emailMsg = $('vrt-conf-email-msg');
    if (emailMsg) {
      emailMsg.textContent = ticketNumber
        ? `Tu vas recevoir un email de confirmation à ${c.email}`
        : `Votre demande a été transmise au magasin ${c.store}. Vous serez contacté rapidement.`;
    }

    // Copy button
    const copyBtn = $('vrt-conf-copy');
    if (copyBtn && ticketNumber) {
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(ticketNumber).then(() => {
          copyBtn.textContent = 'Copié !';
          setTimeout(() => { copyBtn.textContent = 'Copier le ticket'; }, 2000);
        });
      };
    } else if (copyBtn) {
      copyBtn.hidden = true;
    }

    // Calendar button (.ics)
    const calBtn = $('vrt-conf-calendar');
    if (calBtn && state.rdv_date && state.rdv_heure) {
      calBtn.onclick = () => downloadICS(ticketNumber);
    } else if (calBtn) {
      calBtn.hidden = true;
    }
  }

  function downloadICS(ticketNumber) {
    const c = state.contact;
    const [hh, mm] = state.rdv_heure.split(':');
    const start = new Date(`${state.rdv_date}T${hh}:${mm}:00`);
    const end = new Date(start.getTime() + 30 * 60 * 1000);

    const pad = n => String(n).padStart(2, '0');
    const toICS = d => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;

    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//VigusB//VRT//FR',
      'BEGIN:VEVENT',
      `DTSTART:${toICS(start)}`,
      `DTEND:${toICS(end)}`,
      `SUMMARY:Réparation Vigus'B${ticketNumber ? ' — ' + ticketNumber : ''}`,
      `DESCRIPTION:${BRAND_LABELS[state.brand] || state.brand} ${state.model} — ${c.store}`,
      `LOCATION:${c.store}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vigusb-rdv${ticketNumber ? '-' + ticketNumber : ''}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ── Helpers ────────────────────────────────────────────────────────────
  function fmt(n) {
    return Number(n).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 });
  }
  function esc(s) {
    return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function escAttr(s) {
    return String(s ?? '').replace(/"/g, '&quot;');
  }
  function formatDateISO(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  // ── Start ──────────────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
