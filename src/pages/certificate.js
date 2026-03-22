/**
 * Certificate Page
 */
import { renderNavbar, initNavbar } from '../components/navbar.js';
import { getReadinessData } from '../utils/content.js';

export function renderCertificate() {
  const app = document.getElementById('app');
  const readiness = getReadinessData();

  // Redirect to dashboard if not eligible
  if (!readiness.isEligibleForCert && readiness.percentage < 80) {
    window.location.hash = '#/dashboard';
    return;
  }

  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  app.innerHTML = `
    ${renderNavbar('#/certificate')}
    <main class="certificate-layout page-enter">
      
      <div class="certificate-actions">
        <button class="btn btn-secondary" onclick="window.location.hash='#/dashboard'">
          <span class="material-symbols-outlined">arrow_back</span> Back to Dashboard
        </button>
        <button class="btn btn-primary" onclick="window.print()">
          <span class="material-symbols-outlined">print</span> Print Certificate
        </button>
      </div>

      <div class="certificate" id="printable-certificate">
        <div class="certificate__inner">
          <div class="certificate__brand">
            <span class="material-symbols-outlined">architecture</span>
            <div class="certificate__brand-text">The Modern Archivist</div>
          </div>
          
          <div class="certificate__subtitle">Certificate of Completion</div>
          <h1 class="certificate__title">Terraform Associate<br/>Readiness Curriculum</h1>
          
          <div class="certificate__recipient">
            <input type="text" class="certificate__name-input" placeholder="Enter Your Name Here" autocomplete="off" spellcheck="false" />
          </div>
          
          <p class="certificate__desc">
            This confirms the successful completion of the intensive technical curriculum, encompassing deep-theory archives and applied laboratory environments for modern cloud provisioning.
          </p>
          
          <div class="certificate__footer">
            <div class="certificate__sig">
              <div class="certificate__sig-line">${dateStr}</div>
              <div class="certificate__sig-label">Date of Artifact</div>
            </div>
            
            <div class="certificate__seal">
              Verified<br/>State<br/>${readiness.percentage}%
            </div>
            
            <div class="certificate__sig">
              <div class="certificate__sig-line">Terraform: Archive</div>
              <div class="certificate__sig-label">Authorizing Node</div>
            </div>
          </div>
        </div>
      </div>
      
    </main>
  `;

  initNavbar();
}
