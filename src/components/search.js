/**
 * Global Search Component (Cmd+K) using FlexSearch
 */
import FlexSearch from 'flexsearch';

// State
let searchIndex = null;
let searchData = [];
let isModalOpen = false;

// UI Elements
let modalEl, overlayEl, inputEl, resultsEl;

/**
 * Clean markdown for snippets
 */
function stripMarkdown(md) {
  return md
    .replace(/[#*`>\[\]\(\)-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Initialize search indexing
 */
async function initSearchData() {
  if (searchIndex) return;
  try {
    const res = await fetch(import.meta.env.BASE_URL + 'search-data.json');
    if (!res.ok) throw new Error('Search data not found');
    
    searchData = await res.json();
    
    // Create FlexSearch Document index
    searchIndex = new FlexSearch.Document({
      document: {
        id: "id",
        index: ["title", "content"],
        store: true
      },
      tokenize: "forward",
      cache: true
    });

    // Populate index
    searchData.forEach(doc => searchIndex.add(doc));
    console.log(`Indexed ${searchData.length} documents for search`);
  } catch (err) {
    console.error('Search init failed:', err);
  }
}

/**
 * Perform search
 */
function performSearch(query) {
  if (!searchIndex) return;
  if (!query.trim()) {
    resultsEl.innerHTML = `
      <div class="search-empty">
        <span class="material-symbols-outlined" style="font-size: 48px; color: var(--outline-variant); margin-bottom: 12px; display: block;">search</span>
        <p>Type to search 20+ modules...</p>
      </div>
    `;
    return;
  }

  // Search across title and content
  const results = searchIndex.search(query, { enrich: true, limit: 10 });
  
  // Flatten results from multiple indexed fields
  const uniqueDocs = new Map();
  results.forEach(fieldResult => {
    fieldResult.result.forEach(doc => {
      uniqueDocs.set(doc.id, doc.doc);
    });
  });

  const finalResults = Array.from(uniqueDocs.values());

  if (finalResults.length === 0) {
    resultsEl.innerHTML = `
      <div class="search-empty">
        <p>No results found for "<strong>${query}</strong>"</p>
      </div>
    `;
    return;
  }

  const html = finalResults.map(doc => {
    // Basic snippet extraction around the match
    let snippet = doc.content.substring(0, 100) + '...';
    const lowerContent = doc.content.toLowerCase();
    const queryLower = query.toLowerCase();
    const matchIdx = lowerContent.indexOf(queryLower);
    
    if (matchIdx !== -1) {
      const start = Math.max(0, matchIdx - 40);
      const end = Math.min(doc.content.length, matchIdx + 60);
      snippet = (start > 0 ? '...' : '') + 
                doc.content.substring(start, matchIdx) + 
                `<mark>${doc.content.substring(matchIdx, matchIdx + query.length)}</mark>` + 
                doc.content.substring(matchIdx + query.length, end) + 
                (end < doc.content.length ? '...' : '');
    }

    return `
      <a href="${doc.url}" class="search-result" onclick="closeSearch()">
        <span class="search-result__title">${doc.title}</span>
        <span class="search-result__snippet">${snippet}</span>
      </a>
    `;
  }).join('');

  resultsEl.innerHTML = html;
}

/**
 * Open Modal
 */
export function openSearch() {
  if (!modalEl) createModal();
  isModalOpen = true;
  modalEl.classList.add('active');
  overlayEl.classList.add('active');
  inputEl.focus();
  inputEl.value = '';
  performSearch('');
  
  // Lazy load data on first open
  initSearchData();
}

/**
 * Close Modal
 */
export function closeSearch() {
  if (!isModalOpen) return;
  isModalOpen = false;
  modalEl.classList.remove('active');
  overlayEl.classList.remove('active');
}

/**
 * Expose to global window so anchor click can trigger it
 */
window.closeSearch = closeSearch;
window.openSearch = openSearch;

/**
 * Build DOM Elements
 */
function createModal() {
  overlayEl = document.createElement('div');
  overlayEl.className = 'search-overlay';
  overlayEl.addEventListener('click', closeSearch);

  modalEl = document.createElement('div');
  modalEl.className = 'search-modal';
  
  modalEl.innerHTML = `
    <div class="search-modal__header">
      <span class="material-symbols-outlined" style="color: var(--on-surface-variant);">search</span>
      <input type="text" id="search-input" class="search-input" placeholder="Search modules, theory, labs..." autocomplete="off">
      <button class="search-modal__close" onclick="closeSearch()">
        <span class="material-symbols-outlined">close</span>
      </button>
    </div>
    <div class="search-modal__results" id="search-results">
      <div class="search-empty">
        <span class="material-symbols-outlined" style="font-size: 48px; color: var(--outline-variant); margin-bottom: 12px; display: block;">search</span>
        <p>Type to search 20+ modules...</p>
      </div>
    </div>
    <div class="search-modal__footer">
      <span><kbd>↑</kbd> <kbd>↓</kbd> to navigate</span>
      <span><kbd>Enter</kbd> to select</span>
      <span><kbd>Esc</kbd> to close</span>
    </div>
  `;

  document.body.appendChild(overlayEl);
  document.body.appendChild(modalEl);

  inputEl = document.getElementById('search-input');
  resultsEl = document.getElementById('search-results');

  // Event Listeners
  inputEl.addEventListener('input', (e) => {
    performSearch(e.target.value);
  });

  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSearch();
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const results = Array.from(resultsEl.querySelectorAll('.search-result'));
      if (!results.length) return;
      
      const active = document.activeElement;
      const idx = results.indexOf(active);
      
      let nextIdx = 0;
      if (e.key === 'ArrowDown') {
        nextIdx = idx === -1 ? 0 : (idx + 1) % results.length;
      } else {
        nextIdx = idx === -1 ? results.length - 1 : (idx - 1 + results.length) % results.length;
      }
      
      results[nextIdx].focus();
    }
  });

  // Modal level keydown for navigating results
  modalEl.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      const active = document.activeElement;
      if (active.classList.contains('search-result')) {
        e.preventDefault();
        const results = Array.from(resultsEl.querySelectorAll('.search-result'));
        const idx = results.indexOf(active);
        let nextIdx = e.key === 'ArrowDown' ? (idx + 1) % results.length : (idx - 1 + results.length) % results.length;
        results[nextIdx].focus();
      }
    } else if (e.key === 'Escape') {
      closeSearch();
    }
  });
}

/**
 * Initialize global keyboard listener
 */
export function initSearch() {
  document.addEventListener('keydown', (e) => {
    // Cmd+K or Ctrl+K
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      if (isModalOpen) {
        closeSearch();
      } else {
        openSearch();
      }
    }
  });
}
