# Module 10 — Remote State & Locking

## 🎯 Learning Objectives

- Configure S3 + DynamoDB as a remote backend
- Understand state locking and consistency
- Use Terraform workspaces for environment isolation
- Migrate local state to remote state

---

## 1. Why Remote State?

```
Local State Problems:
┌────────────────────────────────────────────────────┐
│ Developer A                Developer B             │
│ ┌──────────────┐          ┌──────────────┐        │
│ │ terraform    │          │ terraform    │        │
│ │ .tfstate     │    ❌    │ .tfstate     │        │
│ │ (local copy) │ conflict │ (local copy) │        │
│ └──────────────┘          └──────────────┘        │
│                                                    │
│ Remote State Solution:                             │
│ ┌──────────────┐          ┌──────────────┐        │
│ │ Developer A  │          │ Developer B  │        │
│ └──────┬───────┘          └──────┬───────┘        │
│        │                         │                 │
│        └────────┬────────────────┘                 │
│                 ▼                                  │
│        ┌────────────────┐  ┌──────────────┐       │
│        │  S3 Bucket     │  │ DynamoDB     │       │
│        │  (state file)  │  │ (lock table) │       │
│        └────────────────┘  └──────────────┘       │
└────────────────────────────────────────────────────┘
```

---

## 2. S3 Backend Configuration

### Step 1: Create Backend Resources (manually or separate project)

```hcl
# backend-setup/main.tf — Run this FIRST, separately
provider "aws" { region = "us-east-1" }

resource "aws_s3_bucket" "terraform_state" {
  bucket = "my-terraform-state-UNIQUE"
  lifecycle { prevent_destroy = true }
}

resource "aws_s3_bucket_versioning" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id
  versioning_configuration { status = "Enabled" }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id
  rule {
    apply_server_side_encryption_by_default { sse_algorithm = "AES256" }
  }
}

resource "aws_dynamodb_table" "terraform_locks" {
  name         = "terraform-state-locks"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"
  attribute {
    name = "LockID"
    type = "S"
  }
}
```

### Step 2: Configure the Backend

```hcl
# In your project's main.tf
terraform {
  backend "s3" {
    bucket         = "my-terraform-state-UNIQUE"
    key            = "project-name/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-state-locks"
    encrypt        = true
  }
}
```

### Step 3: Initialize with Backend

```bash
terraform init
# Terraform will ask to migrate local state to S3
```

---

## 3. State Locking

```
Locking Flow:
┌─────────────┐     ┌──────────────┐     ┌────────────────┐
│ terraform   │────▶│ Acquire Lock │────▶│ Read/Write     │
│ apply       │     │ (DynamoDB)   │     │ State (S3)     │
└─────────────┘     └──────────────┘     └────────┬───────┘
                                                   │
                                                   ▼
                                          ┌────────────────┐
                                          │ Release Lock   │
                                          │ (DynamoDB)     │
                                          └────────────────┘
```

---

## 4. Workspaces

```bash
# List workspaces
terraform workspace list

# Create new workspace
terraform workspace new staging
terraform workspace new production

# Switch workspace
terraform workspace select staging

# Current workspace
terraform workspace show
```

```hcl
# Use workspace in config
resource "aws_s3_bucket" "data" {
  bucket = "app-data-${terraform.workspace}"
  tags   = { Environment = terraform.workspace }
}
```

---

## 📝 Key Takeaways

1. **Remote state** enables team collaboration and prevents conflicts
2. **S3 + DynamoDB** is the standard AWS backend pattern
3. **State locking** prevents concurrent modifications
4. **Workspaces** provide lightweight environment isolation
5. Always **encrypt** state and use **versioning** on the state bucket

---

**Next**: [Lab →](lab.md)
