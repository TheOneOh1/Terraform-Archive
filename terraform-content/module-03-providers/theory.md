# Module 03 — Terraform Providers

## 🎯 Learning Objectives

By the end of this module, you will:
- Understand the provider plugin model
- Configure providers with version constraints
- Use provider aliases for multi-region deployments
- Navigate the Terraform Registry
- Work with multiple providers in one configuration

---

## 1. What Are Providers?

Providers are **plugins** that let Terraform interact with APIs of cloud platforms, SaaS services, and other infrastructure.

```
Provider Model:
┌─────────────────────────────────────────────────────────────┐
│                     Your Terraform Code                     │
│                    (*.tf files in HCL)                      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Terraform Core                           │
│              (Binary: terraform.exe)                        │
└────────────────────────┬────────────────────────────────────┘
                         │ Plugin Protocol (gRPC)
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  AWS Provider│ │Azure Provider│ │  GCP Provider│
│   (Plugin)   │ │   (Plugin)   │ │   (Plugin)   │
└──────┬───────┘ └──────┬───────┘ └──────┬───────┘
       │                │                │
       ▼                ▼                ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   AWS APIs   │ │  Azure APIs  │ │   GCP APIs   │
│  (us-east-1) │ │ (westus2)    │ │ (us-central1)│
└──────────────┘ └──────────────┘ └──────────────┘
```

### Key Facts

- Providers are **downloaded** during `terraform init`
- Stored in `.terraform/providers/` directory
- Each provider has its own **version** and **documentation**
- **3000+ providers** available on the [Terraform Registry](https://registry.terraform.io/)

---

## 2. Provider Configuration

### Basic AWS Provider

```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}
```

### Provider Source Address

The `source` tells Terraform where to find the provider:

```
source = "hashicorp/aws"
         ──────── ───
            │       │
            │       └── Provider name
            └── Namespace (publisher)

Full form: registry.terraform.io/hashicorp/aws
```

---

## 3. Version Constraints

Version constraints control which provider versions are acceptable:

| Operator | Meaning | Example |
|----------|---------|---------|
| `= 5.0.0` | Exact version | Only 5.0.0 |
| `>= 5.0` | Minimum | 5.0 or newer |
| `<= 5.0` | Maximum | 5.0 or older |
| `~> 5.0` | Pessimistic | >= 5.0, < 6.0 |
| `~> 5.0.1` | Pessimistic (patch) | >= 5.0.1, < 5.1.0 |
| `>= 5.0, < 6.0` | Range | Between 5.0 and 6.0 |

```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"       # Recommended: allows 5.x updates
    }
  }
}
```

> 💡 **Best Practice**: Use `~>` (pessimistic constraint) to allow patch/minor updates while preventing breaking major version changes.

### Lock File

After `terraform init`, a `.terraform.lock.hcl` file is created:

```hcl
# .terraform.lock.hcl (auto-generated, commit to Git!)
provider "registry.terraform.io/hashicorp/aws" {
  version     = "5.31.0"
  constraints = "~> 5.0"
  hashes = [
    "h1:xyz...",
  ]
}
```

> ⚠️ **Commit `.terraform.lock.hcl` to Git** — it ensures everyone uses the exact same provider version.

---

## 4. Provider Authentication

### AWS Provider — Authentication Methods

```
Authentication Priority (highest to lowest):
┌─────────────────────────────────────────────┐
│ 1. Provider block (AVOID — hardcoded creds) │
│ 2. Environment variables                     │
│ 3. Shared credentials file (~/.aws/creds)   │
│ 4. EC2 Instance Profile / ECS Task Role      │
│ 5. Web Identity Token                        │
└─────────────────────────────────────────────┘
```

```hcl
# ❌ BAD — Never hardcode credentials
provider "aws" {
  region     = "us-east-1"
  access_key = "AKIA..."
  secret_key = "wJalrXUtnFEMI..."
}

# ✅ GOOD — Use environment variables
# export AWS_ACCESS_KEY_ID="AKIA..."
# export AWS_SECRET_ACCESS_KEY="wJalrXUtnFEMI..."
provider "aws" {
  region = "us-east-1"
}

# ✅ GOOD — Use shared credentials (from aws configure)
provider "aws" {
  region  = "us-east-1"
  profile = "default"
}
```

---

## 5. Provider Aliases (Multi-Region)

Use aliases to configure the same provider with different settings:

```hcl
# Default provider (us-east-1)
provider "aws" {
  region = "us-east-1"
}

# Aliased provider (us-west-2)
provider "aws" {
  alias  = "west"
  region = "us-west-2"
}

# Use default provider
resource "aws_s3_bucket" "east_bucket" {
  bucket = "my-east-bucket"
}

# Use aliased provider
resource "aws_s3_bucket" "west_bucket" {
  provider = aws.west
  bucket   = "my-west-bucket"
}
```

```
Multi-Region Architecture:
┌─────────────────────────────────────────────────────┐
│                  Terraform Config                   │
│                                                     │
│  provider "aws" {          provider "aws" {          │
│    region = "us-east-1"      alias  = "west"        │
│  }                           region = "us-west-2"   │
│    │                       }                        │
│    │                         │                      │
│    ▼                         ▼                      │
│  ┌─────────────┐          ┌─────────────┐          │
│  │ east_bucket │          │ west_bucket │          │
│  │ (us-east-1) │          │ (us-west-2) │          │
│  └─────────────┘          └─────────────┘          │
└─────────────────────────────────────────────────────┘
```

---

## 6. Multiple Providers

Use different providers in the same configuration:

```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# Generate a random suffix
resource "random_id" "suffix" {
  byte_length = 4
}

# Generate a TLS private key
resource "tls_private_key" "ssh" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

# Use both in AWS resources
resource "aws_key_pair" "deployer" {
  key_name   = "deployer-${random_id.suffix.hex}"
  public_key = tls_private_key.ssh.public_key_openssh
}
```

---

## 7. Terraform Registry

The [Terraform Registry](https://registry.terraform.io/) is the central repository for providers and modules.

### Navigating Provider Documentation

```
Registry Structure:
┌─────────────────────────────────────────┐
│          Terraform Registry             │
│                                         │
│  ┌───────────────┐  ┌───────────────┐  │
│  │   Providers   │  │   Modules     │  │
│  │               │  │               │  │
│  │  • AWS        │  │  • VPC        │  │
│  │  • Azure      │  │  • EKS        │  │
│  │  • GCP        │  │  • RDS        │  │
│  │  • K8s        │  │  • Lambda     │  │
│  │  • Docker     │  │  • ...        │  │
│  │  • 3000+      │  │               │  │
│  └───────────────┘  └───────────────┘  │
│                                         │
│  Each Provider Doc:                     │
│  ├── Overview & Setup                   │
│  ├── Authentication                     │
│  ├── Resources (create/manage)          │
│  ├── Data Sources (read-only)           │
│  └── Guides & Examples                  │
└─────────────────────────────────────────┘
```

### How to Read Provider Docs

For example, the `aws_s3_bucket` resource docs show:

1. **Example Usage** — Copy-paste starter code
2. **Argument Reference** — What you can configure
3. **Attribute Reference** — What you can read after creation
4. **Import** — How to import existing resources

---

## 📝 Key Takeaways

1. **Providers** are plugins that bridge Terraform and cloud APIs
2. Use **version constraints** to control provider versions (`~>` recommended)
3. **Commit** `.terraform.lock.hcl` to Git for consistent builds
4. **Never hardcode** credentials — use env vars or IAM roles
5. **Aliases** enable multi-region and multi-account deployments
6. The **Registry** is your go-to reference for provider documentation

---

**Next**: [Lab →](lab.md)
