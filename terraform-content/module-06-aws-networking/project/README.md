# Project: aws-vpc

Complete VPC with public/private subnets, IGW, route tables, and security groups across multiple AZs.

## Architecture

```
┌─────────────────────────────────────────────────────┐
│ VPC: 10.0.0.0/16                                    │
│                                                     │
│  AZ-a                         AZ-b                  │
│  ┌───────────────┐           ┌───────────────┐      │
│  │Public 10.0.1.0│           │Public 10.0.2.0│      │
│  └───────┬───────┘           └───────┬───────┘      │
│          │                           │              │
│  ┌───────┴───────┐           ┌───────┴───────┐      │
│  │Priv  10.0.3.0 │           │Priv  10.0.4.0 │      │
│  └───────────────┘           └───────────────┘      │
│                                                     │
│         ┌──────────────────┐                        │
│         │ Internet Gateway │──── Internet            │
│         └──────────────────┘                        │
└─────────────────────────────────────────────────────┘
```

## Usage

```bash
terraform init && terraform apply -auto-approve
terraform destroy -auto-approve
```
