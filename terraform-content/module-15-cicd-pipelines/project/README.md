# Project: terraform-cicd
Automated IaC pipeline with GitHub Actions and GitLab CI integration.

## Usage
```bash
# Local
terraform init && terraform apply

# CI/CD
git push  # Triggers pipeline
```

## Pipeline Flow
```
PR Created → fmt check → validate → plan → Comment on PR
PR Merged  → init → apply saved plan → Update state
```
