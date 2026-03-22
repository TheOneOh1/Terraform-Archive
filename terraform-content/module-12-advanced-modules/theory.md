# Module 12 — Advanced Module Patterns

## 🎯 Learning Objectives

- Compose multiple modules together
- Version modules with Git tags
- Use conditional resource creation in modules
- Test and publish modules

---

## 1. Module Composition

```
Composition Pattern:
┌──────────────────────────────────────────────────────┐
│                   Root Module                        │
│                                                      │
│  module "networking" ──▶ VPC + Subnets + SGs         │
│         │                                            │
│         ▼ (outputs)                                  │
│  module "compute" ──▶ EC2 + Key Pairs + EIP          │
│         │                                            │
│         ▼ (outputs)                                  │
│  module "storage" ──▶ S3 + IAM Policies              │
│                                                      │
│  Each module is independent but connected via        │
│  input variables and outputs                         │
└──────────────────────────────────────────────────────┘
```

```hcl
# Root module composing multiple child modules

module "networking" {
  source         = "./modules/networking"
  vpc_cidr       = "10.0.0.0/16"
  public_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
}

module "compute" {
  source     = "./modules/compute"
  subnet_id  = module.networking.public_subnet_ids[0]
  sg_id      = module.networking.web_sg_id
}

module "storage" {
  source        = "./modules/storage"
  instance_role = module.compute.instance_role_arn
}
```

---

## 2. Conditional Resource Creation

```hcl
# modules/vpc/variables.tf
variable "create_nat_gateway" {
  type    = bool
  default = false
}

# modules/vpc/main.tf
resource "aws_eip" "nat" {
  count  = var.create_nat_gateway ? 1 : 0
  domain = "vpc"
}

resource "aws_nat_gateway" "this" {
  count         = var.create_nat_gateway ? 1 : 0
  allocation_id = aws_eip.nat[0].id
  subnet_id     = aws_subnet.public[0].id
}
```

---

## 3. Module Versioning

```hcl
# Using Git tags for versioning
module "vpc" {
  source = "git::https://github.com/org/terraform-aws-vpc.git?ref=v1.2.0"
}

# Using specific branch
module "vpc" {
  source = "git::https://github.com/org/terraform-aws-vpc.git?ref=develop"
}
```

### Version Tag Workflow
```bash
git tag v1.0.0
git push origin v1.0.0
# Now consumers can pin: ?ref=v1.0.0
```

---

## 4. Module Testing

```bash
# Validate module syntax
cd modules/vpc
terraform init -backend=false
terraform validate

# Format check
terraform fmt -check -recursive

# Plan test
cd ../../tests/vpc
terraform init
terraform plan
```

---

## 📝 Key Takeaways

1. **Composition** connects modules through inputs/outputs
2. Use `count` or `for_each` for **conditional** resource creation
3. **Version** modules with Git tags for stability
4. **Test** modules with validate, plan, and automated tests

---

**Next**: [Lab →](lab.md)
