# Project: workflow-demo

Demonstrates the complete Terraform workflow including init, plan, apply, modify, and destroy with multiple dependent resources.

## Architecture

```
┌──────────────────────────────────────────────────┐
│              AWS Cloud (us-east-1)               │
│                                                  │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐ │
│  │ S3 Bucket  │  │ S3 Bucket  │  │ S3 Bucket  │ │
│  │ raw-data   │  │ processed  │  │  archive   │ │
│  │ Versioned  │  │ Versioned  │  │            │ │
│  │ Encrypted  │  │ Encrypted  │  │ Encrypted  │ │
│  └────────────┘  └────────────┘  └────────────┘ │
└──────────────────────────────────────────────────┘
```

## Usage

```bash
terraform init
terraform plan -out=plan.tfplan
terraform apply plan.tfplan
terraform destroy -auto-approve
```
