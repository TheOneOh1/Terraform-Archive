/**
 * Landing Page
 */
import { renderNavbar, initNavbar } from '../components/navbar.js';
import { renderFooter } from '../components/footer.js';
import { getModules } from '../utils/content.js';

export function renderLanding() {
  const app = document.getElementById('app');
  const modules = getModules();

  app.innerHTML = `
    ${renderNavbar('#/')}
    <main class="landing page-enter">
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero__inner">
          <div class="hero__content">
            <p class="hero__label">The Modern Archivist</p>
            <h1 class="hero__title">Infrastructure as <em>Artifact.</em></h1>
            <p class="hero__subtitle">
              A technical manuscript for the modern practitioner. Master the architecture of 
              the cloud through our curated laboratory environments and deep-theory archives.
            </p>
            <div class="hero__actions">
              <a href="#/dashboard" class="btn btn-primary" id="cta-start">
                <span class="material-symbols-outlined">school</span>
                View Curriculum
              </a>
              <a href="#/assessments" class="btn btn-secondary" id="cta-assess">
                <span class="material-symbols-outlined">fact_check</span>
                Assessments
              </a>
            </div>
          </div>
          <div class="hero__aside">
            <div class="hero__quote-card">
              <p class="hero__quote">"Precision in code leads to permanence in state."</p>
              <p class="hero__quote-attr">— The Archivist's Handbook</p>
            </div>
            <div class="stats-bar">
              <div class="stat-item">
                <p class="stat-item__value">${modules.length}</p>
                <p class="stat-item__label">Modules</p>
              </div>
              <div class="stat-item">
                <p class="stat-item__value">${modules.reduce((sum, m) => sum + m.sections.length, 0)}</p>
                <p class="stat-item__label">Lessons</p>
              </div>
              <div class="stat-item">
                <p class="stat-item__value">${modules.filter(m => m.sections.includes('project')).length}</p>
                <p class="stat-item__label">Projects</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Features -->
      <section class="features">
        <div class="features__inner">
          <div class="features__header">
            <p class="label-lg">What's Inside</p>
            <h2>The Archivist's Toolkit</h2>
          </div>
          <div class="features__grid">
            <div class="feature-card" id="feature-labs">
              <div class="feature-card__icon">
                <span class="material-symbols-outlined">terminal</span>
              </div>
              <h3 class="feature-card__title">Interactive Labs</h3>
              <p class="feature-card__description">
                Execute real-world scenarios with step-by-step guided laboratories. 
                Practice the full Terraform workflow from init to destroy.
              </p>
              <ul class="feature-card__list">
                <li><span class="material-symbols-outlined">check_circle</span> Hands-on CLI practice</li>
                <li><span class="material-symbols-outlined">check_circle</span> Real AWS resource provisioning</li>
                <li><span class="material-symbols-outlined">check_circle</span> State exploration exercises</li>
              </ul>
            </div>
            <div class="feature-card" id="feature-theory">
              <div class="feature-card__icon feature-card__icon--secondary">
                <span class="material-symbols-outlined">menu_book</span>
              </div>
              <h3 class="feature-card__title">Deep Theory Archive</h3>
              <p class="feature-card__description">
                Comprehensive explorations of the Provider Ecosystem, State Management strategies, 
                and Module Composition patterns.
              </p>
              <ul class="feature-card__list">
                <li><span class="material-symbols-outlined">check_circle</span> Architecture diagrams</li>
                <li><span class="material-symbols-outlined">check_circle</span> IaC tool comparisons</li>
                <li><span class="material-symbols-outlined">check_circle</span> Best practices & patterns</li>
              </ul>
            </div>
            <div class="feature-card" id="feature-projects">
              <div class="feature-card__icon feature-card__icon--tertiary">
                <span class="material-symbols-outlined">account_tree</span>
              </div>
              <h3 class="feature-card__title">Applied Projects</h3>
              <p class="feature-card__description">
                Construct production-grade infrastructure from architectural blueprints. 
                Each module culminates in a GitHub-ready project.
              </p>
              <ul class="feature-card__list">
                <li><span class="material-symbols-outlined">check_circle</span> Full project structures</li>
                <li><span class="material-symbols-outlined">check_circle</span> Variables & outputs patterns</li>
                <li><span class="material-symbols-outlined">check_circle</span> Documentation templates</li>
              </ul>
            </div>
            <div class="feature-card" id="feature-assess">
              <div class="feature-card__icon">
                <span class="material-symbols-outlined">fact_check</span>
              </div>
              <h3 class="feature-card__title">Rigorous Assessments</h3>
              <p class="feature-card__description">
                Validate your expertise with technical reviews: quizzes on every module, 
                assignments to test independent problem-solving.
              </p>
              <ul class="feature-card__list">
                <li><span class="material-symbols-outlined">check_circle</span> Multiple-choice quizzes</li>
                <li><span class="material-symbols-outlined">check_circle</span> Hands-on assignments</li>
                <li><span class="material-symbols-outlined">check_circle</span> Score tracking</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta-section">
        <div class="cta-section__inner">
          <p class="label-lg">Join the Registry</p>
          <h2 class="cta-section__title">Start Your Terraform Journey</h2>
          <p class="cta-section__description">
            Explore the full curriculum—from your first <code>terraform init</code> to building 
            production-ready infrastructure modules. The archive awaits.
          </p>
          <a href="#/dashboard" class="btn btn-primary" id="cta-bottom">
            <span class="material-symbols-outlined">rocket_launch</span>
            Begin Module 01
          </a>
        </div>
      </section>

      ${renderFooter()}
    </main>
  `;

  initNavbar();
}
