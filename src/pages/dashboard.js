/**
 * Course Dashboard Page
 */
import { renderNavbar, initNavbar } from '../components/navbar.js';
import { renderFooter } from '../components/footer.js';
import { getModules, SECTION_META, isVisited, getReadinessData } from '../utils/content.js';

function renderModuleCard(mod) {
  // Only show checklist items for available sections
  const checklistItems = mod.sections.map(section => {
    const meta = SECTION_META[section];
    if (!meta) return '';
    const visited = isVisited(mod.id, section);
    return `
      <span class="checklist-item ${visited ? 'checklist-item--done' : ''}" title="${meta.label}">
        <span class="material-symbols-outlined">${visited ? 'check_circle' : 'radio_button_unchecked'}</span>
        ${meta.label}
      </span>
    `;
  }).join('');

  // Navigate to first available section
  const firstSection = mod.sections[0] || 'theory';

  return `
    <article class="module-card" onclick="window.location.hash='/module/${mod.id}/${firstSection}'" id="module-card-${mod.id}">
      <div class="module-card__header">
        <span class="module-card__number">${mod.id}</span>
        <div class="module-card__status">
          <span class="chip chip-${mod.difficulty === 'Beginner' ? 'success' : mod.difficulty === 'Intermediate' ? 'primary' : 'warning'}">${mod.difficulty}</span>
        </div>
      </div>
      <h3 class="module-card__title">${mod.title}</h3>
      <p class="module-card__description">${mod.description}</p>
      <div class="module-card__checklist">${checklistItems}</div>
      <div class="module-card__footer">
        <span class="module-card__time">
          <span class="material-symbols-outlined">schedule</span>
          ${mod.estimatedTime}
        </span>
        <span class="module-card__arrow">
          <span class="material-symbols-outlined">arrow_forward</span>
        </span>
      </div>
    </article>
  `;
}

export function renderDashboard() {
  const app = document.getElementById('app');
  const modules = getModules();
  const moduleCards = modules.map(renderModuleCard).join('');
  const readiness = getReadinessData();

  app.innerHTML = `
    ${renderNavbar('#/dashboard')}
    <main class="dashboard page-enter">
      <div class="dashboard__inner">
        <header class="dashboard__header">
          <p class="dashboard__label">Curriculum</p>
          <h1 class="dashboard__title">Infrastructure<br/>State of the Union</h1>
          <p class="dashboard__subtitle">
            Your progression through the Terraform Associate curriculum. Each module is a blueprint for mastery in modern provisioning.
          </p>
        </header>

        <!-- Gamification Banner -->
        <div class="readiness-banner">
          <div class="readiness__info">
            <h2 class="readiness__title">Associate Readiness</h2>
            <p class="readiness__level">Level: <strong>${readiness.level}</strong></p>
            <p class="readiness__pts">${readiness.earnedScore} / ${readiness.totalPossibleScore} pts</p>
          </div>
          <div class="readiness__score">
            <div class="score-circle">
              <span>${readiness.percentage}%</span>
            </div>
          </div>
          <div class="readiness__action">
            ${readiness.isEligibleForCert 
              ? `<a href="#/certificate" class="btn btn-primary"><span class="material-symbols-outlined">workspace_premium</span> View Certificate</a>` 
              : `<button class="btn btn-secondary btn-locked" disabled><span class="material-symbols-outlined">lock</span> Certificate Locked (80% req)</button>`
            }
          </div>
        </div>

        <div class="modules-grid">
          ${moduleCards}
        </div>
      </div>
      ${renderFooter()}
    </main>
  `;

  initNavbar();
}
