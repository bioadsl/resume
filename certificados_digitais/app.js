(function () {
  'use strict';

  const STORAGE_KEY = 'portfolio-theme';
  const ALLOWED_EXT = ['.pdf', '.jpg', '.jpeg', '.png', '.webp'];
  const SAFE_PATH_RE = /^[A-Za-z0-9_\-À-ÿ .]+\.(pdf|jpg|jpeg|png|webp)$/i;

  const state = {
    manifest: null,
    records: [],
    filtered: [],
    selected: new Set(),
    filters: {
      search: '',
      category: '',
      year: '',
      type: '',
    },
    sort: 'date-desc',
    jsZipReady: typeof window.JSZip !== 'undefined',
    fileSaverReady: typeof window.saveAs !== 'undefined',
  };

  const els = {};

  const CAT_ALIASES = {
    'Qualidade & Certificações ISTQB': 'ISTQB',
    'Governança, Risco & Normas': 'Governança',
    'Automação de Testes': 'Automação',
    'Linguagens & Desenvolvimento': 'Desenvolvimento',
    'DevOps & CI/CD': 'DevOps',
    'Metodologias, QA & Gestão': 'Gestão',
    'IA, Dados & Inovação': 'IA',
  };

  function qs(id) { return document.getElementById(id); }

  function init() {
    cacheElements();
    initTheme();
    bindEvents();
    bootstrap();
    setYear();
  }

  function cacheElements() {
    els.themeToggle = qs('themeToggle');
    els.searchInput = qs('searchInput');
    els.clearSearch = qs('clearSearch');
    els.countLabel = qs('countLabel');
    els.categoryChips = qs('categoryChips');
    els.yearFilter = qs('yearFilter');
    els.typeFilter = qs('typeFilter');
    els.sortSelect = qs('sortSelect');
    els.selectAll = qs('selectAllToggle');
    els.selectionLabel = qs('selectionLabel');
    els.bulkInfo = qs('bulkInfo');
    els.bulkBadge = qs('bulkBadge');
    els.bulkDownloadBtn = qs('bulkDownloadBtn');
    els.clearSelectionBtn = qs('clearSelectionBtn');
    els.heroStats = qs('heroStats');
    els.loadingState = qs('loadingState');
    els.errorState = qs('errorState');
    els.errorMessage = qs('errorMessage');
    els.emptyState = qs('emptyState');
    els.retryBtn = qs('retryBtn');
    els.certGrid = qs('certGrid');
    els.previewModal = qs('previewModal');
    els.previewBackdrop = document.querySelector('#previewModal .modal__backdrop');
    els.previewClose = qs('previewClose');
    els.previewTitle = qs('previewTitle');
    els.previewDesc = qs('previewDesc');
    els.previewBody = qs('previewBody');
    els.previewFooter = qs('previewFooter');
    els.previewDownload = qs('previewDownload');
    els.toast = qs('toast');
  }

  function initTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') {
      document.documentElement.setAttribute('data-theme', saved);
    }
  }

  function toggleTheme() {
    const cur = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(STORAGE_KEY, next);
  }

  function bindEvents() {
    els.themeToggle && els.themeToggle.addEventListener('click', toggleTheme);
    els.searchInput.addEventListener('input', onSearchInput);
    els.clearSearch.addEventListener('click', function () {
      els.searchInput.value = '';
      state.filters.search = '';
      els.clearSearch.hidden = true;
      refreshFilters();
      els.searchInput.focus();
    });
    els.yearFilter.addEventListener('change', function (e) {
      state.filters.year = e.target.value; refreshFilters();
    });
    els.typeFilter.addEventListener('change', function (e) {
      state.filters.type = e.target.value; refreshFilters();
    });
    els.sortSelect.addEventListener('change', function (e) {
      state.sort = e.target.value; applySort(); renderGrid();
    });
    els.selectAll.addEventListener('change', function (e) {
      if (e.target.checked) {
        state.filtered.forEach(function (r) { state.selected.add(r.file); });
      } else {
        state.filtered.forEach(function (r) { state.selected.delete(r.file); });
      }
      renderSelection();
      renderGrid();
    });
    els.clearSelectionBtn.addEventListener('click', function () {
      state.selected.clear();
      renderSelection();
      renderGrid();
    });
    els.bulkDownloadBtn.addEventListener('click', startBulkDownload);
    els.retryBtn.addEventListener('click', bootstrap);

    els.previewClose.addEventListener('click', closePreview);
    els.previewBackdrop.addEventListener('click', closePreview);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !els.previewModal.hidden) closePreview();
    });

    // delegação: cliques no grid
    els.certGrid.addEventListener('click', onGridClick);
  }

  async function bootstrap() {
    showOnly('loadingState');
    els.selectAll.checked = false;
    state.selected.clear();
    renderSelection();
    try {
      const resp = await fetch('./manifest.json', { cache: 'no-cache' });
      if (!resp.ok) throw new Error('Falha HTTP: ' + resp.status);
      const manifest = await resp.json();
      if (!manifest || !Array.isArray(manifest.files)) {
        throw new Error('Manifesto inválido.');
      }
      state.manifest = manifest;
      state.records = sanitizeAndNormalize(manifest.files);
      buildFacetOptions();
      renderStats();
      refreshFilters();
      if (state.records.length === 0) {
        showOnly('emptyState');
      } else {
        showOnly('certGrid');
      }
    } catch (err) {
      console.error(err);
      els.errorMessage.textContent = err && err.message ? err.message : 'Erro desconhecido.';
      showOnly('errorState');
    }
  }

  function sanitizeAndNormalize(rawFiles) {
    const allowedExtLowerCase = ALLOWED_EXT.map(function (e) { return e.toLowerCase(); });
    const seen = new Set();
    return rawFiles
      .filter(function (r) {
        if (!r || typeof r.file !== 'string') return false;
        const f = r.file.trim();
        if (!SAFE_PATH_RE.test(f)) return false;
        const ext = '.' + f.split('.').pop().toLowerCase();
        if (allowedExtLowerCase.indexOf(ext) === -1) return false;
        if (seen.has(f)) return false;
        seen.add(f);
        return true;
      })
      .map(function (r) {
        const f = r.file.trim();
        const ext = f.split('.').pop().toLowerCase();
        const type = ext === 'pdf' ? 'pdf' : 'image';
        const issuedAt = r.issuedAt && typeof r.issuedAt === 'string' ? r.issuedAt : '';
        const issuedAtDate = issuedAt ? safeParseDate(issuedAt) : null;
        const year = issuedAtDate ? issuedAtDate.getUTCFullYear() : null;
        const size = typeof r.size === 'number' ? r.size : null;
        return {
          file: f,
          title: (r.title || f).toString().trim(),
          issuer: (r.issuer || 'Emissor não informado').toString().trim(),
          category: (r.category || 'Outros').toString().trim(),
          categoryIcon: (r.categoryIcon || '📜').toString().trim(),
          issuedAt: issuedAt,
          issuedAtDate: issuedAtDate,
          year: year,
          tags: Array.isArray(r.tags) ? r.tags.map(String) : [],
          summary: (r.summary || '').toString().trim(),
          credentialId: (r.credentialId || '').toString().trim(),
          ext: ext,
          type: type,
          size: size,
        };
      });
  }

  function safeParseDate(iso) {
    try {
      const parts = iso.split('-').map(function (p) { return parseInt(p, 10); });
      if (parts.length !== 3) return null;
      if (parts.some(isNaN)) return null;
      const d = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2], 0, 0, 0));
      if (isNaN(d.getTime())) return null;
      return d;
    } catch (_) { return null; }
  }

  function buildFacetOptions() {
    // categoria chips com contadores
    const catMap = new Map();
    catMap.set('Todas', state.records.length);
    state.records.forEach(function (r) {
      catMap.set(r.category, (catMap.get(r.category) || 0) + 1);
    });

    const frag = document.createDocumentFragment();
    const orderedCats = ['Todas'].concat(
      Array.from(catMap.keys()).filter(function (k) { return k !== 'Todas'; }).sort()
    );
    orderedCats.forEach(function (cat) {
      const count = catMap.get(cat);
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'chip';
      chip.setAttribute('role', 'tab');
      chip.setAttribute('aria-pressed', cat === 'Todas' ? 'true' : 'false');
      chip.dataset.category = cat === 'Todas' ? '' : cat;
      const label = cat === 'Todas' ? 'Todos' : (CAT_ALIASES[cat] || cat);
      chip.innerHTML =
        '<span>' + escapeHtml(label) + '</span>' +
        '<span class="chip-count">' + count + '</span>';
      chip.addEventListener('click', function () {
        state.filters.category = chip.dataset.category;
        Array.prototype.forEach.call(els.categoryChips.children, function (c) {
          c.setAttribute('aria-pressed', String(c === chip));
        });
        refreshFilters();
      });
      frag.appendChild(chip);
    });
    els.categoryChips.innerHTML = '';
    els.categoryChips.appendChild(frag);

    // anos
    const yearOpts = Array.from(new Set(state.records
      .map(function (r) { return r.year; })
      .filter(function (y) { return typeof y === 'number'; })))
      .sort(function (a, b) { return b - a; });
    const currentYear = state.filters.year;
    els.yearFilter.innerHTML = '<option value="">Todos os anos</option>' +
      yearOpts.map(function (y) { return '<option value="' + y + '"' + (String(y) === currentYear ? ' selected' : '') + '>' + y + '</option>'; }).join('');
  }

  function renderStats() {
    const records = state.records;
    const cats = new Set(records.map(function (r) { return r.category; }));
    const years = new Set(records.map(function (r) { return r.year; }).filter(Boolean));
    const pdfCount = records.filter(function (r) { return r.type === 'pdf'; }).length;
    const imgCount = records.length - pdfCount;

    els.heroStats.innerHTML =
      '<div class="stat">' +
        '<div class="stat__label">Certificados</div>' +
        '<div class="stat__value">' + records.length + '<small> total</small></div>' +
      '</div>' +
      '<div class="stat">' +
        '<div class="stat__label">Categorias</div>' +
        '<div class="stat__value">' + cats.size + '<small> áreas</small></div>' +
      '</div>' +
      '<div class="stat">' +
        '<div class="stat__label">Anos cobertos</div>' +
        '<div class="stat__value">' + years.size + '<small> anos</small></div>' +
      '</div>';
  }

  function onSearchInput(e) {
    state.filters.search = e.target.value.trim();
    els.clearSearch.hidden = state.filters.search.length === 0;
    refreshFilters();
  }

  function refreshFilters() {
    const s = state.filters.search ? state.filters.search.toLowerCase() : '';
    const category = state.filters.category;
    const year = state.filters.year;
    const type = state.filters.type;

    state.filtered = state.records.filter(function (r) {
      if (category && r.category !== category) return false;
      if (year && String(r.year) !== String(year)) return false;
      if (type && r.type !== type) return false;
      if (!s) return true;
      const hay = [
        r.title, r.issuer, r.category, r.summary, r.credentialId
      ].concat(r.tags).filter(Boolean).join(' ').toLowerCase();
      return hay.indexOf(s) !== -1;
    });

    applySort();
    // seleção: remover itens que não existem mais (segurança)
    const validFiles = new Set(state.records.map(function (r) { return r.file; }));
    state.selected.forEach(function (f) { if (!validFiles.has(f)) state.selected.delete(f); });
    renderSelection();
    renderCounter();
    if (state.filtered.length === 0) {
      if (state.records.length === 0) {
        showOnly('emptyState');
      } else {
        els.emptyState.querySelector('h3').textContent = 'Nenhum certificado encontrado';
        els.emptyState.querySelector('p').textContent = 'Ajuste os filtros de busca, categoria, ano ou tipo.';
        showOnly('emptyState');
      }
    } else {
      showOnly('certGrid');
      renderGrid();
    }
  }

  function applySort() {
    const s = state.sort;
    state.filtered.sort(function (a, b) {
      switch (s) {
        case 'date-asc':  return cmpNum(dateKey(a), dateKey(b)) || cmpStr(a.title, b.title);
        case 'title-asc': return cmpStr(a.title, b.title);
        case 'title-desc': return cmpStr(b.title, a.title);
        case 'category-asc': return cmpStr(a.category, b.category) || cmpNum(dateKey(b), dateKey(a));
        case 'date-desc':
        default: return cmpNum(dateKey(b), dateKey(a)) || cmpStr(a.title, b.title);
      }
    });
  }

  function dateKey(r) { return r.issuedAtDate ? r.issuedAtDate.getTime() : -Infinity; }
  function cmpNum(a, b) { return a - b; }
  function cmpStr(a, b) { return a.localeCompare(b, 'pt-BR'); }

  function showOnly(id) {
    ['loadingState', 'errorState', 'emptyState', 'certGrid'].forEach(function (elId) {
      const el = qs(elId);
      if (!el) return;
      el.hidden = elId !== id;
    });
  }

  function renderCounter() {
    els.countLabel.textContent = state.filtered.length + ' certificado(s) de ' + state.records.length;
  }

  function renderSelection() {
    const total = state.filtered.length;
    const n = state.filtered.filter(function (r) { return state.selected.has(r.file); }).length;
    const allSelected = total > 0 && n === total;
    els.selectAll.checked = allSelected;
    els.selectAll.indeterminate = n > 0 && !allSelected;

    const badgeVisible = state.selected.size > 0;
    els.bulkBadge.hidden = !badgeVisible;
    els.bulkBadge.textContent = state.selected.size;
    els.clearSelectionBtn.hidden = !badgeVisible;
    els.bulkDownloadBtn.disabled = state.selected.size === 0 || !state.jsZipReady || !state.fileSaverReady;
    if (!state.jsZipReady || !state.fileSaverReady) {
      els.bulkDownloadBtn.title = 'Bibliotecas JSZip / FileSaver não carregadas.';
    } else {
      els.bulkDownloadBtn.removeAttribute('title');
    }
    if (state.selected.size > 0) {
      els.bulkInfo.hidden = false;
      els.bulkInfo.innerHTML =
        '<strong>' + state.selected.size + '</strong> certificado(s) selecionado(s) · tamanho estimado: <strong>' + formatBytes(estimateSelectedSize()) + '</strong>';
      els.selectionLabel.textContent = total === 0 ? 'Selecionar todos' : (allSelected ? 'Remover seleção' : 'Selecionar todos (filtrados: ' + total + ')');
    } else {
      els.bulkInfo.hidden = true;
      els.selectionLabel.textContent = 'Selecionar todos';
    }
  }

  function estimateSelectedSize() {
    let total = 0;
    state.records.forEach(function (r) {
      if (state.selected.has(r.file)) {
        total += typeof r.size === 'number' ? r.size : 500 * 1024;
      }
    });
    return total;
  }

  function renderGrid() {
    const frag = document.createDocumentFragment();
    state.filtered.forEach(function (r) {
      const card = document.createElement('article');
      card.className = 'cert';
      card.setAttribute('role', 'listitem');
      card.tabIndex = 0;
      card.dataset.file = r.file;
      card.setAttribute('aria-labelledby', 'cert-title-' + slug(r.file));

      const catBadge = '<div class="cert__cat" title="' + escapeHtml(r.category) + '">' +
        '<span aria-hidden="true">' + escapeHtml(r.categoryIcon) + '</span>' +
        escapeHtml(CAT_ALIASES[r.category] || r.category) +
      '</div>';

      const titleHtml = '<h3 class="cert__title" id="cert-title-' + slug(r.file) + '">' + escapeHtml(r.title) + '</h3>';
      const issuerHtml = '<p class="cert__issuer">' + escapeHtml(r.issuer) + '</p>';

      const metaParts = [];
      if (r.year) metaParts.push('<span aria-label="Ano de emissão">📅 ' + r.year + '</span>');
      metaParts.push('<span aria-label="Tipo do arquivo">' + (r.type === 'pdf' ? '📕 PDF' : '🖼️ Imagem') + '</span>');
      if (r.credentialId) metaParts.push('<span class="cert__credential" title="ID da credencial">ID ' + escapeHtml(r.credentialId) + '</span>');
      const metaHtml = '<div class="cert__meta">' + metaParts.join('') + '</div>';

      const tagsHtml = r.tags && r.tags.length ?
        '<div class="cert__tags">' + r.tags.slice(0, 5).map(function (t) { return '<span class="tag">' + escapeHtml(t) + '</span>'; }).join('') + '</div>'
        : '';

      const typePillClass = r.type === 'pdf' ? 'cert__type-pill cert__type-pill--pdf' : 'cert__type-pill cert__type-pill--image';
      const typePill = '<span class="' + typePillClass + '">' + (r.type === 'pdf' ? 'PDF' : 'IMG') + '</span>';

      const checkboxHtml =
        '<label class="cert__checkbox-wrap">' +
          '<input type="checkbox" data-action="toggle-select" value="' + escapeAttr(r.file) + '" ' +
            (state.selected.has(r.file) ? 'checked ' : '') +
            'aria-label="Selecionar certificado: ' + escapeAttr(r.title) + '">' +
        '</label>';

      const thumbHtml = '<div class="cert__thumb">' +
        checkboxHtml + typePill +
        '<div class="cert__thumb__inner">' + renderThumbContent(r) + '</div>' +
      '</div>';

      const actionsHtml =
        '<div class="cert__actions">' +
          '<button type="button" class="btn btn--outline" data-action="preview" data-file="' + escapeAttr(r.file) + '">' +
            '<svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>' +
            'Visualizar' +
          '</button>' +
          '<a class="btn btn--primary" href="' + escapeAttr(encodeURI(r.file)) + '" download="' + escapeAttr(r.file) + '" role="button" data-action="download" data-file="' + escapeAttr(r.file) + '">' +
            '<svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>' +
            'Baixar' +
          '</a>' +
        '</div>';

      card.innerHTML =
        thumbHtml +
        '<div class="cert__body">' + catBadge + titleHtml + issuerHtml + metaHtml + tagsHtml + '</div>' +
        actionsHtml;

      frag.appendChild(card);
    });
    els.certGrid.innerHTML = '';
    els.certGrid.appendChild(frag);
  }

  function renderThumbContent(r) {
    if (r.type === 'pdf') {
      return '<div class="pdf-placeholder" aria-hidden="true">' +
        '<div class="pdf-icon">PDF</div>' +
        '<div class="pdf-filename">' + escapeHtml(r.file) + '</div>' +
      '</div>';
    }
    return '<img src="' + escapeAttr(encodeURI(r.file)) + '" alt="Miniatura do certificado ' + escapeAttr(r.title) + '" loading="lazy" decoding="async" onerror="this.replaceWith(document.createTextNode(\'\'));" />';
  }

  function onGridClick(e) {
    const target = e.target;

    // checkbox -> toggle select
    const cb = target.closest && target.closest('[data-action="toggle-select"]');
    if (cb) {
      const file = cb.value;
      if (cb.checked) state.selected.add(file); else state.selected.delete(file);
      renderSelection();
      return;
    }

    // botão preview
    const previewBtn = target.closest && target.closest('[data-action="preview"]');
    if (previewBtn) {
      openPreview(previewBtn.dataset.file);
      e.preventDefault();
      return;
    }

    // card em si -> preview (exceto se clicou em checkbox ou botão download)
    const card = target.closest && target.closest('.cert');
    if (!card) return;
    const isAction = target.closest('[data-action]') || target.closest('a[download]');
    if (isAction) return;
    // Enter/Space já estava linkado ao foco do card -> preview
    openPreview(card.dataset.file);
  }

  // Suporte Enter/Space no card
  document.addEventListener('keydown', function (e) {
    const card = e.target && e.target.classList && e.target.classList.contains('cert') ? e.target : null;
    if (!card) return;
    if (e.key === 'Enter' || e.key === ' ') {
      openPreview(card.dataset.file);
      e.preventDefault();
    }
  });

  function openPreview(file) {
    const r = state.records.find(function (rec) { return rec.file === file; });
    if (!r) { toast('Arquivo não autorizado.', 'error'); return; }

    els.previewTitle.textContent = r.title;
    els.previewDesc.textContent = r.issuer + (r.credentialId ? ' · ID ' + r.credentialId : '') + (r.year ? ' · ' + r.year : '');
    els.previewDownload.href = encodeURI(r.file);
    els.previewDownload.setAttribute('download', r.file);

    els.previewBody.innerHTML = '';
    if (r.type === 'pdf') {
      els.previewBody.innerHTML =
        '<embed src="' + escapeAttr(encodeURI(r.file)) + '#navpanes=0&toolbar=1&statusbar=0" type="application/pdf" />' +
        '<div class="pdf-fallback" hidden>' +
          '<div class="state__icon">📕</div>' +
          '<h3 style="font-size:1.05rem;color:var(--text-primary)">Pré-visualização PDF não suportada neste navegador</h3>' +
          '<p>Clique em "Baixar" para salvar e visualizar o certificado em seu leitor de PDF padrão.</p>' +
          '<a class="btn btn--primary" href="' + escapeAttr(encodeURI(r.file)) + '" download="' + escapeAttr(r.file) + '">Baixar PDF agora</a>' +
        '</div>';
      // fallback se embed não carregar
      setTimeout(function () {
        const emb = els.previewBody.querySelector('embed');
        if (emb) {
          try {
            if (!emb.clientWidth) throw new Error('no width');
          } catch (_) {
            const fallback = els.previewBody.querySelector('.pdf-fallback');
            if (fallback) fallback.hidden = false;
          }
        }
      }, 2000);
    } else {
      els.previewBody.innerHTML =
        '<img src="' + escapeAttr(encodeURI(r.file)) + '" alt="' + escapeAttr(r.title) + '" />';
    }

    const tagsHtml = r.tags && r.tags.length
      ? '<div style="display:flex; flex-wrap:wrap; gap:0.35rem;">' + r.tags.map(function (t) { return '<span class="tag">' + escapeHtml(t) + '</span>'; }).join('') + '</div>'
      : '';
    const summaryHtml = r.summary
      ? '<p style="margin:0; line-height:1.5; color:var(--text-secondary); max-width:70ch;">' + escapeHtml(r.summary) + '</p>'
      : '';

    els.previewFooter.innerHTML =
      '<div style="display:flex; flex-direction:column; gap:0.25rem; min-width:220px;">' +
        '<div><strong>Categoria:</strong> <span>' + escapeHtml(r.categoryIcon) + ' ' + escapeHtml(r.category) + '</span></div>' +
        (r.issuedAt ? '<div><strong>Emitido em:</strong> ' + formatDate(r.issuedAt) + '</div>' : '') +
        (r.credentialId ? '<div><strong>Credencial:</strong> ' + escapeHtml(r.credentialId) + '</div>' : '') +
      '</div>' +
      '<div style="flex:1 1 0; display:flex; justify-content:flex-end; min-width:200px;">' + tagsHtml + summaryHtml + '</div>';

    els.previewModal.hidden = false;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(function () { els.previewClose.focus(); });
  }

  function closePreview() {
    els.previewModal.hidden = true;
    document.body.style.overflow = '';
    els.previewBody.innerHTML = '';
  }

  async function startBulkDownload() {
    const files = state.records.filter(function (r) { return state.selected.has(r.file); });
    if (files.length === 0) return;

    if (!window.JSZip || !window.saveAs) {
      toast('Dependências JSZip/FileSaver não carregadas. Verifique sua conexão.', 'error');
      return;
    }

    const origLabel = els.bulkDownloadBtn.innerHTML;
    els.bulkDownloadBtn.disabled = true;
    toast('Preparando pacote com ' + files.length + ' arquivo(s)...', 'info');

    try {
      const zip = new JSZip();
      const folder = zip.folder('certificados-fabricio-duarte');
      for (let i = 0; i < files.length; i++) {
        const r = files[i];
        try {
          const resp = await fetch(encodeURI(r.file), { cache: 'no-cache' });
          if (!resp.ok) throw new Error('HTTP ' + resp.status + ' - ' + r.file);
          const blob = await resp.blob();
          folder.file(sanitizeZipName(r.file), blob);
          const pct = Math.round(((i + 1) / files.length) * 100);
          els.bulkDownloadBtn.innerHTML =
            '<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>' +
            'Compactando ' + (i + 1) + '/' + files.length + ' · ' + pct + '%';
        } catch (err) {
          console.error('Erro em arquivo em lote: ' + r.file, err);
          toast('Arquivo ' + r.file + ' ignorado: ' + (err.message || 'erro desconhecido'), 'error');
        }
      }
      els.bulkDownloadBtn.innerHTML =
        '<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>' +
        'Finalizando ZIP...';
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const filename = 'certificados-fabricio-duarte-' + stamp() + '.zip';
      window.saveAs(zipBlob, filename);
      toast('Download concluído: ' + filename + ' (' + formatBytes(zipBlob.size) + ')');
    } catch (err) {
      console.error(err);
      toast('Falha no download em lote: ' + (err.message || 'erro desconhecido'), 'error');
    } finally {
      els.bulkDownloadBtn.innerHTML = origLabel;
      renderSelection();
    }
  }

  function sanitizeZipName(name) {
    return name.replace(/[\/\\:*?"<>|]+/g, '_').replace(/^[.]+/, '');
  }

  function stamp() {
    const d = new Date();
    const pad = function (n) { return n < 10 ? '0' + n : String(n); };
    return d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + '-' + pad(d.getHours()) + pad(d.getMinutes());
  }

  function formatDate(iso) {
    const d = safeParseDate(iso);
    if (!d) return iso;
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  function formatBytes(n) {
    if (!n || n < 0) return '0 B';
    if (n < 1024) return n + ' B';
    const units = ['KB', 'MB', 'GB'];
    let i = -1; let v = n;
    do { v = v / 1024; i++; } while (v >= 1024 && i < units.length - 1);
    return v.toFixed(v >= 10 || i === 0 ? 0 : 1) + ' ' + units[i];
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function escapeAttr(s) { return escapeHtml(s); }

  function slug(s) {
    return String(s || '').replace(/[^A-Za-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48).toLowerCase();
  }

  let toastTimer = null;
  function toast(msg, kind) {
    els.toast.textContent = msg || '';
    els.toast.className = 'toast' + (kind === 'error' ? ' toast--error' : kind === 'info' ? ' toast--info' : '');
    els.toast.hidden = false;
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      els.toast.hidden = true;
    }, 4200);
  }

  function setYear() {
    const y = qs('yearNow');
    if (y) y.textContent = String(new Date().getFullYear());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
