# Module 03 — Lab: Provider Configuration

## 🎯 Lab Objectives

- Configure the AWS provider with version constraints
- Use provider aliases for multi-region resources
- Work with multiple providers (AWS + Random)
- Explore the `.terraform/` directory and lock file

**Estimated Time**: 30 minutes

---

## Step 1: Create the Project

```bash
mkdir -p ~/terraform-labs/module-03-providers
cd ~/terraform-labs/module-03-providers
```

---

## Step 2: Create versions.tf

```hcl
# versions.tf

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
```

---

## Step 3: Create providers.tf

```hcl
# providers.tf

# Default AWS provider — US East
provider "aws" {
  region = var.primary_region

  default_tags {
    tags = {
      ManagedBy   = "Terraform"
      Project     = var.project_name
      Environment = var.environment
    }
  }
}

# Secondary AWS provider — US West
provider "aws" {
  alias  = "secondary"
  region = var.secondary_region

  default_tags {
    tags = {
      ManagedBy   = "Terraform"
      Project     = var.project_name
      Environment = var.environment
    }
  }
}
```

---

## Step 4: Create variables.tf

```hcl
# variables.tf

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "provider-lab"
}

variable "environment" {
  description = "Environment"
  type        = string
  default     = "dev"
}

variable "primary_region" {
  description = "Primary AWS region"
  type        = string
  default     = "us-east-1"
}

variable "secondary_region" {
  description = "Secondary AWS region"
  type        = string
  default     = "us-west-2"
}
```

---

## Step 5: Create main.tf

```hcl
# main.tf

resource "random_id" "suffix" {
  byte_length = 4
}

# S3 bucket in primary region (us-east-1)
resource "aws_s3_bucket" "primary" {
  bucket = "${var.project_name}-primary-${random_id.suffix.hex}"

  tags = {
    Name   = "Primary Bucket"
    Region = var.primary_region
  }
}

# S3 bucket in secondary region (us-west-2)
resource "aws_s3_bucket" "secondary" {
  provider = aws.secondary
  bucket   = "${var.project_name}-secondary-${random_id.suffix.hex}"

  tags = {
    Name   = "Secondary Bucket"
    Region = var.secondary_region
  }
}

# Block public access — primary
resource "aws_s3_bucket_public_access_block" "primary" {
  bucket                  = aws_s3_bucket.primary.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Block public access — secondary
resource "aws_s3_bucket_public_access_block" "secondary" {
  provider                = aws.secondary
  bucket                  = aws_s3_bucket.secondary.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
```

---

## Step 6: Create outputs.tf

```hcl
# outputs.tf

output "primary_bucket" {
  description = "Primary S3 bucket details"
  value = {
    name   = aws_s3_bucket.primary.bucket
    region = aws_s3_bucket.primary.region
    arn    = aws_s3_bucket.primary.arn
  }
}

output "secondary_bucket" {
  description = "Secondary S3 bucket details"
  value = {
    name   = aws_s3_bucket.secondary.bucket
    region = aws_s3_bucket.secondary.region
    arn    = aws_s3_bucket.secondary.arn
  }
}
```

---

## Step 7: Init, Plan, Apply

```bash
# Initialize — watch providers download
terraform init

# Explore what was downloaded
ls -la .terraform/providers/registry.terraform.io/hashicorp/

# View the lock file
cat .terraform.lock.hcl

# Plan
terraform plan

# Apply
terraform apply -auto-approve
```

---

## Step 8: Verify Multi-Region Deployment

```bash
# Check primary region
aws s3 ls --region us-east-1 | grep provider-lab

# Check secondary region
aws s3 ls --region us-west-2 | grep provider-lab
```

---

## Step 9: Explore Provider Commands

```bash
# List installed providers
terraform providers

# Show provider details
terraform providers schema -json | head -100

# Show dependency tree
terraform providers mirror /tmp/tf-mirror  # Optional
```

---

## Step 10: Clean Up

```bash
terraform destroy -auto-approve
```

---

## ✅ Lab Checklist

- [ ] Configured AWS provider with `default_tags`
- [ ] Created provider alias for secondary region
- [ ] Used `random` provider alongside AWS
- [ ] Deployed S3 buckets in two different regions
- [ ] Explored `.terraform/` directory and lock file
- [ ] Verified resources in both regions
- [ ] Destroyed all resources

---

**Next**: [Assignment →](assignment.md)
