# Module 09 — Lab: State Exploration & Import

## 🎯 Lab Objectives
Explore state commands, import an existing resource, and detect drift.

**Estimated Time**: 40 minutes

---

## Step 1: Create and Deploy

```bash
mkdir -p ~/terraform-labs/module-09-state && cd ~/terraform-labs/module-09-state
```

Create `main.tf`:
```hcl
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws    = { source = "hashicorp/aws", version = "~> 5.0" }
    random = { source = "hashicorp/random", version = "~> 3.0" }
  }
}
provider "aws" { region = "us-east-1" }
resource "random_id" "suffix" { byte_length = 4 }

resource "aws_s3_bucket" "managed" {
  bucket        = "state-lab-managed-${random_id.suffix.hex}"
  force_destroy = true
  tags          = { Name = "Managed Bucket", Lab = "module-09" }
}
```

```bash
terraform init && terraform apply -auto-approve
```

---

## Step 2: Explore State

```bash
terraform state list
terraform state show aws_s3_bucket.managed
terraform show
cat terraform.tfstate | head -40
```

---

## Step 3: Create a Bucket Manually (for Import)

```bash
aws s3 mb s3://state-lab-import-target-$(date +%s)
# Note the bucket name for the next step
```

---

## Step 4: Import the Manual Bucket

Add to `main.tf`:
```hcl
resource "aws_s3_bucket" "imported" {
  bucket        = "REPLACE_WITH_MANUAL_BUCKET_NAME"
  force_destroy = true
  tags          = { Name = "Imported Bucket", Lab = "module-09" }
}
```

```bash
terraform import aws_s3_bucket.imported REPLACE_WITH_MANUAL_BUCKET_NAME
terraform plan  # Adjust config until plan shows minimal changes
terraform apply -auto-approve
```

---

## Step 5: Simulate Drift

```bash
# Manually add a tag via AWS CLI
aws s3api put-bucket-tagging --bucket $(terraform output -raw managed_bucket_name 2>/dev/null || terraform state show aws_s3_bucket.managed | grep 'bucket ' | awk '{print $3}' | tr -d '"') --tagging 'TagSet=[{Key=Name,Value=Managed Bucket},{Key=Lab,Value=module-09},{Key=DriftTag,Value=manual}]'

# Detect drift
terraform plan -refresh-only
terraform apply -refresh-only -auto-approve

# Fix drift — apply desired state
terraform plan
terraform apply -auto-approve
```

---

## Step 6: State Move

```bash
# Rename a resource in state
terraform state mv aws_s3_bucket.managed aws_s3_bucket.primary
# Update the resource name in main.tf to match, then:
terraform plan  # Should show no changes
```

---

## Step 7: Clean Up

```bash
terraform destroy -auto-approve
```

---

## ✅ Lab Checklist
- [ ] Explored state with list, show, and raw JSON
- [ ] Imported an existing S3 bucket
- [ ] Detected drift after manual changes
- [ ] Used `terraform state mv` to rename
- [ ] Destroyed all resources

---

**Next**: [Assignment →](assignment.md)
