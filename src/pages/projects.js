/**
 * Projects Gallery Page — Dynamic from modules with project sections
 */
import { renderNavbar, initNavbar } from '../components/navbar.js';
import { renderFooter } from '../components/footer.js';
import { getModulesWithSection } from '../utils/content.js';

// Emoji rotation for project cards
const PROJECT_EMOJIS = ['🚀', '🔧', '🏗️', '⚡', '🎯', '🛡️', '🔬', '📦', '🌐', '🔩', '🧩', '💎', '🏛️', '🪄', '📐', '🗺️', '🔑', '🎛️', '📊', '🧱'];

export function renderProjects() {
  const app = document.getElementById('app');
  const projectModules = getModulesWithSection('project');

  const projectCards = projectModules.map((mod, i) => {
    const emoji = PROJECT_EMOJIS[i % PROJECT_EMOJIS.length];

    return `
      <article class="project-card" onclick="window.location.hash='/module/${mod.id}/project'" id="project-${mod.id}">
        <div class="project-card__banner">
          <p class="project-card__banner-module">Module ${mod.id} Project</p>
          <h3 class="project-card__banner-title">${emoji} ${mod.title}</h3>
        </div>
        <div class="project-card__body">
          <p class="project-card__description">${mod.description}</p>
          <div class="project-card__tech-stack">
            <span class="chip chip-neutral">Terraform</span>
            <span class="chip chip-neutral">HCL</span>
            <span class="chip chip-neutral">${mod.difficulty}</span>
          </div>
          <div class="project-card__footer">
            <span class="project-card__difficulty">
              <span class="material-symbols-outlined">signal_cellular_alt</span>
              ${mod.difficulty}
            </span>
            <span class="btn btn-tertiary">
              View Project
              <span class="material-symbols-outlined" style="font-size: 16px;">arrow_forward</span>
            </span>
          </div>
        </div>
      </article>
    `;
  }).join('');

  const emptyState = projectModules.length === 0 ? `
    <div style="text-align: center; padding: var(--space-16) 0; grid-column: 1 / -1;">
      <span class="material-symbols-outlined" style="font-size: 48px; color: var(--outline-variant); margin-bottom: var(--space-4); display: block;">folder_off</span>
      <h2 style="margin-bottom: var(--space-3);">No Projects Available Yet</h2>
      <p style="color: var(--on-surface-variant);">Projects will appear here as modules with project content are added.</p>
    </div>
  ` : '';

  app.innerHTML = `
    ${renderNavbar('#/projects')}
    <main class="projects-page page-enter">
      <div class="projects-page__inner">
        <header class="projects-page__header">
          <p class="projects-page__label">Applied Architecture</p>
          <h1 class="projects-page__title">Project Gallery</h1>
          <p class="projects-page__subtitle">
            Construct production-grade infrastructure from architectural blueprints. 
            Each project maps to a curriculum module and builds real-world skills.
          </p>
        </header>
        <div class="projects-grid">
          ${projectCards}
          ${emptyState}
        </div>
      </div>
      ${renderFooter()}
    </main>
  `;

  initNavbar();
}
