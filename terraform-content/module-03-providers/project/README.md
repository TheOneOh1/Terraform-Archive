# Project: provider-config

Multi-provider, multi-region Terraform project demonstrating provider aliases, default tags, and multiple provider usage.

## Architecture

```
┌────────────────────────────────────────────────────────┐
│                 Terraform Configuration                │
│                                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ AWS Provider │  │ AWS Provider │  │   Random     │ │
│  │ (us-east-1)  │  │ (us-west-2)  │  │  Provider    │ │
│  │   default    │  │   "west"     │  │              │ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘ │
│         │                 │                  │         │
│         ▼                 ▼                  ▼         │
│  ┌────────────┐   ┌────────────┐    ┌──────────────┐  │
│  │ S3 Bucket  │   │ S3 Bucket  │    │ random_id    │  │
│  │ (primary)  │   │(secondary) │    │ (suffix)     │  │
│  └────────────┘   └────────────┘    └──────────────┘  │
└────────────────────────────────────────────────────────┘
```

## Usage

```bash
terraform init
terraform plan
terraform apply
terraform destroy
```
