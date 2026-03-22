# Project: module-library
Collection of reusable, composable Terraform modules for AWS infrastructure.

## Modules
- `modules/vpc/` — VPC with public/private subnets, optional NAT
- `modules/compute/` — EC2 instances with key pairs
- `modules/storage/` — S3 with versioning, encryption, IAM

## Usage
```hcl
module "networking" { source = "./modules/vpc" ... }
module "compute"    { source = "./modules/compute" ... }
module "storage"    { source = "./modules/storage" ... }
```
