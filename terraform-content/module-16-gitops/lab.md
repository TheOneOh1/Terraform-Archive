# Module 16 — Lab & Assignment & Quiz

## Lab: PR-Based Terraform Workflow
Implement a full PR-based workflow: create a repo, push Terraform config, create a PR, review the plan comment, merge, and verify the apply.

### Steps
1. Create GitHub repo with branch protection on main
2. Add Terraform config on a feature branch
3. Push and create PR
4. Verify CI runs plan and comments on PR
5. Review, approve, and merge
6. Verify apply ran on main branch
7. Clean up

---

## Assignment
Document a complete GitOps workflow for your team. Include: branch strategy, PR template for Terraform changes, CODEOWNERS file, and CI/CD pipeline configuration.

### Checklist
- [ ] Branch protection configured
- [ ] PR template for IaC changes
- [ ] CODEOWNERS file
- [ ] Plan comments on PRs
- [ ] Apply on merge
- [ ] Documentation complete

---

## Quiz

### Q1: In GitOps, what is the single source of truth?
A) AWS Console B) Terraform state C) Git repository D) CI/CD pipeline

<details><summary>Answer</summary>**C) Git repository**</details>

### Q2: What is Atlantis?
A) An AWS service B) Open-source PR-based Terraform automation C) A HashiCorp product D) A Git hosting platform

<details><summary>Answer</summary>**B) Open-source PR-based Terraform automation**</details>

### Q3: What is Policy as Code?
A) Writing policies in Markdown B) Automated compliance rules evaluated against Terraform plans C) AWS IAM policies D) Git branch protection

<details><summary>Answer</summary>**B) Automated compliance rules evaluated against Terraform plans**</details>

### Q4: When should direct `terraform apply` be run on a developer's machine?
A) Always B) For production C) Only for development/learning D) Never

<details><summary>Answer</summary>**C) Only for development/learning** — production should be through CI/CD</details>

### Q5: What's the benefit of plan output on PRs?
A) Faster execution B) Reviewers can see exact infrastructure changes before approval C) Automatic rollback D) Encryption

<details><summary>Answer</summary>**B) Reviewers can see exact infrastructure changes before approval**</details>

---

**Next Phase**: [Module 17 →](../module-17-advanced-hcl/theory.md)
