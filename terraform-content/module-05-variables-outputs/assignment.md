# Module 05 — Assignment & Quiz

## Assignment: Dynamic AMI Lookup + Parameterized Infrastructure

Create a project that uses a data source to look up the latest Amazon Linux AMI and creates an S3 bucket with fully parameterized configuration. Include variable validation, sensitive outputs, and at least two tfvars files.

### 🏁 Checklist
- [ ] Dynamic AMI lookup via `data "aws_ami"`
- [ ] At least 6 variables with different types
- [ ] 2+ validation blocks
- [ ] At least 1 sensitive output
- [ ] `dev.tfvars` and `staging.tfvars`
- [ ] Tested and destroyed

---

## Quiz

### Q1: What is the highest-precedence way to set a variable?
A) terraform.tfvars  B) Default value  C) -var CLI flag  D) Environment variable

<details><summary>Answer</summary>**C) -var CLI flag**</details>

### Q2: How do you reference a data source attribute?
A) `source.type.name.attr` B) `data.type.name.attr` C) `ref.type.name.attr` D) `query.type.name.attr`

<details><summary>Answer</summary>**B) `data.type.name.attr`**</details>

### Q3: What does `sensitive = true` on a variable do?
A) Encrypts the state file B) Prevents the value from showing in plan/apply output C) Hides it from the state D) Requires MFA

<details><summary>Answer</summary>**B) Prevents the value from showing in plan/apply output**</details>

### Q4: Which file is auto-loaded by Terraform?
A) `vars.tf` B) `custom.tfvars` C) `terraform.tfvars` D) `defaults.tfvars`

<details><summary>Answer</summary>**C) `terraform.tfvars`**</details>

### Q5: What happens when a required variable has no default and isn't supplied?
A) Terraform uses null B) Terraform errors C) Terraform prompts interactively D) Terraform skips the resource

<details><summary>Answer</summary>**C) Terraform prompts interactively**</details>

### Q6: Can data sources create resources?
A) Yes B) No — they are read-only C) Only in certain providers D) Only with apply

<details><summary>Answer</summary>**B) No — they are read-only**</details>

### Q7: How do you view a specific output value?
A) `terraform show output_name` B) `terraform output output_name` C) `terraform get output_name` D) `terraform read output_name`

<details><summary>Answer</summary>**B) `terraform output output_name`**</details>

### Q8: What environment variable prefix sets Terraform variables?
A) `TERRAFORM_` B) `TF_` C) `TF_VAR_` D) `VAR_`

<details><summary>Answer</summary>**C) `TF_VAR_`**</details>

### Q9: Files matching which pattern are auto-loaded?
A) `*.tf` B) `*.auto.tfvars` C) `*.vars` D) `*.config`

<details><summary>Answer</summary>**B) `*.auto.tfvars`**</details>

### Q10: What does the `nullable` argument on a variable control?
A) Whether empty strings are allowed B) Whether the variable can be set to null C) Whether the variable is optional D) Whether the variable is sensitive

<details><summary>Answer</summary>**B) Whether the variable can be set to null**</details>

---

**Next Module**: [Module 06 — AWS Networking →](../module-06-aws-networking/theory.md)
