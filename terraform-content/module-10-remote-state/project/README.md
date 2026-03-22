# Project: remote-backend
Production-ready remote backend setup with S3 state storage, DynamoDB locking, and workspace support.

## Usage
```bash
terraform init && terraform apply -auto-approve
terraform workspace new staging
terraform workspace select staging
terraform destroy -auto-approve
```
