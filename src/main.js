/**
 * Terraform: Archive — Main Entry Point
 */
import './styles/global.css';
import './styles/components.css';
import './styles/landing.css';
import './styles/dashboard.css';
import './styles/module-view.css';
import './styles/assessment.css';
import './styles/projects.css';

import { initModules } from './utils/content.js';
import { Router } from './utils/router.js';
import { renderLanding } from './pages/landing.js';
import { renderDashboard } from './pages/dashboard.js';
import { renderModuleView } from './pages/module-view.js';
import { renderAssessments, renderQuiz } from './pages/assessment.js';
import { renderProjects } from './pages/projects.js';

// Scroll to top on page change
function withScrollTop(handler) {
  return (params) => {
    window.scrollTo(0, 0);
    handler(params);
  };
}

// Initialize modules from manifest, then start router
async function boot() {
  await initModules();

  const router = new Router([
    { path: '/', handler: withScrollTop(renderLanding) },
    { path: '/dashboard', handler: withScrollTop(renderDashboard) },
    { path: '/module/:moduleId/:section', handler: withScrollTop(renderModuleView) },
    { path: '/assessments', handler: withScrollTop(renderAssessments) },
    { path: '/quiz/:moduleId', handler: withScrollTop(renderQuiz) },
    { path: '/projects', handler: withScrollTop(renderProjects) },
  ]);

  router.init();
}

boot();
