# Project: secure-infra
Security-hardened infrastructure with encryption, SSM secrets, least-privilege IAM, and Checkov compliance.

## Usage
```bash
terraform init && terraform apply
checkov -d .  # Security scan
terraform destroy
```
