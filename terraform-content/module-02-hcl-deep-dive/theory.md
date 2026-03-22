# Module 02 — HCL Deep Dive

## 🎯 Learning Objectives

By the end of this module, you will:
- Master HCL (HashiCorp Configuration Language) syntax
- Understand all core block types: `resource`, `variable`, `output`, `locals`, `data`
- Use expressions, type constraints, and string interpolation
- Write clean, well-structured Terraform configurations

---

## 1. HCL Syntax Fundamentals

HCL is Terraform's native configuration language. It's designed to be **human-readable** while being **machine-parseable**.

### Block Syntax

Everything in HCL is organized into **blocks**:

```
┌──────────────────────────────────────────────────┐
│               HCL Block Structure                │
│                                                  │
│   block_type "label_1" "label_2" {               │
│     argument_1 = value_1                         │
│     argument_2 = value_2                         │
│                                                  │
│     nested_block {                               │
│       nested_arg = value_3                       │
│     }                                            │
│   }                                              │
│                                                  │
│   Examples:                                      │
│   ─────────                                      │
│   resource "aws_instance" "web" { ... }          │
│   variable "name" { ... }                        │
│   output "id" { ... }                            │
│   provider "aws" { ... }                         │
│   terraform { ... }                              │
└──────────────────────────────────────────────────┘
```

### Comments

```hcl
# This is a single-line comment

// This is also a single-line comment

/*
  This is a
  multi-line comment
*/
```

---

## 2. Core Block Types

```
┌──────────────────────────────────────────────────────────────┐
│                    HCL Block Types                           │
│                                                              │
│  terraform { }    ← Project settings & provider requirements │
│  provider { }     ← Provider configuration                   │
│  resource { }     ← Infrastructure objects to manage         │
│  variable { }     ← Input parameters                         │
│  output { }       ← Return values                            │
│  locals { }       ← Local computed values                    │
│  data { }         ← Read-only data queries                   │
│  module { }       ← Reusable configuration packages          │
└──────────────────────────────────────────────────────────────┘
```

### 2.1 The `terraform` Block

Configures Terraform itself:

```hcl
terraform {
  # Minimum Terraform version
  required_version = ">= 1.0"

  # Provider requirements
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }

  # Backend configuration (covered in Module 10)
  # backend "s3" { ... }
}
```

### 2.2 The `resource` Block

The most important block — defines infrastructure objects:

```hcl
resource "aws_instance" "web_server" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"
  subnet_id     = aws_subnet.public.id    # Reference another resource

  tags = {
    Name = "WebServer"
  }
}
```

**Naming Convention**: `resource "TYPE" "LOCAL_NAME"`
- `TYPE` = provider_resource (e.g., `aws_instance`)
- `LOCAL_NAME` = your label for referencing (e.g., `web_server`)

### 2.3 The `variable` Block

Declares input variables to parameterize your configuration:

```hcl
variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t2.micro"
}

variable "environment" {
  description = "Deployment environment"
  type        = string

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}

variable "allowed_ports" {
  description = "List of allowed ingress ports"
  type        = list(number)
  default     = [80, 443]
}

variable "tags" {
  description = "Resource tags"
  type        = map(string)
  default = {
    ManagedBy = "Terraform"
  }
}
```

### 2.4 The `output` Block

Exposes values after apply:

```hcl
output "instance_id" {
  description = "The ID of the EC2 instance"
  value       = aws_instance.web_server.id
}

output "public_ip" {
  description = "The public IP address"
  value       = aws_instance.web_server.public_ip
}

output "connection_string" {
  description = "SSH connection command"
  value       = "ssh -i key.pem ec2-user@${aws_instance.web_server.public_ip}"
  sensitive   = false
}
```

### 2.5 The `locals` Block

Defines computed local values (like variables, but calculated):

```hcl
locals {
  # Computed values
  name_prefix = "${var.project}-${var.environment}"
  
  # Common tags applied to all resources
  common_tags = {
    Project     = var.project
    Environment = var.environment
    ManagedBy   = "Terraform"
    CreatedAt   = timestamp()
  }
  
  # Conditional logic
  is_production = var.environment == "prod"
  instance_type = local.is_production ? "t3.large" : "t2.micro"
}

# Usage
resource "aws_instance" "app" {
  instance_type = local.instance_type
  tags          = local.common_tags
}
```

### 2.6 The `data` Block

Queries existing resources (read-only):

```hcl
# Look up the latest Amazon Linux 2 AMI
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hcl-*-x86_64-gp2"]
  }
}

# Use it in a resource
resource "aws_instance" "web" {
  ami = data.aws_ami.amazon_linux.id
}
```

---

## 3. Type System

```
HCL Type Hierarchy:
┌──────────────────────────────────────────┐
│              Primitive Types             │
│  ┌────────┐  ┌────────┐  ┌───────────┐ │
│  │ string │  │ number │  │   bool    │ │
│  └────────┘  └────────┘  └───────────┘ │
├──────────────────────────────────────────┤
│            Collection Types              │
│  ┌────────┐  ┌────────┐  ┌───────────┐ │
│  │  list  │  │  map   │  │    set    │ │
│  └────────┘  └────────┘  └───────────┘ │
├──────────────────────────────────────────┤
│            Structural Types              │
│  ┌─────────────┐  ┌──────────────────┐  │
│  │   object    │  │     tuple        │  │
│  └─────────────┘  └──────────────────┘  │
├──────────────────────────────────────────┤
│              Special Types               │
│  ┌────────┐  ┌──────────────────────┐   │
│  │  any   │  │       null           │   │
│  └────────┘  └──────────────────────┘   │
└──────────────────────────────────────────┘
```

### Examples

```hcl
# Primitive types
variable "name" {
  type = string    # "hello"
}

variable "count" {
  type = number    # 42, 3.14
}

variable "enabled" {
  type = bool      # true, false
}

# Collection types
variable "availability_zones" {
  type    = list(string)
  default = ["us-east-1a", "us-east-1b", "us-east-1c"]
}

variable "instance_tags" {
  type = map(string)
  default = {
    Name = "web"
    Env  = "dev"
  }
}

# Structural types
variable "server_config" {
  type = object({
    instance_type = string
    ami_id        = string
    disk_size     = number
    monitoring    = bool
  })
  default = {
    instance_type = "t2.micro"
    ami_id        = "ami-12345678"
    disk_size     = 20
    monitoring    = true
  }
}

# List of objects
variable "ingress_rules" {
  type = list(object({
    port        = number
    protocol    = string
    cidr_blocks = list(string)
  }))
  default = [
    {
      port        = 80
      protocol    = "tcp"
      cidr_blocks = ["0.0.0.0/0"]
    },
    {
      port        = 443
      protocol    = "tcp"
      cidr_blocks = ["0.0.0.0/0"]
    }
  ]
}
```

---

## 4. Expressions & Interpolation

### String Interpolation

```hcl
# Basic interpolation
name = "web-${var.environment}"

# Directive (conditional)
name = "server-${var.environment == "prod" ? "production" : "development"}"
```

### Heredoc Syntax

```hcl
# For multi-line strings
user_data = <<-EOF
  #!/bin/bash
  yum update -y
  yum install -y httpd
  systemctl start httpd
  echo "Hello from ${var.environment}" > /var/www/html/index.html
EOF
```

### References

```hcl
# Resource attributes
aws_instance.web.id
aws_instance.web.public_ip

# Variable values
var.instance_type
var.tags["Name"]

# Local values
local.common_tags
local.name_prefix

# Data source attributes
data.aws_ami.amazon_linux.id

# Module outputs
module.vpc.vpc_id
```

### Operators

```hcl
# Arithmetic: +  -  *  /  %
disk_size = var.base_size * 2

# Comparison: ==  !=  <  >  <=  >=
is_large = var.size > 100

# Logical: &&  ||  !
should_create = var.enabled && !var.maintenance_mode

# Conditional (ternary)
instance_type = var.environment == "prod" ? "t3.large" : "t2.micro"
```

---

## 5. File Organization Best Practices

```
Recommended Project Structure:
┌──────────────────────────────────────────────┐
│  my-project/                                 │
│  ├── main.tf          ← Primary resources    │
│  ├── variables.tf     ← Input variables      │
│  ├── outputs.tf       ← Output values        │
│  ├── providers.tf     ← Provider configs     │
│  ├── locals.tf        ← Local values         │
│  ├── data.tf          ← Data sources         │
│  ├── terraform.tfvars ← Variable values      │
│  ├── versions.tf      ← Version constraints  │
│  └── .gitignore       ← Git ignore rules     │
└──────────────────────────────────────────────┘
```

> 💡 **Tip**: Terraform loads ALL `.tf` files in a directory. Splitting by concern is purely for human readability. Terraform treats them as one big config.

---

## 6. Formatting & Style Guide

### terraform fmt

Always format your code:

```bash
# Format all .tf files in current directory
terraform fmt

# Format recursively
terraform fmt -recursive

# Check formatting without changing (for CI/CD)
terraform fmt -check
```

### Naming Conventions

| Convention | Example |
|---|---|
| Resources | `aws_instance.web_server` (snake_case) |
| Variables | `var.instance_type` (snake_case) |
| Outputs | `output "public_ip"` (snake_case) |
| Locals | `local.common_tags` (snake_case) |
| Files | `variables.tf`, `outputs.tf` (snake_case) |

---

## 📝 Key Takeaways

1. **HCL** is Terraform's declarative language — structured as blocks with arguments
2. **Six core block types**: terraform, provider, resource, variable, output, locals, data
3. **Type system** includes primitives (string, number, bool), collections (list, map, set), and structural types (object, tuple)
4. **Interpolation** with `${}` embeds expressions in strings
5. **File organization** by concern (main.tf, variables.tf, outputs.tf) improves readability
6. Always run `terraform fmt` to maintain consistent style

---

**Next**: [Lab →](lab.md) — Practice HCL syntax hands-on
