# Project: dynamic-infra

Variable-driven, environment-aware infrastructure using data sources for dynamic configuration.

## Architecture

```
┌──────────────────────────────────────────────────────┐
│  ┌───────────┐  ┌───────────┐  ┌──────────────────┐ │
│  │ dev.tfvars│  │prod.tfvars│  │  Data Sources    │ │
│  │           │  │           │  │  • AMI lookup    │ │
│  │ env=dev   │  │ env=prod  │  │  • AZ lookup     │ │
│  │ retain=7  │  │ retain=90 │  │  • Account info  │ │
│  └─────┬─────┘  └─────┬─────┘  └────────┬─────────┘ │
│        │              │                  │           │
│        └──────────────┼──────────────────┘           │
│                       ▼                              │
│              ┌─────────────────┐                     │
│              │    main.tf      │                     │
│              │  S3 Bucket      │                     │
│              │  (env-specific) │                     │
│              └─────────────────┘                     │
└──────────────────────────────────────────────────────┘
```

## Usage

```bash
terraform init
terraform apply -var-file="dev.tfvars"
terraform apply -var-file="prod.tfvars"
terraform destroy -var-file="dev.tfvars"
```
