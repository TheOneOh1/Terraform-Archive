# Module 14 — Lab & Assignment & Quiz

## Lab: Harden Infrastructure
Take the S3+IAM setup from Module 08 and add: SSM parameters for secrets, tighter security groups, encryption, and run Checkov scan.

### Steps
1. Store a secret in SSM Parameter Store
2. Read the secret via `data "aws_ssm_parameter"`
3. Create security groups with minimal access
4. Run `checkov -d .` and fix any findings
5. Destroy all resources

---

## Assignment
Create a security-hardened deployment: S3 with KMS encryption, IAM roles with least privilege, SSM for all secrets, and NACLs. Pass Checkov scan with 0 failures.

### Checklist
- [ ] SSM parameters for secrets
- [ ] Minimal security group rules
- [ ] S3 encryption and public access blocked
- [ ] Checkov scan passing
- [ ] Destroyed

---

## Quiz

### Q1: Where should you store database passwords for Terraform?
A) terraform.tfvars (committed) B) Hardcoded in config C) SSM Parameter Store or env vars D) README.md

<details><summary>Answer</summary>**C) SSM Parameter Store or environment variables**</details>

### Q2: What type of SSM parameter encrypts the value?
A) String B) StringList C) SecureString D) EncryptedString

<details><summary>Answer</summary>**C) SecureString**</details>

### Q3: Which tool scans Terraform for security misconfigurations?
A) terraform validate B) terraform lint C) checkov / tfsec D) terraform scan

<details><summary>Answer</summary>**C) checkov / tfsec**</details>

### Q4: What's the Terraform way to restrict SSH access?
A) Disable port 22 B) Use SSM Session Manager instead C) Allow only 0.0.0.0/0 D) Use port 2222

<details><summary>Answer</summary>**B) Use SSM Session Manager** — no need to open port 22</details>

### Q5: What does `prevent_destroy = true` in a lifecycle block do?
A) Prevents terraform apply B) Prevents resource from being destroyed via terraform C) Prevents state deletion D) Prevents updates

<details><summary>Answer</summary>**B) Prevents resource from being destroyed via terraform**</details>

---

**Next Phase**: [Module 15 →](../module-15-cicd-pipelines/theory.md)
