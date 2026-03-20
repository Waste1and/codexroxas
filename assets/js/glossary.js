/* =========================================================
   Glossary / Knowledge Graph — Interactive JS
   Mecasimetra / CodexRoxas
   ========================================================= */

(function () {
  'use strict';

  let terms = [];
  let currentTermId = null;
  const breadcrumb = [];

  /* ── DOM refs ── */
  const termListEl = document.getElementById('term-list');
  const termPanelEl = document.getElementById('term-panel');
  const searchEl = document.getElementById('term-search');

  /* ── Bootstrap ── */
  async function init() {
    try {
      const res = await fetch('./data/terms.json');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      terms = data.terms || [];
      renderTermList(terms);
      renderPlaceholder();
      bindSearch();
      bindHashNav();
    } catch (err) {
      console.error('Glossary: failed to load terms.json', err);
      termPanelEl.innerHTML = `
        <div class="term-placeholder">
          <span style="color:var(--accent-magenta)">⚠</span>
          Failed to load glossary data.
        </div>`;
    }
  }

  /* ── Term list sidebar ── */
  function renderTermList(subset) {
    termListEl.innerHTML = '';
    subset.forEach((term) => {
      const btn = document.createElement('button');
      btn.className = 'term-list-item';
      btn.dataset.id = term.id;
      btn.setAttribute('aria-label', `View term: ${term.name}`);
      btn.innerHTML = `
        <span class="tli-symbol" aria-hidden="true">${escHtml(term.symbol)}</span>
        <span class="tli-text">
          <span class="tli-name">${escHtml(term.name)}</span>
          <span class="tli-short">${escHtml(term.short)}</span>
        </span>`;
      btn.addEventListener('click', () => selectTerm(term.id, true));
      termListEl.appendChild(btn);
    });
  }

  /* ── Search ── */
  function bindSearch() {
    let debounceTimer;
    searchEl.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const q = searchEl.value.trim().toLowerCase();
        const filtered = q
          ? terms.filter(
              (t) =>
                t.name.toLowerCase().includes(q) ||
                t.short.toLowerCase().includes(q) ||
                (t.symbol && t.symbol.toLowerCase().includes(q)) ||
                t.tags.some((tag) => tag.includes(q))
            )
          : terms;
        renderTermList(filtered);
        /* re-mark active */
        if (currentTermId) {
          const activeBtn = termListEl.querySelector(`[data-id="${currentTermId}"]`);
          if (activeBtn) activeBtn.classList.add('active');
        }
      }, 180);
    });
  }

  /* ── Hash-based routing ── */
  function bindHashNav() {
    const readHash = () => {
      const match = window.location.hash.match(/^#\/term\/([^/]+)/);
      if (match) {
        selectTerm(decodeURIComponent(match[1]), false);
      }
    };
    window.addEventListener('hashchange', readHash);
    readHash();
  }

  /* ── Select / navigate to a term ── */
  function selectTerm(id, pushBreadcrumb = true) {
    const term = terms.find((t) => t.id === id);
    if (!term) return;

    if (pushBreadcrumb && currentTermId && currentTermId !== id) {
      breadcrumb.push(currentTermId);
    } else if (!pushBreadcrumb) {
      breadcrumb.length = 0; /* reset on hash nav */
    }

    currentTermId = id;

    /* Update URL hash */
    history.replaceState(null, '', `#/term/${encodeURIComponent(id)}`);

    /* Highlight in list */
    termListEl.querySelectorAll('.term-list-item').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.id === id);
    });

    /* Animate out then render new content */
    const existing = termPanelEl.querySelector('.term-content');
    if (existing) {
      existing.classList.add('transitioning');
      setTimeout(() => renderTermDetail(term), 150);
    } else {
      renderTermDetail(term);
    }
  }

  /* ── Render term detail panel ── */
  function renderTermDetail(term) {
    const ancestorTerms = (term.ancestors || [])
      .map((id) => terms.find((t) => t.id === id))
      .filter(Boolean);
    const childTerms = (term.children || [])
      .map((id) => terms.find((t) => t.id === id))
      .filter(Boolean);

    /* breadcrumb HTML */
    const bcHtml = buildBreadcrumbHtml(term);

    /* ancestor nav links */
    const ancestorLinks = ancestorTerms
      .map(
        (a) => `<button class="term-link-btn ancestor" data-nav="${escAttr(a.id)}">
          ↑ ${escHtml(a.symbol)} ${escHtml(a.name)}
        </button>`
      )
      .join('');

    /* child nav links */
    const childLinks = childTerms
      .map(
        (c) => `<button class="term-link-btn child" data-nav="${escAttr(c.id)}">
          ${escHtml(c.symbol)} ${escHtml(c.name)} →
        </button>`
      )
      .join('');

    const navSection =
      ancestorLinks || childLinks
        ? `<div class="term-nav-section">
            ${ancestorLinks ? `<h4>Ancestor concepts</h4><div class="term-nav-links">${ancestorLinks}</div>` : ''}
            ${childLinks ? `<h4 style="margin-top:1rem">Derived concepts</h4><div class="term-nav-links">${childLinks}</div>` : ''}
           </div>`
        : '';

    const formulaHtml = term.formula
      ? `<div class="term-formula" aria-label="Formula">${escHtml(term.formula)}</div>`
      : '';

    const tagsHtml = term.tags && term.tags.length
      ? `<div class="term-tags">${term.tags.map((t) => `<span class="tag">${escHtml(t)}</span>`).join('')}</div>`
      : '';

    termPanelEl.innerHTML = `
      <div class="term-breadcrumb" aria-label="Navigation breadcrumb">${bcHtml}</div>
      <div class="term-content">
        <div class="term-symbol-row">
          <div class="term-big-symbol" aria-hidden="true">${escHtml(term.symbol)}</div>
          <div class="term-header-text">
            <h3>${escHtml(term.name)}</h3>
            <p class="term-short">${escHtml(term.short)}</p>
          </div>
        </div>
        ${formulaHtml}
        <p class="term-definition">${escHtml(term.definition)}</p>
        ${tagsHtml}
        ${navSection}
      </div>`;

    /* Bind navigation buttons */
    termPanelEl.querySelectorAll('[data-nav]').forEach((btn) => {
      btn.addEventListener('click', () => selectTerm(btn.dataset.nav, true));
    });
  }

  /* ── Breadcrumb ── */
  function buildBreadcrumbHtml(currentTerm) {
    if (!breadcrumb.length) {
      return `<span class="bc-item current">${escHtml(currentTerm.name)}</span>`;
    }
    const parts = breadcrumb
      .map((id) => {
        const t = terms.find((x) => x.id === id);
        if (!t) return '';
        return `<button class="bc-item" data-bc-nav="${escAttr(id)}">${escHtml(t.name)}</button>
                <span class="bc-sep" aria-hidden="true">/</span>`;
      })
      .join('');
    const html = `${parts}<span class="bc-item current">${escHtml(currentTerm.name)}</span>`;

    /* Bind breadcrumb nav after insertion */
    setTimeout(() => {
      termPanelEl.querySelectorAll('[data-bc-nav]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const targetIdx = breadcrumb.indexOf(btn.dataset.bcNav);
          if (targetIdx !== -1) {
            breadcrumb.splice(targetIdx);
          }
          selectTerm(btn.dataset.bcNav, false);
        });
      });
    }, 0);

    return html;
  }

  /* ── Placeholder when no term is selected ── */
  function renderPlaceholder() {
    termPanelEl.innerHTML = `
      <div class="term-placeholder">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 8v4M12 16h.01"/>
        </svg>
        Select a term to explore its definition<br>and ancestor concepts.
      </div>`;
  }

  /* ── Utils ── */
  function escHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escAttr(str) {
    return escHtml(str);
  }

  /* ── Start ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
