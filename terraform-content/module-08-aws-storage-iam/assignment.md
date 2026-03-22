# Module 08 — Assignment & Quiz

## Assignment
Create an S3 static website hosting configuration with a separate IAM policy allowing `s3:PutObject` for deployment. Include lifecycle rules and cross-origin configuration.

### Checklist
- [ ] S3 bucket configured for static website hosting
- [ ] IAM role/policy for deployment (`s3:PutObject`)
- [ ] Lifecycle rules for old versions
- [ ] Outputs including website URL
- [ ] All resources destroyed

---

## Quiz

### Q1: Which resource enables S3 versioning?
A) `aws_s3_bucket` B) `aws_s3_bucket_versioning` C) `aws_s3_versioning` D) `aws_s3_bucket_version`

<details><summary>Answer</summary>**B) `aws_s3_bucket_versioning`**</details>

### Q2: What data source creates IAM policies cleanly?
A) `aws_iam_policy` B) `aws_iam_policy_document` C) `aws_iam_json` D) `aws_policy_builder`

<details><summary>Answer</summary>**B) `aws_iam_policy_document`** — a data source that generates policy JSON</details>

### Q3: What connects an IAM role to an EC2 instance?
A) Role attachment B) Instance profile C) Policy binding D) Role assignment

<details><summary>Answer</summary>**B) Instance profile** — `aws_iam_instance_profile`</details>

### Q4: What does `force_destroy = true` do on an S3 bucket?
A) Skips confirmation B) Deletes bucket contents before deletion C) Forces encryption D) Immediately destroys

<details><summary>Answer</summary>**B) Deletes bucket contents** — allows Terraform to delete a non-empty bucket</details>

### Q5: Which encryption algorithm is available in S3 Free Tier?
A) AES128 B) AES256 (SSE-S3) C) KMS D) RSA

<details><summary>Answer</summary>**B) AES256 (SSE-S3)** — free S3-managed encryption</details>

---

**Next Phase**: [Module 09 — State Deep Dive →](../module-09-state-deep-dive/theory.md)
