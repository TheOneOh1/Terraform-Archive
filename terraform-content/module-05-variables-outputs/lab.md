# Module 05 — Lab: Dynamic Infrastructure with Variables & Data Sources

## 🎯 Lab Objectives

- Use data sources for dynamic AMI lookups
- Parameterize infrastructure with variables
- Create environment-specific configurations
- Output deployment information

**Estimated Time**: 40 minutes

---

## Step 1: Set Up

```bash
mkdir -p ~/terraform-labs/module-05-dynamic
cd ~/terraform-labs/module-05-dynamic
```

---

## Step 2: Create variables.tf

```hcl
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment (dev/staging/prod)"
  type        = string
  default     = "dev"

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Must be dev, staging, or prod."
  }
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "dynamic-infra"
}

variable "enable_versioning" {
  description = "Enable S3 versioning"
  type        = bool
  default     = true
}

variable "retention_days" {
  description = "Log retention in days"
  type        = number
  default     = 30

  validation {
    condition     = var.retention_days >= 1 && var.retention_days <= 365
    error_message = "Must be between 1 and 365."
  }
}

variable "additional_tags" {
  description = "Additional tags"
  type        = map(string)
  default     = {}
}
```

---

## Step 3: Create data.tf

```hcl
data "aws_caller_identity" "current" {}
data "aws_region" "current" {}
data "aws_availability_zones" "available" {
  state = "available"
}

# Look up the latest Amazon Linux 2023 AMI
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}
```

---

## Step 4: Create locals.tf

```hcl
locals {
  name_prefix = "${var.project_name}-${var.environment}"

  common_tags = merge(
    {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "Terraform"
      AccountId   = data.aws_caller_identity.current.account_id
      Region      = data.aws_region.current.name
    },
    var.additional_tags
  )

  # Environment-specific config
  env_config = {
    dev = {
      bucket_force_destroy = true
    }
    staging = {
      bucket_force_destroy = true
    }
    prod = {
      bucket_force_destroy = false
    }
  }

  current_env_config = local.env_config[var.environment]
}
```

---

## Step 5: Create main.tf

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
  region = var.aws_region
}

resource "random_id" "suffix" {
  byte_length = 4
}

resource "aws_s3_bucket" "data" {
  bucket        = "${local.name_prefix}-data-${random_id.suffix.hex}"
  force_destroy = local.current_env_config.bucket_force_destroy
  tags          = merge(local.common_tags, { Name = "${local.name_prefix}-data" })
}

resource "aws_s3_bucket_versioning" "data" {
  bucket = aws_s3_bucket.data.id
  versioning_configuration {
    status = var.enable_versioning ? "Enabled" : "Suspended"
  }
}
```

---

## Step 6: Create outputs.tf

```hcl
output "deployment_info" {
  description = "Deployment summary"
  value = {
    account_id  = data.aws_caller_identity.current.account_id
    region      = data.aws_region.current.name
    environment = var.environment
    az_count    = length(data.aws_availability_zones.available.names)
    azs         = data.aws_availability_zones.available.names
  }
}

output "ami_info" {
  description = "Selected AMI details"
  value = {
    id   = data.aws_ami.amazon_linux.id
    name = data.aws_ami.amazon_linux.name
  }
}

output "bucket" {
  description = "S3 bucket details"
  value = {
    name = aws_s3_bucket.data.bucket
    arn  = aws_s3_bucket.data.arn
  }
}
```

---

## Step 7: Create Environment-Specific tfvars

Create `dev.tfvars`:

```hcl
environment        = "dev"
enable_versioning  = true
retention_days     = 7
additional_tags = {
  Team = "DevOps"
}
```

Create `prod.tfvars`:

```hcl
environment        = "prod"
enable_versioning  = true
retention_days     = 90
additional_tags = {
  Team        = "Platform"
  Compliance  = "SOC2"
}
```

---

## Step 8: Deploy and Test

```bash
terraform init

# Deploy dev
terraform plan -var-file="dev.tfvars"
terraform apply -var-file="dev.tfvars" -auto-approve
terraform output -json deployment_info
terraform output -json ami_info

# Destroy dev
terraform destroy -var-file="dev.tfvars" -auto-approve
```

---

## Step 9: Test Variable Validation

```bash
# Invalid environment
terraform plan -var="environment=invalid"

# Invalid retention
terraform plan -var="retention_days=999"
```

---

## Step 10: Clean Up

```bash
terraform destroy -var-file="dev.tfvars" -auto-approve
```

---

## ✅ Lab Checklist

- [ ] Variables defined with proper types and validations
- [ ] Data sources querying AWS account, region, AZs, and AMI
- [ ] Locals computing environment-specific configuration
- [ ] S3 bucket created with dynamic naming and tags
- [ ] Outputs displaying deployment info and AMI details
- [ ] Tested with different tfvars files
- [ ] Variable validation errors triggered
- [ ] All resources destroyed

---

**Next**: [Assignment →](assignment.md)
