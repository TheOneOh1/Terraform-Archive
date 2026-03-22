# Module 05 — Variables, Outputs & Data Sources

## 🎯 Learning Objectives

By the end of this module, you will:
- Master input variables with types, defaults, and validation
- Understand variable precedence and loading order
- Use outputs effectively for information sharing
- Query existing infrastructure with data sources
- Handle sensitive values properly

---

## 1. Input Variables Deep Dive

### Variable Declaration

```hcl
variable "name" {
  description = "Description of the variable"  # Required (by convention)
  type        = string                          # Type constraint
  default     = "default-value"                 # Optional default
  sensitive   = false                           # Hide from output
  nullable    = true                            # Allow null value

  validation {                                  # Custom validation
    condition     = length(var.name) > 3
    error_message = "Name must be longer than 3 characters."
  }
}
```

### Variable Precedence

```
Variable Precedence (lowest to highest):
┌──────────────────────────────────────────────────┐
│ 1. Default value in variable block     (lowest)  │
│ 2. terraform.tfvars file                         │
│ 3. terraform.tfvars.json file                    │
│ 4. *.auto.tfvars / *.auto.tfvars.json            │
│ 5. -var-file="custom.tfvars" flag                │
│ 6. -var="key=value" CLI flag                     │
│ 7. TF_VAR_name environment variable   (highest)  │
└──────────────────────────────────────────────────┘
```

### Ways to Set Variables

```bash
# 1. Default (in variable block)
# variable "region" { default = "us-east-1" }

# 2. terraform.tfvars (auto-loaded)
echo 'region = "us-west-2"' > terraform.tfvars

# 3. Custom tfvars file
terraform apply -var-file="production.tfvars"

# 4. CLI flag
terraform apply -var="region=eu-west-1"

# 5. Environment variable
export TF_VAR_region="ap-southeast-1"
terraform apply

# 6. Interactive prompt (if no default and not supplied)
# Terraform will ask: var.region = ?
```

---

## 2. Variable Validation

```hcl
variable "environment" {
  type = string
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}

variable "instance_type" {
  type = string
  validation {
    condition     = can(regex("^t[23]\\.", var.instance_type))
    error_message = "Instance type must be t2.* or t3.* (Free Tier)."
  }
}

variable "cidr_block" {
  type = string
  validation {
    condition     = can(cidrhost(var.cidr_block, 0))
    error_message = "Must be a valid CIDR block (e.g., 10.0.0.0/16)."
  }
}
```

---

## 3. Sensitive Variables

```hcl
variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true  # Won't be shown in plan/apply output
}
```

```bash
# Ways to pass sensitive variables:
# 1. Environment variable (recommended for CI/CD)
export TF_VAR_db_password="super-secret-123"

# 2. tfvars file (never commit this!)
echo 'db_password = "super-secret-123"' > secrets.tfvars
terraform apply -var-file="secrets.tfvars"

# 3. Interactive prompt
terraform apply
# var.db_password
#   Database password
#   Enter a value: _
```

---

## 4. Output Values

```hcl
# Basic output
output "instance_id" {
  description = "The EC2 instance ID"
  value       = aws_instance.web.id
}

# Conditional output
output "public_url" {
  description = "Public URL (only for non-private instances)"
  value       = var.is_public ? "http://${aws_instance.web.public_ip}" : "N/A"
}

# Sensitive output
output "db_connection_string" {
  description = "Database connection string"
  value       = "postgresql://${var.db_user}:${var.db_password}@${aws_db_instance.main.endpoint}/app"
  sensitive   = true
}

# Complex output
output "summary" {
  description = "Deployment summary"
  value = {
    environment = var.environment
    region      = var.aws_region
    bucket_name = aws_s3_bucket.data.bucket
    bucket_arn  = aws_s3_bucket.data.arn
  }
}
```

### Accessing Outputs

```bash
terraform output                          # All outputs
terraform output instance_id             # Specific output
terraform output -raw instance_id        # Raw value (no quotes)
terraform output -json                   # JSON format
terraform output -json summary           # Specific as JSON
```

---

## 5. Data Sources

Data sources let you **read** information from existing infrastructure or external sources.

```
Data Sources vs Resources:
┌──────────────────────────────────────────────────────┐
│                                                      │
│  resource "aws_instance" "web" { }                   │
│  → CREATES and MANAGES infrastructure                │
│  → Full lifecycle (create, update, delete)            │
│                                                      │
│  data "aws_ami" "latest" { }                         │
│  → READS existing infrastructure                     │
│  → Read-only, no lifecycle management                │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### Common Data Sources

```hcl
# Latest Amazon Linux 2023 AMI
data "aws_ami" "al2023" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# Current AWS region
data "aws_region" "current" {}

# Current caller identity
data "aws_caller_identity" "current" {}

# Availability zones
data "aws_availability_zones" "available" {
  state = "available"
}

# Existing VPC by tag
data "aws_vpc" "existing" {
  filter {
    name   = "tag:Name"
    values = ["production-vpc"]
  }
}

# SSM Parameter (secrets)
data "aws_ssm_parameter" "db_password" {
  name = "/app/prod/db_password"
}
```

### Using Data Sources

```hcl
resource "aws_instance" "web" {
  ami               = data.aws_ami.al2023.id  # From data source
  instance_type     = "t2.micro"
  availability_zone = data.aws_availability_zones.available.names[0]

  tags = {
    Name    = "Web Server"
    Account = data.aws_caller_identity.current.account_id
    Region  = data.aws_region.current.name
  }
}
```

---

## 6. Putting It All Together

```
Complete Variable Flow:
┌──────────────┐     ┌──────────────┐     ┌──────────────────┐
│  terraform   │     │   *.auto     │     │     CLI          │
│  .tfvars     │────▶│   .tfvars    │────▶│  -var / -var-file│
│  (defaults)  │     │  (overrides) │     │  (highest prio)  │
└──────────────┘     └──────────────┘     └──────────────────┘
                           │
                           ▼
               ┌────────────────────┐
               │   variables.tf     │
               │   (declarations)   │
               └─────────┬──────────┘
                         │
                         ▼
               ┌────────────────────┐     ┌──────────────────┐
               │     locals.tf      │◀────│    data.tf       │
               │   (computed)       │     │  (external data) │
               └─────────┬──────────┘     └──────────────────┘
                         │
                         ▼
               ┌────────────────────┐
               │     main.tf        │
               │   (resources)      │
               └─────────┬──────────┘
                         │
                         ▼
               ┌────────────────────┐
               │    outputs.tf      │
               │  (return values)   │
               └────────────────────┘
```

---

## 📝 Key Takeaways

1. **Variables** parameterize your configuration — always set `description` and `type`
2. **Precedence**: CLI flags (`-var`) override everything
3. **Validation** blocks catch errors early — use them liberally
4. **Sensitive** variables hide values in CLI output (but NOT in state)
5. **Outputs** expose useful information — use `sensitive = true` for secrets
6. **Data sources** read existing infrastructure without managing it

---

**Next**: [Lab →](lab.md)
