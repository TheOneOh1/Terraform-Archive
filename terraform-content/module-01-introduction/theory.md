# Module 01 — Introduction to Infrastructure as Code & Terraform

## 🎯 Learning Objectives

By the end of this module, you will:
- Understand what Infrastructure as Code (IaC) is and why it matters
- Compare Terraform with other IaC tools
- Understand Terraform's architecture and components
- Know the difference between declarative and imperative approaches
- Install Terraform and write your first configuration

---

## 1. What is Infrastructure as Code (IaC)?

### The Problem: Manual Infrastructure

As a DevOps engineer with on-prem experience, you know the pain of manual infrastructure management:

```
Traditional Workflow:
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Ticket  │────▶│  Manual  │────▶│  Verify  │────▶│ Document │
│  Raised  │     │  Config  │     │  Config  │     │  Changes │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
     │                │                │                │
     │   Hours/Days   │  Error-Prone   │  Inconsistent  │  Outdated
     ▼                ▼                ▼                ▼
```

**Problems with manual infrastructure:**
- ❌ Slow provisioning (days/weeks for new servers)
- ❌ Configuration drift between environments
- ❌ No version history of changes
- ❌ Hard to reproduce environments
- ❌ Documentation always out of date
- ❌ Single point of failure (tribal knowledge)

### The Solution: Infrastructure as Code

IaC treats infrastructure the same way developers treat application code:

```
IaC Workflow:
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Write   │────▶│  Review  │────▶│  Apply   │────▶│  Version │
│   Code   │     │  (PR)    │     │  (Auto)  │     │  (Git)   │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
     │                │                │                │
     │   Minutes     │  Peer Review   │  Consistent    │  Tracked
     ▼                ▼                ▼                ▼
```

**Benefits of IaC:**
- ✅ **Speed**: Provision infrastructure in minutes
- ✅ **Consistency**: Same code = same infrastructure, every time
- ✅ **Version Control**: Git history = infrastructure history
- ✅ **Collaboration**: Pull requests for infrastructure changes
- ✅ **Reproducibility**: Spin up identical environments easily
- ✅ **Self-documenting**: The code IS the documentation

---

## 2. Declarative vs Imperative

### Imperative (How to do it)
You tell the tool the **steps** to reach the desired state.

```bash
# Imperative example (Bash script):
aws ec2 run-instances --image-id ami-12345 --instance-type t2.micro
aws ec2 create-tags --resources i-xxxxx --tags Key=Name,Value=MyServer
aws ec2 wait instance-running --instance-ids i-xxxxx
```

**Problem**: What happens if you run this script twice? You get **two** servers!

### Declarative (What you want)
You tell the tool the **desired end state**, and it figures out the steps.

```hcl
# Declarative example (Terraform):
resource "aws_instance" "my_server" {
  ami           = "ami-12345"
  instance_type = "t2.micro"

  tags = {
    Name = "MyServer"
  }
}
```

**Benefit**: Run this 100 times — you still get exactly **one** server. Terraform calculates the **difference** between desired state and current state.

```
Declarative Model:
┌─────────────┐     ┌──────────┐     ┌─────────────┐
│   Desired   │     │          │     │   Current    │
│    State    │────▶│ Terraform│◀────│    State     │
│  (HCL Code) │     │  (Diff)  │     │ (State File) │
└─────────────┘     └──────────┘     └─────────────┘
                         │
                         ▼
                  ┌──────────────┐
                  │ Execution    │
                  │ Plan (Delta) │
                  └──────────────┘
```

---

## 3. IaC Tool Comparison

| Feature | Terraform | Ansible | CloudFormation | Pulumi |
|---------|-----------|---------|----------------|--------|
| **Approach** | Declarative | Imperative* | Declarative | Declarative |
| **Language** | HCL | YAML | JSON/YAML | Python/TS/Go |
| **Cloud Support** | Multi-cloud | Multi-cloud | AWS only | Multi-cloud |
| **State** | State file | Stateless | Stack state | State file |
| **Agent** | Agentless | Agentless | Agentless | Agentless |
| **Best For** | Provisioning | Config mgmt | AWS-native | Developers |
| **Learning Curve** | Medium | Low | Medium | High |
| **Community** | Massive | Massive | AWS users | Growing |

*Ansible has declarative modules but imperative playbook execution.

> 💡 **Key Insight**: Terraform excels at **provisioning** infrastructure. Ansible excels at **configuring** it. Many teams use both together.

---

## 4. Terraform Architecture

```
Terraform Architecture:
┌──────────────────────────────────────────────────┐
│                   YOUR CODE                       │
│              (*.tf files in HCL)                  │
└──────────────────────┬───────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────┐
│              TERRAFORM CORE                       │
│  ┌────────────────┐  ┌─────────────────────────┐ │
│  │  Config Parser  │  │  State Manager          │ │
│  │  (reads .tf)    │  │  (reads .tfstate)       │ │
│  └───────┬────────┘  └──────────┬──────────────┘ │
│          │     ┌────────────────┘                 │
│          ▼     ▼                                  │
│  ┌──────────────────┐                            │
│  │   Plan Engine    │─── Calculates diff          │
│  │  (desired - real) │                            │
│  └────────┬─────────┘                            │
│           │                                       │
│           ▼                                       │
│  ┌──────────────────┐                            │
│  │   Graph Builder  │─── Dependency resolution    │
│  │  (resource DAG)  │                            │
│  └────────┬─────────┘                            │
└───────────┼──────────────────────────────────────┘
            │
            ▼
┌──────────────────────────────────────────────────┐
│                  PROVIDERS                        │
│  ┌──────┐  ┌──────┐  ┌───────┐  ┌────────────┐ │
│  │ AWS  │  │Azure │  │  GCP  │  │ Kubernetes │ │
│  └──┬───┘  └──┬───┘  └──┬────┘  └─────┬──────┘ │
└─────┼─────────┼─────────┼─────────────┼────────┘
      │         │         │             │
      ▼         ▼         ▼             ▼
┌──────┐  ┌──────┐  ┌──────┐  ┌────────────────┐
│ AWS  │  │Azure │  │ GCP  │  │  K8s Cluster   │
│ APIs │  │ APIs │  │ APIs │  │     API        │
└──────┘  └──────┘  └──────┘  └────────────────┘
```

### Key Components

1. **Terraform Core**: The binary you install. Handles parsing, planning, and applying.
2. **Providers**: Plugins that know how to talk to specific APIs (AWS, Azure, GCP, etc.).
3. **State File**: A JSON file tracking what Terraform has created (the "source of truth").
4. **Configuration Files**: Your `.tf` files written in HCL.

---

## 5. Terraform Editions

| Edition | Cost | Use Case |
|---------|------|----------|
| **Terraform CLI** (Open Source) | Free | Individual projects, learning |
| **HCP Terraform** (formerly Terraform Cloud) | Free tier available | Teams, remote state, collaboration |
| **Terraform Enterprise** | Paid | Large organizations, self-hosted |

> For this bootcamp, we use **Terraform CLI** (open source, free).

---

## 6. How Terraform Works — The Workflow

```
The Terraform Workflow:

    ┌──────────────────────────────────┐
    │         terraform init           │
    │  • Downloads providers           │
    │  • Initializes backend           │
    │  • Creates .terraform/ directory │
    └───────────────┬──────────────────┘
                    │
                    ▼
    ┌──────────────────────────────────┐
    │         terraform plan           │
    │  • Reads current state           │
    │  • Compares to desired config    │
    │  • Shows what will change        │
    └───────────────┬──────────────────┘
                    │
                    ▼
    ┌──────────────────────────────────┐
    │         terraform apply          │
    │  • Executes the plan             │
    │  • Creates/updates/deletes       │
    │  • Updates state file            │
    └───────────────┬──────────────────┘
                    │
                    ▼
    ┌──────────────────────────────────┐
    │        terraform destroy         │
    │  • Removes all resources         │
    │  • Updates state to empty        │
    └──────────────────────────────────┘
```

---

## 7. Your First Terraform Configuration

Here's a minimal Terraform configuration that creates an S3 bucket:

```hcl
# main.tf

# Step 1: Define Terraform settings
terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Step 2: Configure the provider
provider "aws" {
  region = "us-east-1"
}

# Step 3: Define a resource
resource "aws_s3_bucket" "my_first_bucket" {
  bucket = "my-terraform-bootcamp-bucket-12345"

  tags = {
    Name        = "My First Terraform Bucket"
    Environment = "Learning"
    ManagedBy   = "Terraform"
  }
}

# Step 4: Output useful information
output "bucket_name" {
  value       = aws_s3_bucket.my_first_bucket.bucket
  description = "The name of the S3 bucket"
}
```

### Anatomy of a Terraform File

```
┌─────────────────────────────────────────────────────┐
│  terraform { }    ← Settings block                  │
│    required_version   ← Terraform version constraint│
│    required_providers ← Provider source & version   │
├─────────────────────────────────────────────────────┤
│  provider "aws" { }  ← Provider configuration       │
│    region            ← Provider-specific settings    │
├─────────────────────────────────────────────────────┤
│  resource "TYPE" "NAME" { }  ← Resource definition  │
│    TYPE = aws_s3_bucket      ← Resource type         │
│    NAME = my_first_bucket    ← Local name (your ref)│
│    bucket = "..."            ← Resource argument     │
├─────────────────────────────────────────────────────┤
│  output "NAME" { }           ← Output value          │
│    value = <expression>      ← What to display       │
└─────────────────────────────────────────────────────┘
```

---

## 📝 Key Takeaways

1. **IaC** replaces manual infrastructure management with code
2. **Terraform** uses a **declarative** approach — you describe WHAT, not HOW
3. **Terraform Core** reads your config, compares to state, and calculates changes
4. **Providers** are plugins that communicate with cloud APIs
5. **State** is Terraform's record of what it has created
6. The workflow is: **Write → Init → Plan → Apply → Destroy**

---

**Next**: [Lab →](lab.md) — Install Terraform and write your first configuration
