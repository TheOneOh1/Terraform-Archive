# Module 04 — Lab: Full Terraform Lifecycle

## 🎯 Lab Objectives

- Execute the full lifecycle: init → plan → apply → modify → plan → apply → destroy
- Read and interpret execution plans with creates, updates, and deletes
- Use CLI flags for plan output and auto-approve
- Explore the dependency graph

**Estimated Time**: 40 minutes

---

## Step 1: Set Up

```bash
mkdir -p ~/terraform-labs/module-04-workflow
cd ~/terraform-labs/module-04-workflow
```

---

## Step 2: Create the Configuration

Create `main.tf`:

```hcl
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

resource "random_id" "suffix" {
  byte_length = 4
}

# --- S3 Bucket ---
resource "aws_s3_bucket" "data" {
  bucket = "workflow-lab-${random_id.suffix.hex}"
  tags = {
    Name        = "Workflow Lab"
    Environment = "dev"
    Step        = "1-initial"
  }
}

resource "aws_s3_bucket_versioning" "data" {
  bucket = aws_s3_bucket.data.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "data" {
  bucket = aws_s3_bucket.data.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}
```

Create `outputs.tf`:

```hcl
output "bucket_name" {
  value = aws_s3_bucket.data.bucket
}

output "bucket_arn" {
  value = aws_s3_bucket.data.arn
}
```

---

## Step 3: Initialize

```bash
terraform init
```

Observe:
- Provider downloads
- Lock file creation

---

## Step 4: Validate and Format

```bash
terraform validate
terraform fmt
```

---

## Step 5: Plan and Save

```bash
# Save the plan to a file
terraform plan -out=step1.tfplan

# The plan file is binary — you can show it:
terraform show step1.tfplan
```

---

## Step 6: Apply the Saved Plan

```bash
# Apply the exact saved plan (no prompt needed)
terraform apply step1.tfplan
```

Note: When applying a saved plan, Terraform doesn't ask for confirmation.

---

## Step 7: Verify

```bash
# View state
terraform show

# List resources
terraform state list

# Check specific resource
terraform state show aws_s3_bucket.data

# View outputs
terraform output
terraform output bucket_name
```

---

## Step 8: Make a Change (Update)

Edit `main.tf` — change the `Step` tag:

```hcl
  tags = {
    Name        = "Workflow Lab"
    Environment = "dev"
    Step        = "2-updated"      # Changed from "1-initial"
    UpdatedBy   = "terraform-lab"  # New tag
  }
```

```bash
terraform plan
```

Observe the `~` (update in-place) symbol:
```
  ~ resource "aws_s3_bucket" "data" {
      ~ tags = {
          ~ "Step"      = "1-initial" -> "2-updated"
          + "UpdatedBy" = "terraform-lab"
        }
    }

Plan: 0 to add, 1 to change, 0 to destroy.
```

```bash
terraform apply -auto-approve
```

---

## Step 9: Force Replacement

```bash
# Force-replace a resource (recreate it)
terraform plan -replace=aws_s3_bucket.data
```

Observe `-/+` (destroy and recreate). **Don't apply this** — just observe the plan.

---

## Step 10: Target Specific Resources

```bash
# Plan only for a specific resource
terraform plan -target=aws_s3_bucket_versioning.data
```

> ⚠️ `-target` is for exceptional situations only. Don't rely on it in normal workflows.

---

## Step 11: Visualize Dependencies

```bash
# View the dependency graph (text format)
terraform graph
```

---

## Step 12: Destroy

```bash
# Preview what will be destroyed
terraform plan -destroy

# Destroy everything
terraform destroy -auto-approve
```

---

## ✅ Lab Checklist

- [ ] Initialized project with `terraform init`
- [ ] Saved plan with `-out=step1.tfplan`
- [ ] Applied saved plan
- [ ] Verified state with `terraform show` and `terraform state list`
- [ ] Made a change and observed `~ update in-place`
- [ ] Observed `-replace` behavior
- [ ] Used `-target` for a specific resource
- [ ] Viewed the dependency graph
- [ ] Destroyed all resources

---

**Next**: [Assignment →](assignment.md)
