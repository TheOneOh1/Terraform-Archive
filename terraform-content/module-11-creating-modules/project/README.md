# Project: terraform-aws-vpc
Publishable reusable VPC module with configurable subnets, IGW, and routing.

## Usage
```hcl
module "vpc" {
  source         = "./modules/vpc"
  vpc_cidr       = "10.0.0.0/16"
  project_name   = "my-app"
  public_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
}
```
