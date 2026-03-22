# Project: hello-terraform 🚀

Your first GitHub-ready Terraform project.

## Description

A simple Terraform project that demonstrates the core IaC workflow by provisioning an AWS S3 bucket with versioning, tagging, and proper project structure.

## Architecture

```
┌──────────────────────────────────────┐
│            Terraform CLI             │
│         (Your Workstation)           │
└──────────────┬───────────────────────┘
               │ terraform apply
               ▼
┌──────────────────────────────────────┐
│          AWS Cloud (us-east-1)       │
│  ┌────────────────────────────────┐  │
│  │         S3 Bucket              │  │
│  │  • Versioning: Enabled         │  │
│  │  • Tags: Name, Env, Project    │  │
│  │  • Encryption: AES-256         │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

## Project Structure

```
project/
├── README.md           # This file
├── main.tf             # Provider and resource definitions
├── variables.tf        # Input variables
├── outputs.tf          # Output values
├── terraform.tfvars    # Variable values (not committed)
└── .gitignore          # Git ignore rules
```

## Prerequisites

- Terraform >= 1.0
- AWS CLI configured with valid credentials
- AWS Free Tier account

## Usage

```bash
# Initialize
terraform init

# Preview changes
terraform plan

# Apply
terraform apply

# Destroy when done
terraform destroy
```

## Variables

| Name | Description | Type | Default |
|------|-------------|------|---------|
| `aws_region` | AWS region to deploy to | `string` | `us-east-1` |
| `environment` | Environment name | `string` | `dev` |
| `project_name` | Project name for tagging | `string` | `hello-terraform` |

## Outputs

| Name | Description |
|------|-------------|
| `bucket_name` | Name of the created S3 bucket |
| `bucket_arn` | ARN of the S3 bucket |
| `bucket_region` | Region of the S3 bucket |

## Clean Up

> ⚠️ Always destroy resources after you're done to avoid charges.

```bash
terraform destroy -auto-approve
```
