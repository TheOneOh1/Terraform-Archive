# Module 02 — Lab: HCL Syntax Practice

## 🎯 Lab Objectives

- Practice declaring variables with different types
- Use locals for computed values
- Create outputs to expose resource attributes
- Use data sources to query existing infrastructure
- Organize code across multiple files

**Estimated Time**: 40 minutes

---

## Step 1: Set Up the Project

```bash
mkdir -p ~/terraform-labs/module-02-hcl-practice
cd ~/terraform-labs/module-02-hcl-practice
```

---

## Step 2: Create the Variables File

Create `variables.tf`:

```hcl
# variables.tf — Input Variables

variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "hcl-practice"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "dev"

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be one of: dev, staging, prod."
  }
}

variable "enable_versioning" {
  description = "Enable S3 bucket versioning"
  type        = bool
  default     = true
}

variable "allowed_file_types" {
  description = "List of allowed file extensions"
  type        = list(string)
  default     = [".txt", ".csv", ".json", ".log"]
}

variable "bucket_tags" {
  description = "Additional tags for the S3 bucket"
  type        = map(string)
  default = {
    Team       = "DevOps"
    CostCenter = "CC-1234"
  }
}

variable "lifecycle_rules" {
  description = "S3 lifecycle rule configuration"
  type = list(object({
    id          = string
    enabled     = bool
    prefix      = string
    expiration_days = number
  }))
  default = [
    {
      id              = "archive-logs"
      enabled         = true
      prefix          = "logs/"
      expiration_days = 90
    },
    {
      id              = "cleanup-tmp"
      enabled         = true
      prefix          = "tmp/"
      expiration_days = 7
    }
  ]
}
```

---

## Step 3: Create the Locals File

Create `locals.tf`:

```hcl
# locals.tf — Computed Local Values

locals {
  # Naming convention
  name_prefix = "${var.project_name}-${var.environment}"

  # Merge default and custom tags
  common_tags = merge(
    {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "Terraform"
      Region      = var.aws_region
    },
    var.bucket_tags
  )

  # Conditional values
  is_production     = var.environment == "prod"
  versioning_status = var.enable_versioning ? "Enabled" : "Suspended"

  # Computed bucket name
  bucket_name = "${local.name_prefix}-storage-${random_id.suffix.hex}"

  # Transform list to a formatted string
  allowed_types_display = join(", ", var.allowed_file_types)
}
```

---

## Step 4: Create the Data Sources File

Create `data.tf`:

```hcl
# data.tf — Data Sources

# Get current AWS account information
data "aws_caller_identity" "current" {}

# Get current AWS region
data "aws_region" "current" {}

# Get available AZs in the current region
data "aws_availability_zones" "available" {
  state = "available"
}
```

---

## Step 5: Create the Main Configuration

Create `main.tf`:

```hcl
# main.tf — Resources

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
  region = var.aws_region
}

# Random suffix for unique names
resource "random_id" "suffix" {
  byte_length = 4
}

# S3 Bucket
resource "aws_s3_bucket" "storage" {
  bucket = local.bucket_name
  tags   = local.common_tags
}

# Bucket versioning (conditional)
resource "aws_s3_bucket_versioning" "storage" {
  bucket = aws_s3_bucket.storage.id

  versioning_configuration {
    status = local.versioning_status
  }
}

# Server-side encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "storage" {
  bucket = aws_s3_bucket.storage.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Block public access
resource "aws_s3_bucket_public_access_block" "storage" {
  bucket = aws_s3_bucket.storage.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
```

---

## Step 6: Create the Outputs File

Create `outputs.tf`:

```hcl
# outputs.tf — Output Values

output "bucket_name" {
  description = "The S3 bucket name"
  value       = aws_s3_bucket.storage.bucket
}

output "bucket_arn" {
  description = "The S3 bucket ARN"
  value       = aws_s3_bucket.storage.arn
}

output "bucket_region" {
  description = "The S3 bucket region"
  value       = aws_s3_bucket.storage.region
}

output "versioning_status" {
  description = "Bucket versioning status"
  value       = local.versioning_status
}

output "aws_account_id" {
  description = "Current AWS account ID"
  value       = data.aws_caller_identity.current.account_id
}

output "aws_region" {
  description = "Current AWS region"
  value       = data.aws_region.current.name
}

output "available_azs" {
  description = "Available Availability Zones"
  value       = data.aws_availability_zones.available.names
}

output "all_tags" {
  description = "All tags applied to resources"
  value       = local.common_tags
}

output "is_production" {
  description = "Whether this is a production environment"
  value       = local.is_production
}

output "allowed_types" {
  description = "Allowed file types"
  value       = local.allowed_types_display
}
```

---

## Step 7: Create a tfvars File

Create `dev.tfvars`:

```hcl
# dev.tfvars — Development values

aws_region         = "us-east-1"
project_name       = "hcl-practice"
environment        = "dev"
enable_versioning  = true
allowed_file_types = [".txt", ".csv", ".json", ".log", ".yaml"]

bucket_tags = {
  Team       = "DevOps"
  CostCenter = "CC-1234"
  Sprint     = "2026-Q1"
}
```

---

## Step 8: Initialize and Apply

```bash
# Initialize
terraform init

# Validate
terraform validate

# Format
terraform fmt

# Plan with specific var file
terraform plan -var-file="dev.tfvars"

# Apply
terraform apply -var-file="dev.tfvars"
```

---

## Step 9: Explore Outputs

```bash
# View all outputs
terraform output

# View a specific output
terraform output bucket_name
terraform output -json all_tags

# View output as raw string (no quotes)
terraform output -raw bucket_name
```

---

## Step 10: Test Variable Validation

Try setting an invalid environment:

```bash
terraform plan -var="environment=invalid"
```

Expected error:
```
Error: Invalid value for variable

  on variables.tf line X:
  X: variable "environment" {

Environment must be one of: dev, staging, prod.
```

---

## Step 11: Clean Up

```bash
terraform destroy -var-file="dev.tfvars" -auto-approve
```

---

## ✅ Lab Checklist

- [ ] Created `variables.tf` with string, bool, list, map, and object types
- [ ] Created `locals.tf` with computed values (merge, conditionals)
- [ ] Created `data.tf` with data sources (caller_identity, region, AZs)
- [ ] Created `main.tf` with resources using variables and locals
- [ ] Created `outputs.tf` exposing resource attributes and computed values
- [ ] Used `terraform plan -var-file` to supply variable values
- [ ] Ran `terraform apply` and inspected outputs
- [ ] Tested variable validation
- [ ] Destroyed all resources

---

**Next**: [Assignment →](assignment.md)
