# Project: three-tier-app
Production 3-tier architecture with ALB, ASG, and database tier.

## Architecture
```
Internet → ALB → ASG (EC2) → RDS (MySQL)
           ↓
    Public Subnets  → Private Subnets
```

## Usage
```bash
terraform init && terraform apply
# Visit: terraform output alb_dns_name
terraform destroy
```
