/**
 * Navbar Component
 */

export function renderNavbar(activeRoute = '') {
  const links = [
    { href: '#/', label: 'Home', icon: 'home' },
    { href: '#/dashboard', label: 'Modules', icon: 'school' },
    { href: '#/assessments', label: 'Assessments', icon: 'fact_check' },
    { href: '#/projects', label: 'Projects', icon: 'account_tree' },
  ];

  const linksHtml = links.map(link => {
    const isActive = activeRoute === link.href.slice(1);
    return `
      <a href="${link.href}" class="navbar__link ${isActive ? 'active' : ''}" id="nav-${link.label.toLowerCase()}">
        <span class="material-symbols-outlined">${link.icon}</span>
        ${link.label}
      </a>
    `;
  }).join('');

  return `
    <nav class="navbar" id="main-navbar">
      <div class="navbar__inner">
        <a href="#/" class="navbar__brand">
          <span class="navbar__logo">Terraform: Archive</span>
          <span class="navbar__logo-sub">Study Portal</span>
        </a>
        <div class="navbar__nav">
          <button class="navbar__search-btn" onclick="openSearch()">
            <span class="material-symbols-outlined">search</span>
            Search... <kbd>⌘K</kbd>
          </button>
          ${linksHtml}
        </div>
      </div>
    </nav>
  `;
}

/**
 * Set up navbar scroll effect
 */
export function initNavbar() {
  const navbar = document.getElementById('main-navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });
}
