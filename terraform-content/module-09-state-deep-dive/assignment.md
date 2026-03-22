# Module 09 — Assignment & Quiz

## Assignment
Import 2 manually created AWS resources (S3 bucket + IAM role) into Terraform. Document the drift detection and remediation process.

### Checklist
- [ ] 2 resources created manually and imported
- [ ] `terraform plan` shows no changes post-import
- [ ] Drift simulated and fixed
- [ ] All resources destroyed

---

## Quiz

### Q1: What is the primary purpose of state?
A) Store credentials B) Map config to real resources C) Cache provider plugins D) Log changes

<details><summary>Answer</summary>**B) Map config to real resources**</details>

### Q2: Which command imports existing resources?
A) `terraform add` B) `terraform import` C) `terraform adopt` D) `terraform attach`

<details><summary>Answer</summary>**B) `terraform import`**</details>

### Q3: What does `terraform state rm` do?
A) Deletes the resource from AWS B) Removes from state only C) Deletes state file D) Removes provider

<details><summary>Answer</summary>**B) Removes from state only** — the actual resource is NOT deleted</details>

### Q4: What is configuration drift?
A) Terraform version mismatch B) Difference between config/state and actual infra C) Network latency D) Module version conflict

<details><summary>Answer</summary>**B) Difference between config/state and actual infrastructure**</details>

### Q5: Should you commit terraform.tfstate to Git?
A) Yes, always B) Only for personal projects C) No — use remote backends D) Only in production

<details><summary>Answer</summary>**C) No — use remote backends**</details>

---

**Next**: [Module 10 →](../module-10-remote-state/theory.md)
