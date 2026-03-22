# Module 11 — Lab: Create a Reusable VPC Module

## 🎯 Lab Objectives
Build a reusable VPC module and use it from a root module.

**Estimated Time**: 40 minutes

---

## Step 1: Set Up

```bash
mkdir -p ~/terraform-labs/module-11-modules/{modules/vpc}
cd ~/terraform-labs/module-11-modules
```

---

## Step 2: Create the VPC Module

Create `modules/vpc/variables.tf`:
```hcl
variable "vpc_cidr" { type = string }
variable "project_name" { type = string }
variable "public_subnets" { type = list(string) }
variable "private_subnets" { type = list(string); default = [] }
variable "tags" { type = map(string); default = {} }
```

Create `modules/vpc/main.tf`:
```hcl
data "aws_availability_zones" "available" { state = "available" }

resource "aws_vpc" "this" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  tags = merge(var.tags, { Name = "${var.project_name}-vpc" })
}

resource "aws_internet_gateway" "this" {
  vpc_id = aws_vpc.this.id
  tags   = merge(var.tags, { Name = "${var.project_name}-igw" })
}

resource "aws_subnet" "public" {
  count                   = length(var.public_subnets)
  vpc_id                  = aws_vpc.this.id
  cidr_block              = var.public_subnets[count.index]
  availability_zone       = data.aws_availability_zones.available.names[count.index % length(data.aws_availability_zones.available.names)]
  map_public_ip_on_launch = true
  tags = merge(var.tags, { Name = "${var.project_name}-public-${count.index + 1}" })
}

resource "aws_subnet" "private" {
  count             = length(var.private_subnets)
  vpc_id            = aws_vpc.this.id
  cidr_block        = var.private_subnets[count.index]
  availability_zone = data.aws_availability_zones.available.names[count.index % length(data.aws_availability_zones.available.names)]
  tags = merge(var.tags, { Name = "${var.project_name}-private-${count.index + 1}" })
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.this.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.this.id
  }
  tags = merge(var.tags, { Name = "${var.project_name}-public-rt" })
}

resource "aws_route_table_association" "public" {
  count          = length(var.public_subnets)
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}
```

Create `modules/vpc/outputs.tf`:
```hcl
output "vpc_id" { value = aws_vpc.this.id }
output "public_subnet_ids" { value = aws_subnet.public[*].id }
output "private_subnet_ids" { value = aws_subnet.private[*].id }
output "igw_id" { value = aws_internet_gateway.this.id }
```

---

## Step 3: Use the Module

Create root `main.tf`:
```hcl
terraform {
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.0" }
  }
}
provider "aws" { region = "us-east-1" }

module "vpc" {
  source         = "./modules/vpc"
  vpc_cidr       = "10.0.0.0/16"
  project_name   = "mod-lab"
  public_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  tags           = { Environment = "dev", ManagedBy = "Terraform" }
}

output "vpc_id" { value = module.vpc.vpc_id }
output "public_subnets" { value = module.vpc.public_subnet_ids }
```

---

## Step 4: Deploy

```bash
terraform init
terraform plan
terraform apply -auto-approve
terraform output
```

---

## Step 5: Clean Up

```bash
terraform destroy -auto-approve
```

---

## ✅ Lab Checklist
- [ ] VPC module created with variables, resources, outputs
- [ ] Root module calls the VPC module
- [ ] VPC deployed successfully
- [ ] Outputs displayed correctly
- [ ] All resources destroyed

---

**Next**: [Assignment →](assignment.md)
