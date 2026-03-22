/**
 * Module Content View Page
 */
import { renderNavbar, initNavbar } from '../components/navbar.js';
import { getModule, getModules, SECTION_META, fetchContent, markVisited } from '../utils/content.js';
import { renderMarkdown } from '../utils/markdown.js';

export async function renderModuleView(params) {
  const app = document.getElementById('app');
  const moduleId = params.moduleId;
  const section = params.section || 'theory';
  const mod = getModule(moduleId);
  const allModules = getModules();

  if (!mod) {
    app.innerHTML = `
      ${renderNavbar()}
      <main class="dashboard page-enter">
        <div class="dashboard__inner" style="padding: var(--space-16) 0; text-align: center;">
          <h1>Module Not Found</h1>
          <p>Module "${moduleId}" does not exist.</p>
          <a href="#/dashboard" class="btn btn-primary" style="margin-top: var(--space-6);">Back to Dashboard</a>
        </div>
      </main>
    `;
    return;
  }

  // Check if this section exists for this module
  const sectionMeta = SECTION_META[section];
  const sectionAvailable = mod.sections.includes(section);

  // Show loading state
  app.innerHTML = `
    ${renderNavbar('#/dashboard')}
    <div class="module-view__header">
      <div class="module-view__header-inner">
        <div class="module-view__breadcrumb">
          <a href="#/dashboard">Modules</a>
          <span class="material-symbols-outlined" style="font-size: 16px;">chevron_right</span>
          <span>Module ${mod.id}</span>
        </div>
        <h1 class="module-view__title">${mod.title}</h1>
      </div>
    </div>
    <div class="module-view__content">
      <aside class="module-view__sidebar sidebar">
        <div class="sidebar__section">
          <p class="sidebar__section-title">Module ${mod.id}</p>
          ${mod.sections.map(s => {
            const meta = SECTION_META[s];
            if (!meta) return '';
            const isActive = s === section;
            return `
              <a href="#/module/${mod.id}/${s}" class="sidebar__link ${isActive ? 'active' : ''}" id="sidebar-${s}">
                <span class="material-symbols-outlined">${meta.icon}</span>
                ${meta.label}
              </a>
            `;
          }).join('')}
        </div>
        <div class="sidebar__section">
          <p class="sidebar__section-title">All Modules</p>
          ${allModules.map(m => {
            const firstSection = m.sections[0] || 'theory';
            return `
              <a href="#/module/${m.id}/${firstSection}" class="sidebar__link ${m.id === moduleId ? 'active' : ''}" id="sidebar-module-${m.id}">
                <span class="material-symbols-outlined">folder</span>
                ${m.id}. ${m.title.length > 22 ? m.title.slice(0, 22) + '…' : m.title}
              </a>
            `;
          }).join('')}
        </div>
      </aside>
      <div class="module-view__main">
        <div class="tabs">
          ${mod.sections.map(s => {
            const meta = SECTION_META[s];
            if (!meta) return '';
            const isActive = s === section;
            return `
              <a href="#/module/${mod.id}/${s}" class="tab ${isActive ? 'active' : ''}" id="tab-${s}">
                <span class="material-symbols-outlined">${meta.icon}</span>
                ${meta.label}
              </a>
            `;
          }).join('')}
        </div>
        <div class="markdown-body" id="markdown-content">
          ${sectionAvailable ? `
            <div style="display: flex; align-items: center; gap: var(--space-3); color: var(--on-surface-variant); padding: var(--space-8) 0;">
              <span class="material-symbols-outlined" style="animation: spin 1s linear infinite;">progress_activity</span>
              Loading content…
            </div>
          ` : `
            <div style="text-align: center; padding: var(--space-16) 0;">
              <span class="material-symbols-outlined" style="font-size: 48px; color: var(--outline-variant); margin-bottom: var(--space-4); display: block;">block</span>
              <h2 style="margin-bottom: var(--space-3);">Section Not Available</h2>
              <p style="color: var(--on-surface-variant);">This module does not have a ${sectionMeta ? sectionMeta.label : section} section.</p>
              <a href="#/module/${mod.id}/${mod.sections[0] || 'theory'}" class="btn btn-primary" style="margin-top: var(--space-6);">
                Go to ${SECTION_META[mod.sections[0]]?.label || 'Theory'}
              </a>
            </div>
          `}
        </div>
      </div>
    </div>
  `;

  initNavbar();

  // Only fetch if section is available
  if (sectionAvailable && sectionMeta) {
    markVisited(moduleId, section);
    const content = await fetchContent(mod.slug, sectionMeta.file);
    const contentEl = document.getElementById('markdown-content');
    if (contentEl && content) {
      contentEl.innerHTML = renderMarkdown(content);
      
      // Rewrite relative markdown links to router hashes
      const links = contentEl.querySelectorAll('a');
      links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.endsWith('.md') && !href.startsWith('http')) {
          let targetModuleId = moduleId;
          let filePart = href;
          
          // Handle cross-module links (e.g. "../02/theory.md")
          if (href.startsWith('../')) {
            const parts = href.split('/');
            if (parts.length >= 3) {
              targetModuleId = parts[1];
              filePart = parts.slice(2).join('/');
            }
          }

          let targetSection = 'theory';
          if (filePart.includes('lab.md')) targetSection = 'lab';
          else if (filePart.includes('assignment.md')) targetSection = 'assignment';
          else if (filePart.includes('quiz.md')) targetSection = 'quiz';
          else if (filePart.includes('project')) targetSection = 'project';
          else if (filePart.includes('theory.md')) targetSection = 'theory';
          
          link.setAttribute('href', `#/module/${targetModuleId}/${targetSection}`);
        }
      });
      
    } else if (contentEl) {
      contentEl.innerHTML = `
        <div style="text-align: center; padding: var(--space-16) 0;">
          <span class="material-symbols-outlined" style="font-size: 48px; color: var(--outline-variant); margin-bottom: var(--space-4); display: block;">error_outline</span>
          <h2 style="margin-bottom: var(--space-3);">Content Not Found</h2>
          <p style="color: var(--on-surface-variant);">The file for this section could not be loaded.</p>
        </div>
      `;
    }
  }
}
