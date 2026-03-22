# Module 11 — Creating & Using Terraform Modules

## 🎯 Learning Objectives

- Understand module architecture and benefits
- Create reusable child modules
- Pass inputs and outputs between modules
- Use modules from the Terraform Registry

---

## 1. Module Architecture

```
Module Structure:
┌─────────────────────────────────────────────────────┐
│                   Root Module                        │
│                (your main config)                    │
│                                                     │
│  module "vpc" {                                      │
│    source = "./modules/vpc"      ─────┐             │
│    cidr   = "10.0.0.0/16"             │             │
│  }                                    │             │
│                                       ▼             │
│  module "ec2" {              ┌──────────────────┐   │
│    source    = "./modules/ec2"│ modules/vpc/     │   │
│    subnet_id = module.vpc.   ││ ├── main.tf     │   │
│               public_subnet ││ ├── variables.tf │   │
│  }                           ││ └── outputs.tf  │   │
│                              │└──────────────────┘   │
│                              │                       │
│                              │┌──────────────────┐   │
│                              ││ modules/ec2/     │   │
│                              ││ ├── main.tf     │   │
│                              ││ ├── variables.tf │   │
│                              ││ └── outputs.tf  │   │
│                              │└──────────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

## 2. Module Sources

```hcl
# Local path
module "vpc" {
  source = "./modules/vpc"
}

# Terraform Registry
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"
}

# GitHub
module "vpc" {
  source = "github.com/org/terraform-aws-vpc?ref=v1.0.0"
}

# S3 bucket
module "vpc" {
  source = "s3::https://s3.amazonaws.com/my-modules/vpc.zip"
}
```

---

## 3. Creating a Module

### Module Structure

```
modules/vpc/
├── main.tf          # Resources
├── variables.tf     # Input variables
├── outputs.tf       # Output values
└── README.md        # Documentation
```

### modules/vpc/variables.tf

```hcl
variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
}

variable "project_name" {
  description = "Project name for naming"
  type        = string
}

variable "public_subnets" {
  description = "Public subnet CIDRs"
  type        = list(string)
}
```

### modules/vpc/main.tf

```hcl
data "aws_availability_zones" "available" {
  state = "available"
}

resource "aws_vpc" "this" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  tags                 = { Name = "${var.project_name}-vpc" }
}

resource "aws_subnet" "public" {
  count                   = length(var.public_subnets)
  vpc_id                  = aws_vpc.this.id
  cidr_block              = var.public_subnets[count.index]
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true
  tags                    = { Name = "${var.project_name}-public-${count.index + 1}" }
}

resource "aws_internet_gateway" "this" {
  vpc_id = aws_vpc.this.id
  tags   = { Name = "${var.project_name}-igw" }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.this.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.this.id
  }
}

resource "aws_route_table_association" "public" {
  count          = length(var.public_subnets)
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}
```

### modules/vpc/outputs.tf

```hcl
output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.this.id
}

output "public_subnet_ids" {
  description = "Public subnet IDs"
  value       = aws_subnet.public[*].id
}
```

### Using the Module

```hcl
# Root main.tf
module "vpc" {
  source         = "./modules/vpc"
  vpc_cidr       = "10.0.0.0/16"
  project_name   = "bootcamp"
  public_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
}

output "vpc_id" {
  value = module.vpc.vpc_id
}
```

---

## 4. Registry Modules

```hcl
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name = "bootcamp-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["us-east-1a", "us-east-1b"]
  public_subnets  = ["10.0.1.0/24", "10.0.2.0/24"]
  private_subnets = ["10.0.3.0/24", "10.0.4.0/24"]

  enable_nat_gateway = false
  enable_dns_hostnames = true
}
```

---

## 📝 Key Takeaways

1. Modules are **reusable packages** of Terraform configuration
2. Every module needs `variables.tf`, `main.tf`, and `outputs.tf`
3. Use `source` to specify module location (local, registry, git)
4. Access module outputs with `module.<NAME>.<OUTPUT>`
5. Always **version-pin** registry modules

---

**Next**: [Lab →](lab.md)
