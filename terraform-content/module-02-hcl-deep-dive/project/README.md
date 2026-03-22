# Project: hcl-practice

A Terraform project demonstrating comprehensive HCL syntax usage including all variable types, locals, data sources, and outputs.

## Architecture

```
┌──────────────────────────────────────────┐
│         Terraform Configuration          │
│  ┌─────────────┐  ┌──────────────────┐  │
│  │ variables.tf │  │    locals.tf     │  │
│  │  8 variables │  │  5 computed vals │  │
│  └──────┬──────┘  └────────┬─────────┘  │
│         │                  │             │
│         ▼                  ▼             │
│  ┌────────────────────────────────────┐  │
│  │            main.tf                 │  │
│  │  • S3 bucket with versioning      │  │
│  │  • Encryption (AES-256)           │  │
│  │  • Public access block            │  │
│  └────────────────┬───────────────────┘  │
│                   │                      │
│                   ▼                      │
│  ┌────────────────────────────────────┐  │
│  │           outputs.tf               │  │
│  │  6 output values                   │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

## Usage

```bash
terraform init
terraform plan -var-file="dev.tfvars"
terraform apply -var-file="dev.tfvars"
terraform destroy -var-file="dev.tfvars"
```
