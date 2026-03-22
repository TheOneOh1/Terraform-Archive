# Module 10 — Lab: Migrate to Remote State

## 🎯 Lab Objectives
Set up S3+DynamoDB backend, migrate local state, and test workspaces.

**Estimated Time**: 40 minutes

---

## Step 1: Create Backend Infrastructure

```bash
mkdir -p ~/terraform-labs/module-10-backend-setup
cd ~/terraform-labs/module-10-backend-setup
```

Create `main.tf`:
```hcl
terraform {
  required_providers {
    aws    = { source = "hashicorp/aws", version = "~> 5.0" }
    random = { source = "hashicorp/random", version = "~> 3.0" }
  }
}
provider "aws" { region = "us-east-1" }
resource "random_id" "suffix" { byte_length = 4 }

resource "aws_s3_bucket" "state" {
  bucket        = "tf-state-bootcamp-${random_id.suffix.hex}"
  force_destroy = true
}

resource "aws_s3_bucket_versioning" "state" {
  bucket = aws_s3_bucket.state.id
  versioning_configuration { status = "Enabled" }
}

resource "aws_dynamodb_table" "locks" {
  name         = "tf-state-locks-${random_id.suffix.hex}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"
  attribute { name = "LockID"; type = "S" }
}

output "state_bucket" { value = aws_s3_bucket.state.bucket }
output "lock_table" { value = aws_dynamodb_table.locks.name }
```

```bash
terraform init && terraform apply -auto-approve
# Note the bucket and table names from output!
```

---

## Step 2: Create a Project with Local State

```bash
mkdir -p ~/terraform-labs/module-10-remote-project
cd ~/terraform-labs/module-10-remote-project
```

Create `main.tf` (without backend yet):
```hcl
terraform {
  required_providers {
    aws    = { source = "hashicorp/aws", version = "~> 5.0" }
    random = { source = "hashicorp/random", version = "~> 3.0" }
  }
}
provider "aws" { region = "us-east-1" }
resource "random_id" "suffix" { byte_length = 4 }

resource "aws_s3_bucket" "app" {
  bucket        = "remote-state-lab-${random_id.suffix.hex}"
  force_destroy = true
  tags          = { Environment = "dev" }
}

output "bucket_name" { value = aws_s3_bucket.app.bucket }
```

```bash
terraform init && terraform apply -auto-approve
ls terraform.tfstate  # Local state exists
```

---

## Step 3: Add Remote Backend and Migrate

Add the backend block to `main.tf`:
```hcl
terraform {
  backend "s3" {
    bucket         = "REPLACE_WITH_STATE_BUCKET"
    key            = "module-10/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "REPLACE_WITH_LOCK_TABLE"
    encrypt        = true
  }
  # ... rest of required_providers
}
```

```bash
terraform init
# Terraform will ask: "Do you want to migrate all workspaces to s3?"
# Type: yes

# Verify local state is gone / state is remote
ls terraform.tfstate  # Should be empty or contain just backend info
terraform state list  # Still shows your resources (from S3 now)
```

---

## Step 4: Test Workspaces

```bash
terraform workspace new staging
terraform workspace list
terraform apply -auto-approve  # Creates separate resources in staging workspace
terraform workspace select default
terraform workspace list
```

---

## Step 5: Clean Up

```bash
# Destroy resources in all workspaces
terraform workspace select staging
terraform destroy -auto-approve
terraform workspace select default
terraform destroy -auto-approve

# Destroy backend infrastructure
cd ~/terraform-labs/module-10-backend-setup
terraform destroy -auto-approve
```

---

## ✅ Lab Checklist
- [ ] Backend S3 bucket and DynamoDB table created
- [ ] Local state migrated to S3
- [ ] Remote state verified with `terraform state list`
- [ ] Workspaces created and tested
- [ ] All resources destroyed in all workspaces

---

**Next**: [Assignment →](assignment.md)
