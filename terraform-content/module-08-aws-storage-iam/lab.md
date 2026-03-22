# Module 08 — Lab: S3 Bucket with IAM-Controlled Access

## 🎯 Lab Objectives
Create an S3 bucket with versioning, encryption, and an IAM role granting read access.

**Estimated Time**: 35 minutes

---

## Step 1: Create the Project

```bash
mkdir -p ~/terraform-labs/module-08-s3-iam
cd ~/terraform-labs/module-08-s3-iam
```

---

## Step 2: Create main.tf

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

locals {
  bucket_name = "bootcamp-s3-iam-${random_id.suffix.hex}"
}

# --- S3 Bucket ---
resource "aws_s3_bucket" "data" {
  bucket        = local.bucket_name
  force_destroy = true
  tags          = { Name = "IAM Lab Bucket" }
}

resource "aws_s3_bucket_versioning" "data" {
  bucket = aws_s3_bucket.data.id
  versioning_configuration { status = "Enabled" }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "data" {
  bucket = aws_s3_bucket.data.id
  rule {
    apply_server_side_encryption_by_default { sse_algorithm = "AES256" }
  }
}

resource "aws_s3_bucket_public_access_block" "data" {
  bucket                  = aws_s3_bucket.data.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# --- IAM Role ---
data "aws_iam_policy_document" "assume_role" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "s3_reader" {
  name               = "s3-reader-role"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

data "aws_iam_policy_document" "s3_read" {
  statement {
    sid       = "AllowS3Read"
    actions   = ["s3:GetObject", "s3:ListBucket"]
    resources = [
      aws_s3_bucket.data.arn,
      "${aws_s3_bucket.data.arn}/*"
    ]
  }
}

resource "aws_iam_role_policy" "s3_read" {
  name   = "s3-read-policy"
  role   = aws_iam_role.s3_reader.id
  policy = data.aws_iam_policy_document.s3_read.json
}

resource "aws_iam_instance_profile" "s3_reader" {
  name = "s3-reader-profile"
  role = aws_iam_role.s3_reader.name
}
```

---

## Step 3: Create outputs.tf

```hcl
output "bucket_name" { value = aws_s3_bucket.data.bucket }
output "bucket_arn" { value = aws_s3_bucket.data.arn }
output "iam_role_arn" { value = aws_iam_role.s3_reader.arn }
output "instance_profile_name" { value = aws_iam_instance_profile.s3_reader.name }
```

---

## Step 4: Deploy and Verify

```bash
terraform init
terraform apply -auto-approve

# Upload a test file
aws s3 cp /etc/hostname s3://$(terraform output -raw bucket_name)/test.txt

# Verify versioning
aws s3api get-bucket-versioning --bucket $(terraform output -raw bucket_name)

# Verify IAM role
aws iam get-role --role-name s3-reader-role --query 'Role.Arn'
```

---

## Step 5: Clean Up

```bash
terraform destroy -auto-approve
```

---

## ✅ Lab Checklist
- [ ] S3 bucket with versioning and encryption
- [ ] Public access blocked
- [ ] IAM role with S3 read permissions
- [ ] Instance profile created
- [ ] Verified with AWS CLI
- [ ] Destroyed

---

**Next**: [Assignment →](assignment.md)
