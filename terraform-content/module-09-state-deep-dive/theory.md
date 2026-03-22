# Module 09 — Terraform State Deep Dive

## 🎯 Learning Objectives

- Understand what state is and why it's critical
- Read and interpret the state file structure
- Master state manipulation commands
- Import existing resources into Terraform
- Detect and remediate configuration drift

---

## 1. What Is Terraform State?

State is Terraform's **record** of what it manages. It maps your HCL configuration to real-world infrastructure.

```
State — The Bridge:
┌───────────────┐     ┌────────────────┐     ┌──────────────────┐
│  Your Config  │     │  State File    │     │  Real Resources  │
│  (*.tf files) │◀───▶│ (tfstate)      │◀───▶│  (AWS, Azure...) │
│               │     │                │     │                  │
│  Desired      │     │  Known         │     │  Actual          │
│  State        │     │  State         │     │  State           │
└───────────────┘     └────────────────┘     └──────────────────┘
                             │
                      terraform plan
                      compares all three
```

### Why State Matters

1. **Performance**: State caches resource attributes so Terraform doesn't query every API on every plan
2. **Mapping**: Maps config resource names to real resource IDs
3. **Dependencies**: Tracks dependency order for correct create/destroy sequencing
4. **Drift Detection**: Compares state to actual infrastructure to find unauthorized changes

---

## 2. State File Anatomy

```json
{
  "version": 4,
  "terraform_version": "1.7.0",
  "serial": 5,
  "lineage": "abc123-def456-...",
  "outputs": {
    "bucket_name": {
      "value": "my-bucket-abc123",
      "type": "string"
    }
  },
  "resources": [
    {
      "mode": "managed",
      "type": "aws_s3_bucket",
      "name": "data",
      "provider": "provider[\"registry.terraform.io/hashicorp/aws\"]",
      "instances": [
        {
          "schema_version": 0,
          "attributes": {
            "id": "my-bucket-abc123",
            "arn": "arn:aws:s3:::my-bucket-abc123",
            "bucket": "my-bucket-abc123",
            "region": "us-east-1",
            "tags": { "Name": "Data Bucket" }
          }
        }
      ]
    }
  ]
}
```

> ⚠️ **Never manually edit** the state file. Use `terraform state` commands instead.

---

## 3. State Commands

```bash
# List all resources in state
terraform state list

# Show detailed info for a resource
terraform state show aws_s3_bucket.data

# Move/rename a resource in state
terraform state mv aws_s3_bucket.old aws_s3_bucket.new

# Remove a resource from state (without destroying it)
terraform state rm aws_s3_bucket.data

# Pull remote state to local file
terraform state pull > state.json

# Push local state to remote backend
terraform state push state.json

# Replace provider in state
terraform state replace-provider hashicorp/aws registry.example.com/aws
```

---

## 4. Terraform Import

Import existing (manually created) resources into Terraform management.

```bash
# Import an existing S3 bucket
terraform import aws_s3_bucket.imported my-existing-bucket

# Import an EC2 instance
terraform import aws_instance.web i-1234567890abcdef0

# Import an IAM role
terraform import aws_iam_role.admin admin-role-name
```

### Import Workflow

```
Import Process:
1. Write the resource block in .tf (matching the real resource)
2. Run terraform import
3. Run terraform plan (should show no changes if config matches)
4. Adjust config until plan shows 0 changes
```

---

## 5. Drift Detection

```
Configuration Drift:
┌──────────────┐     ┌──────────────┐     ┌───────────────┐
│   Config     │     │    State     │     │   Actual      │
│   (code)     │     │  (tfstate)   │     │ (cloud infra) │
│              │     │              │     │               │
│  bucket:     │     │  bucket:     │     │  bucket:      │
│   tags: A,B  │     │   tags: A,B  │     │   tags: A,B,C │
└──────────────┘     └──────────────┘     └───────────────┘
                                                   ▲
                                                   │
                                            Manual change!
                                            (drift detected)
```

```bash
# Detect drift (refresh state from actual infra)
terraform plan -refresh-only

# Apply refresh to update state
terraform apply -refresh-only

# Then plan to fix drift
terraform plan  # Shows changes to reconcile drift
terraform apply # Applies config back to desired state
```

---

## 📝 Key Takeaways

1. **State** is Terraform's source of truth for what it manages
2. The state file contains **sensitive data** — secure it appropriately
3. Use `terraform state` commands — **never edit state files manually**
4. `terraform import` brings existing resources under Terraform management
5. Regular `terraform plan` detects **configuration drift**
6. State should be stored **remotely** for teams (covered in Module 10)

---

**Next**: [Lab →](lab.md)
