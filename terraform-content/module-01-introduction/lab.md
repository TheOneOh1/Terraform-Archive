# Module 01 — Lab: Your First Terraform Project

## 🎯 Lab Objectives

- Install Terraform on your machine
- Write your first Terraform configuration
- Execute the full Terraform workflow (init → plan → apply → destroy)
- Explore the generated files and state

**Estimated Time**: 30 minutes

---

## Prerequisites

- [ ] AWS account with Free Tier (see [SETUP.md](../SETUP.md))
- [ ] AWS CLI installed and configured
- [ ] Code editor (VS Code recommended)

---

## Step 1: Verify Terraform Installation

```bash
terraform version
```

Expected output:
```
Terraform v1.7.x
on linux_amd64
```

If not installed, follow the instructions in [SETUP.md](../SETUP.md).

---

## Step 2: Create Your Project Directory

```bash
mkdir -p ~/terraform-labs/module-01-hello-terraform
cd ~/terraform-labs/module-01-hello-terraform
```

---

## Step 3: Write Your First Configuration

Create a file called `main.tf`:

```hcl
# main.tf — Your first Terraform configuration!

terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# Create an S3 bucket
resource "aws_s3_bucket" "hello" {
  bucket = "hello-terraform-bootcamp-${formatdate("YYYYMMDD", timestamp())}"

  tags = {
    Name        = "Hello Terraform"
    Environment = "Lab"
    Module      = "01"
    ManagedBy   = "Terraform"
  }
}

# Output the bucket name
output "bucket_name" {
  value       = aws_s3_bucket.hello.bucket
  description = "The name of the S3 bucket we created"
}

# Output the bucket ARN
output "bucket_arn" {
  value       = aws_s3_bucket.hello.arn
  description = "The ARN of the S3 bucket"
}

# Output the bucket region
output "bucket_region" {
  value       = aws_s3_bucket.hello.region
  description = "The region of the S3 bucket"
}
```

> 💡 **Note**: S3 bucket names must be globally unique. The `formatdate` function adds today's date to help ensure uniqueness. You may need to further customize the name.

---

## Step 4: Initialize Terraform

```bash
terraform init
```

**What happens:**
1. Terraform reads your configuration
2. Downloads the AWS provider plugin to `.terraform/`
3. Creates `.terraform.lock.hcl` (dependency lock file)

Expected output:
```
Initializing the backend...

Initializing provider plugins...
- Finding hashicorp/aws versions matching "~> 5.0"...
- Installing hashicorp/aws v5.x.x...
- Installed hashicorp/aws v5.x.x (signed by HashiCorp)

Terraform has been successfully initialized!
```

### Explore the Generated Files

```bash
# See what was created
ls -la
# You should see:
#   main.tf                  ← Your configuration
#   .terraform/              ← Provider plugins directory
#   .terraform.lock.hcl      ← Dependency lock file

# Look inside .terraform
ls -la .terraform/providers/registry.terraform.io/hashicorp/aws/
```

---

## Step 5: Format and Validate

```bash
# Auto-format your code
terraform fmt

# Validate syntax
terraform validate
```

Expected output:
```
Success! The configuration is valid.
```

---

## Step 6: Preview Changes (Plan)

```bash
terraform plan
```

**What happens:**
1. Terraform reads the config and state (no state yet = empty)
2. Determines what needs to be created
3. Shows you an execution plan

Expected output (abbreviated):
```
Terraform will perform the following actions:

  # aws_s3_bucket.hello will be created
  + resource "aws_s3_bucket" "hello" {
      + arn                    = (known after apply)
      + bucket                 = "hello-terraform-bootcamp-20260314"
      + id                     = (known after apply)
      + region                 = (known after apply)
      + tags                   = {
          + "Environment" = "Lab"
          + "ManagedBy"   = "Terraform"
          + "Module"      = "01"
          + "Name"        = "Hello Terraform"
        }
    }

Plan: 1 to add, 0 to change, 0 to destroy.
```

> 🔍 **Read the plan carefully!** The `+` symbol means "create". You'll also see `~` for "update" and `-` for "destroy" in future labs.

---

## Step 7: Apply Changes

```bash
terraform apply
```

Terraform will show the plan again and ask for confirmation:
```
Do you want to perform these actions?
  Terraform will perform the actions described above.
  Only 'yes' will be accepted to approve.

  Enter a value: yes
```

Type `yes` and press Enter.

Expected output:
```
aws_s3_bucket.hello: Creating...
aws_s3_bucket.hello: Creation complete after 2s [id=hello-terraform-bootcamp-20260314]

Apply complete! Resources: 1 added, 0 changed, 0 destroyed.

Outputs:

bucket_arn = "arn:aws:s3:::hello-terraform-bootcamp-20260314"
bucket_name = "hello-terraform-bootcamp-20260314"
bucket_region = "us-east-1"
```

### Verify in AWS Console

1. Go to [AWS S3 Console](https://s3.console.aws.amazon.com/s3/)
2. Find your bucket
3. Check the tags match what you defined

### Verify with AWS CLI

```bash
aws s3 ls | grep hello-terraform
aws s3api get-bucket-tagging --bucket hello-terraform-bootcamp-20260314
```

---

## Step 8: Explore the State File

```bash
# View the state
terraform show

# List resources in state
terraform state list

# View detailed state for a specific resource
terraform state show aws_s3_bucket.hello

# View the raw state file (JSON)
cat terraform.tfstate | head -50
```

> ⚠️ **Important**: The state file contains sensitive information. Never commit it to Git!

---

## Step 9: Make a Change

Let's add a tag to see how Terraform handles updates.

Edit `main.tf` and add a new tag:

```hcl
resource "aws_s3_bucket" "hello" {
  bucket = "hello-terraform-bootcamp-${formatdate("YYYYMMDD", timestamp())}"

  tags = {
    Name        = "Hello Terraform"
    Environment = "Lab"
    Module      = "01"
    ManagedBy   = "Terraform"
    UpdatedAt   = timestamp()     # ← ADD THIS LINE
  }
}
```

Now plan and apply:

```bash
terraform plan
# Notice: it shows "~ update in-place" (not create!)

terraform apply -auto-approve
# The -auto-approve flag skips the confirmation prompt
```

---

## Step 10: Destroy Everything

```bash
terraform destroy
```

Terraform shows what will be destroyed. Type `yes` to confirm.

```
aws_s3_bucket.hello: Destroying... [id=hello-terraform-bootcamp-20260314]
aws_s3_bucket.hello: Destruction complete after 1s

Destroy complete! Resources: 1 destroyed.
```

### Verify Destruction

```bash
# The bucket should no longer exist
aws s3 ls | grep hello-terraform
# (no output = successfully destroyed)

# State is now empty
terraform state list
# (no output)
```

---

## 🧹 Cleanup

```bash
# Remove the lab directory if desired
cd ~
rm -rf ~/terraform-labs/module-01-hello-terraform
```

---

## ✅ Lab Checklist

- [ ] Terraform installed and `terraform version` works
- [ ] Created `main.tf` with terraform, provider, resource, and output blocks
- [ ] Ran `terraform init` and saw provider download
- [ ] Ran `terraform plan` and read the execution plan
- [ ] Ran `terraform apply` and created the S3 bucket
- [ ] Verified the bucket exists in AWS Console and/or CLI
- [ ] Explored the state file with `terraform show` and `terraform state list`
- [ ] Made a change and observed `~ update in-place`
- [ ] Ran `terraform destroy` and confirmed cleanup

---

## 🔑 Key Commands Learned

| Command | Purpose |
|---------|---------|
| `terraform init` | Initialize working directory, download providers |
| `terraform fmt` | Auto-format `.tf` files |
| `terraform validate` | Check syntax and internal consistency |
| `terraform plan` | Preview changes without applying |
| `terraform apply` | Apply changes to infrastructure |
| `terraform show` | Show current state |
| `terraform state list` | List resources in state |
| `terraform destroy` | Destroy all managed resources |

---

**Next**: [Assignment →](assignment.md)
