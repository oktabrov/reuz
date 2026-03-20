// ==========================================
// ReUz — Hierarchical Category Browser Panel
// ==========================================

import { CATEGORY_TREE, getCategoryLabel, findCategoryPath } from '../categories.js';
import { getLanguage } from '../i18n.js';

let browserState = {
  isOpen: false,
  levels: [],        // stack of { parentId, items }
  onSelect: null,    // callback(categoryId)
  searchQuery: ''
};

// ── Open / Close ───────────────────────
export function openCategoryBrowser(onSelect) {
  browserState.onSelect = onSelect;
  browserState.levels = [{ parentId: null, items: CATEGORY_TREE }];
  browserState.searchQuery = '';
  browserState.isOpen = true;
  renderBrowser();
}

export function closeCategoryBrowser() {
  browserState.isOpen = false;
  const overlay = document.getElementById('cat-browser-overlay');
  const panel = document.getElementById('cat-browser-panel');
  if (overlay) overlay.classList.remove('open');
  if (panel) panel.classList.remove('open');
  setTimeout(() => {
    const container = document.getElementById('cat-browser-container');
    if (container) container.remove();
  }, 400);
}

// ── Render ──────────────────────────────
function renderBrowser() {
  const lang = getLanguage();
  const searchPlaceholder = lang === 'uz' ? 'Kategoriyalarni qidirish...' : 'Search categories...';
  
  // Remove existing container
  const existing = document.getElementById('cat-browser-container');
  if (existing) existing.remove();

  const container = document.createElement('div');
  container.id = 'cat-browser-container';
  container.innerHTML = `
    <div class="category-browser-overlay" id="cat-browser-overlay"></div>
    <div class="category-browser-panel" id="cat-browser-panel">
      <div class="category-browser-header" id="cat-browser-header">
        ${renderHeader()}
      </div>
      <div class="category-browser-search">
        <input type="text" id="cat-browser-search" placeholder="${searchPlaceholder}" value="${browserState.searchQuery}" />
      </div>
      <div class="category-browser-levels" id="cat-browser-levels">
        ${renderCurrentLevel()}
      </div>
    </div>
  `;
  document.body.appendChild(container);

  // Trigger open animation
  requestAnimationFrame(() => {
    document.getElementById('cat-browser-overlay')?.classList.add('open');
    document.getElementById('cat-browser-panel')?.classList.add('open');
  });

  attachBrowserEvents();
}

function renderHeader() {
  const lang = getLanguage();
  const currentLevel = browserState.levels[browserState.levels.length - 1];
  const isRoot = browserState.levels.length <= 1;
  
  const title = isRoot 
    ? (lang === 'uz' ? 'Kategoriyalar' : 'Categories')
    : getCategoryLabel(currentLevel.parentId);

  return `
    ${!isRoot ? `
      <button class="category-browser-back" id="cat-browser-back-btn">←</button>
    ` : ''}
    <span class="category-browser-title">${title}</span>
    <button class="category-browser-close" id="cat-browser-close-btn">✕</button>
  `;
}

function renderCurrentLevel() {
  const currentLevel = browserState.levels[browserState.levels.length - 1];
  const query = browserState.searchQuery.toLowerCase();
  
  if (query) {
    return renderSearchResults(query);
  }

  const items = currentLevel.items || [];
  return `
    <div class="category-browser-level active">
      ${items.map(item => {
        const hasChildren = item.children && item.children.length > 0;
        return `
          <button class="category-browser-item" data-cat-id="${item.id}" data-has-children="${hasChildren}">
            ${item.icon ? `<span class="category-browser-item-icon">${item.icon}</span>` : ''}
            <span class="category-browser-item-label">${getCategoryLabel(item.id)}</span>
            ${hasChildren ? `<span class="category-browser-item-arrow">›</span>` : ''}
          </button>
        `;
      }).join('')}
    </div>
  `;
}

function renderSearchResults(query) {
  const results = searchCategories(CATEGORY_TREE, query);
  const lang = getLanguage();
  const noResults = lang === 'uz' ? 'Natija topilmadi' : 'No results found';
  
  if (results.length === 0) {
    return `
      <div class="category-browser-level active" style="padding: var(--space-xl); text-align: center; color: var(--text-muted);">
        ${noResults}
      </div>
    `;
  }

  return `
    <div class="category-browser-level active">
      ${results.map(item => {
        const path = findCategoryPath(item.id);
        const pathLabels = path ? path.map(id => getCategoryLabel(id)).join(' → ') : '';
        return `
          <button class="category-browser-item" data-cat-id="${item.id}" data-has-children="false">
            ${item.icon ? `<span class="category-browser-item-icon">${item.icon}</span>` : ''}
            <span class="category-browser-item-label">
              ${getCategoryLabel(item.id)}
              ${pathLabels ? `<br><small style="color: var(--text-muted); font-size: 0.75rem;">${pathLabels}</small>` : ''}
            </span>
          </button>
        `;
      }).join('')}
    </div>
  `;
}

function searchCategories(tree, query) {
  let results = [];
  for (const node of tree) {
    const label = getCategoryLabel(node.id).toLowerCase();
    if (label.includes(query)) {
      results.push(node);
    }
    if (node.children) {
      results = results.concat(searchCategories(node.children, query));
    }
  }
  return results;
}

// ── Events ──────────────────────────────
function attachBrowserEvents() {
  // Close overlay click
  const overlay = document.getElementById('cat-browser-overlay');
  if (overlay) {
    overlay.addEventListener('click', closeCategoryBrowser);
  }

  // Close button
  const closeBtn = document.getElementById('cat-browser-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeCategoryBrowser);
  }

  // Back button
  const backBtn = document.getElementById('cat-browser-back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      if (browserState.levels.length > 1) {
        browserState.levels.pop();
        updateBrowserUI();
      }
    });
  }

  // Search input
  const searchInput = document.getElementById('cat-browser-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      browserState.searchQuery = e.target.value;
      updateLevelsUI();
    });
    // Focus search on open
    setTimeout(() => searchInput.focus(), 300);
  }

  // Category items
  attachItemEvents();
}

function attachItemEvents() {
  document.querySelectorAll('#cat-browser-levels .category-browser-item').forEach(item => {
    item.addEventListener('click', () => {
      const catId = item.dataset.catId;
      const hasChildren = item.dataset.hasChildren === 'true';
      
      if (hasChildren && !browserState.searchQuery) {
        // Navigate deeper
        const node = findNodeInTree(catId, CATEGORY_TREE);
        if (node && node.children) {
          browserState.levels.push({ parentId: catId, items: node.children });
          updateBrowserUI();
        }
      } else {
        // Select this category
        if (browserState.onSelect) {
          browserState.onSelect(catId);
        }
        closeCategoryBrowser();
      }
    });
  });
}

function updateBrowserUI() {
  const header = document.getElementById('cat-browser-header');
  if (header) header.innerHTML = renderHeader();
  
  updateLevelsUI();
  
  // Re-attach header events
  const closeBtn = document.getElementById('cat-browser-close-btn');
  if (closeBtn) closeBtn.addEventListener('click', closeCategoryBrowser);
  
  const backBtn = document.getElementById('cat-browser-back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      if (browserState.levels.length > 1) {
        browserState.levels.pop();
        updateBrowserUI();
      }
    });
  }
}

function updateLevelsUI() {
  const levelsContainer = document.getElementById('cat-browser-levels');
  if (levelsContainer) {
    levelsContainer.innerHTML = renderCurrentLevel();
    attachItemEvents();
  }
}

function findNodeInTree(id, tree) {
  for (const node of tree) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNodeInTree(id, node.children);
      if (found) return found;
    }
  }
  return null;
}
