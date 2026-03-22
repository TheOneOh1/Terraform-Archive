# Module 03 — Quiz: Terraform Providers

---

### Question 1
What command downloads and installs provider plugins?

- A) `terraform get`
- B) `terraform providers`
- C) `terraform init`
- D) `terraform install`

<details><summary>Answer</summary>

**C) `terraform init`** — Downloads providers and initializes the backend.

</details>

---

### Question 2
Where are downloaded providers stored on disk?

- A) `/usr/local/terraform/`
- B) `~/.terraform/`
- C) `.terraform/providers/`
- D) `/etc/terraform/plugins/`

<details><summary>Answer</summary>

**C) `.terraform/providers/`** — Provider plugins are stored in the local `.terraform/` directory.

</details>

---

### Question 3
What does `version = "~> 5.0"` mean?

- A) Exactly version 5.0
- B) Version 5.0 or any newer version
- C) >= 5.0.0 and < 6.0.0
- D) >= 5.0.0 and < 5.1.0

<details><summary>Answer</summary>

**C) >= 5.0.0 and < 6.0.0** — The `~>` operator allows the rightmost component to increment.

</details>

---

### Question 4
Should `.terraform.lock.hcl` be committed to Git?

- A) No, it's auto-generated
- B) Yes, to ensure consistent provider versions
- C) Only in production
- D) It doesn't matter

<details><summary>Answer</summary>

**B) Yes** — The lock file ensures all team members use the exact same provider versions.

</details>

---

### Question 5
How do you use a provider alias in a resource?

- A) `region = aws.west`
- B) `provider = aws.west`
- C) `alias = aws.west`
- D) `providers = [aws.west]`

<details><summary>Answer</summary>

**B) `provider = aws.west`** — The `provider` meta-argument specifies which provider configuration to use.

</details>

---

### Question 6
What is the safest way to provide AWS credentials to Terraform?

- A) Hardcode in the provider block
- B) Store in `terraform.tfvars`
- C) Use environment variables or IAM roles
- D) Pass as command-line arguments

<details><summary>Answer</summary>

**C) Use environment variables or IAM roles** — Never hardcode credentials in configuration files.

</details>

---

### Question 7
What does `default_tags` in the AWS provider do?

- A) Requires all resources to have tags
- B) Automatically applies specified tags to all AWS resources
- C) Creates a default tag key in IAM
- D) Tags the provider plugin itself

<details><summary>Answer</summary>

**B) Automatically applies specified tags to all AWS resources** — Tags defined in `default_tags` are inherited by all resources managed by that provider.

</details>

---

### Question 8
How many providers can a single Terraform configuration use?

- A) Only 1
- B) Up to 5
- C) Up to 10
- D) Unlimited

<details><summary>Answer</summary>

**D) Unlimited** — You can use as many providers as needed in a single configuration.

</details>

---

### Question 9
What is the full source address for the AWS provider?

- A) `aws`
- B) `amazon/aws`
- C) `registry.terraform.io/hashicorp/aws`
- D) `hashicorp.com/aws`

<details><summary>Answer</summary>

**C) `registry.terraform.io/hashicorp/aws`** — In `required_providers`, `hashicorp/aws` is shorthand for the full registry address.

</details>

---

### Question 10
What happens if you run `terraform init` again after providers are already downloaded?

- A) An error occurs
- B) Providers are re-downloaded from scratch
- C) Terraform verifies existing providers against constraints and updates if needed
- D) Nothing happens

<details><summary>Answer</summary>

**C) Terraform verifies existing providers against constraints and updates if needed** — Re-initializing is safe and idempotent. Use `terraform init -upgrade` to force provider updates.

</details>

---

## 📊 Score Yourself

| Score | Rating |
|-------|--------|
| 9–10 | ⭐ Excellent |
| 7–8 | 👍 Good |
| 5–6 | 📖 Fair |
| < 5 | 🔄 Review |

---

**Next**: [Project →](project/README.md)
