/**
 * Footer Component
 */

export function renderFooter() {
  return `
    <footer class="footer">
      <div class="footer__inner">
        <div class="footer__col">
          <h4 class="footer__heading">Resources</h4>
          <a href="https://developer.hashicorp.com/terraform/docs" target="_blank" rel="noopener" class="footer__link">API Reference</a>
          <a href="https://registry.terraform.io/" target="_blank" rel="noopener" class="footer__link">Registry</a>
          <a href="https://github.com/hashicorp/terraform" target="_blank" rel="noopener" class="footer__link">GitHub</a>
        </div>
        <div class="footer__col">
          <h4 class="footer__heading">Curriculum</h4>
          <a href="#/dashboard" class="footer__link">All Modules</a>
          <a href="#/assessments" class="footer__link">Assessments</a>
          <a href="#/projects" class="footer__link">Projects</a>
        </div>
        <div class="footer__col">
          <h4 class="footer__heading">Community</h4>
          <a href="https://discuss.hashicorp.com/c/terraform-core/" target="_blank" rel="noopener" class="footer__link">Forums</a>
          <a href="https://developer.hashicorp.com/terraform/tutorials" target="_blank" rel="noopener" class="footer__link">Tutorials</a>
        </div>
        <p class="footer__copyright">© 2024 Terraform: Archive — The Modern Archivist Study Portal</p>
      </div>
    </footer>
  `;
}
