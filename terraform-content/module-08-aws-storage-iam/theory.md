# Module 08 — AWS Storage & IAM with Terraform

## 🎯 Learning Objectives

- Create and configure S3 buckets (versioning, encryption, lifecycle)
- Set up S3 static website hosting
- Manage IAM users, roles, and policies with Terraform
- Use `aws_iam_policy_document` for clean policy definitions
- Attach IAM instance profiles to EC2

---

## 1. S3 Bucket Architecture

```
S3 Bucket Configuration:
┌──────────────────────────────────────────────────────┐
│                  S3 Bucket                           │
│  ┌──────────────────────────────────────────────┐    │
│  │  Versioning: Enabled                         │    │
│  │  Encryption: AES-256 (SSE-S3)                │    │
│  │  Public Access: Blocked                       │    │
│  │  Lifecycle Rules:                             │    │
│  │    • logs/ → expire after 90 days            │    │
│  │    • archive/ → transition to Glacier         │    │
│  └──────────────────────────────────────────────┘    │
│                                                      │
│  Bucket Policy (IAM):                                │
│  ┌──────────────────────────────────────────────┐    │
│  │  Allow: s3:GetObject from specific IAM role  │    │
│  │  Deny: s3:* from non-SSL connections          │    │
│  └──────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────┘
```

---

## 2. S3 with Terraform

```hcl
# S3 Bucket
resource "aws_s3_bucket" "app_data" {
  bucket = "my-app-data-bucket"
  tags   = { Name = "App Data" }
}

# Versioning
resource "aws_s3_bucket_versioning" "app_data" {
  bucket = aws_s3_bucket.app_data.id
  versioning_configuration { status = "Enabled" }
}

# Encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "app_data" {
  bucket = aws_s3_bucket.app_data.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Block Public Access
resource "aws_s3_bucket_public_access_block" "app_data" {
  bucket                  = aws_s3_bucket.app_data.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Lifecycle Rules
resource "aws_s3_bucket_lifecycle_configuration" "app_data" {
  bucket = aws_s3_bucket.app_data.id

  rule {
    id     = "expire-logs"
    status = "Enabled"
    filter { prefix = "logs/" }
    expiration { days = 90 }
  }
}
```

---

## 3. IAM with Terraform

```
IAM Architecture:
┌─────────────────────────────────────────────────────┐
│                    IAM                               │
│                                                     │
│  Users ──▶ Groups ──▶ Policies                      │
│                                                     │
│  Roles ──▶ Policies (for services like EC2)         │
│                                                     │
│  ┌───────────┐  ┌───────────────┐  ┌─────────────┐ │
│  │  IAM User │  │  IAM Role     │  │  IAM Policy │ │
│  │  (human)  │  │  (service)    │  │  (perms)    │ │
│  └─────┬─────┘  └───────┬───────┘  └──────┬──────┘ │
│        │                │                  │        │
│        └────────────────┼──────────────────┘        │
│                         │                           │
│                         ▼                           │
│                  AWS Resources                       │
│                  (S3, EC2, etc.)                      │
└─────────────────────────────────────────────────────┘
```

### IAM Role for EC2

```hcl
# Trust policy — who can assume this role
data "aws_iam_policy_document" "ec2_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

# IAM Role
resource "aws_iam_role" "app_role" {
  name               = "app-ec2-role"
  assume_role_policy = data.aws_iam_policy_document.ec2_assume_role.json
}

# Permission policy — what this role can do
data "aws_iam_policy_document" "s3_access" {
  statement {
    actions   = ["s3:GetObject", "s3:ListBucket"]
    resources = [
      aws_s3_bucket.app_data.arn,
      "${aws_s3_bucket.app_data.arn}/*"
    ]
  }
}

resource "aws_iam_role_policy" "s3_access" {
  name   = "s3-read-access"
  role   = aws_iam_role.app_role.id
  policy = data.aws_iam_policy_document.s3_access.json
}

# Instance Profile (attaches role to EC2)
resource "aws_iam_instance_profile" "app" {
  name = "app-instance-profile"
  role = aws_iam_role.app_role.name
}

# Use in EC2
resource "aws_instance" "app" {
  ami                  = data.aws_ami.al2023.id
  instance_type        = "t2.micro"
  iam_instance_profile = aws_iam_instance_profile.app.name
  # ...
}
```

---

## 📝 Key Takeaways

1. S3 buckets need **separate resources** for versioning, encryption, and access controls
2. Always **block public access** unless serving a static website
3. Use `aws_iam_policy_document` **data source** for clean policy definitions
4. IAM **Roles** are preferred over IAM Users for service-to-service access
5. **Instance Profiles** bridge IAM Roles and EC2 instances

---

**Next**: [Lab →](lab.md)
