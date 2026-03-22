# Module 10 — Assignment & Quiz

## Assignment
Set up a complete remote backend with S3 + DynamoDB. Deploy identical infrastructure in two workspaces (dev and staging). Document the state key paths in S3.

### Checklist
- [ ] Backend S3 bucket with versioning and encryption
- [ ] DynamoDB lock table
- [ ] Resources deployed in dev and staging workspaces
- [ ] State files verified in S3
- [ ] All resources destroyed

---

## Quiz

### Q1: Which AWS services form the standard Terraform remote backend?
A) EC2 + RDS B) S3 + DynamoDB C) ECS + ElastiCache D) Lambda + SQS

<details><summary>Answer</summary>**B) S3 + DynamoDB** — S3 for state storage, DynamoDB for locking</details>

### Q2: What does DynamoDB provide for Terraform state?
A) Encryption B) Versioning C) Locking D) Replication

<details><summary>Answer</summary>**C) Locking** — prevents concurrent modifications</details>

### Q3: Which command migrates local state to remote?
A) `terraform migrate` B) `terraform init` C) `terraform push` D) `terraform backend`

<details><summary>Answer</summary>**B) `terraform init`** — with the backend block configured, init offers migration</details>

### Q4: What does `terraform.workspace` return?
A) The project name B) The current workspace name C) The backend type D) The state file path

<details><summary>Answer</summary>**B) The current workspace name**</details>

### Q5: Where should backend configuration values come from in CI/CD?
A) Hardcoded in .tf files B) Backend config file or CLI flags C) terraform.tfvars D) Manual input

<details><summary>Answer</summary>**B) Backend config file or CLI flags** — `terraform init -backend-config=backend.hcl`</details>

---

**Next Phase**: [Module 11 →](../module-11-creating-modules/theory.md)
