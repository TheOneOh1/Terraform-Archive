# Module 15 — Lab & Assignment & Quiz

## Lab: Set Up GitHub Actions for Terraform
Create a GitHub repository with a Terraform config and GitHub Actions workflow that runs fmt, validate, plan on PRs and apply on merge.

### Steps
1. Create a new GitHub repo
2. Add Terraform config (S3 bucket with remote state)
3. Add `.github/workflows/terraform.yml` from theory
4. Configure repository secrets (AWS credentials)
5. Create a PR, observe the plan output
6. Merge and observe the apply
7. Clean up: run destroy locally or add a destroy workflow

---

## Assignment
Create both a GitHub Actions AND GitLab CI pipeline for the same Terraform project. Compare the two approaches. Add Checkov scan as a CI step.

### Checklist
- [ ] GitHub Actions workflow with plan/apply
- [ ] GitLab CI config with plan/apply
- [ ] Secrets configured in CI/CD platform
- [ ] Checkov scan step added
- [ ] Documented comparison of both approaches

---

## Quiz

### Q1: When should `terraform apply` run in CI/CD?
A) On every commit B) On every PR C) Only after merge to main D) Manually only

<details><summary>Answer</summary>**C) Only after merge to main** — plan on PR, apply on merge</details>

### Q2: Where should AWS credentials be stored in GitHub Actions?
A) In terraform.tfvars B) In the workflow YAML C) Repository Secrets D) README.md

<details><summary>Answer</summary>**C) Repository Secrets**</details>

### Q3: What does `-out=tfplan` enable in CI/CD?
A) Faster execution B) Applying the exact plan that was reviewed C) State backup D) Log output

<details><summary>Answer</summary>**B) Applying the exact plan that was reviewed**</details>

### Q4: What does `when: manual` do in GitLab CI?
A) Runs automatically B) Requires manual trigger in the UI C) Sends an email D) Pauses for input

<details><summary>Answer</summary>**B) Requires manual trigger** — click to approve in GitLab UI</details>

### Q5: Why run `terraform fmt -check` in CI?
A) To fix formatting B) To fail the pipeline if code isn't formatted C) To prettify output D) To validate syntax

<details><summary>Answer</summary>**B) To fail the pipeline if code isn't formatted** — enforces coding standards</details>

---

**Next**: [Module 16 →](../module-16-gitops/theory.md)
