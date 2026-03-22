# Module 19 — Exam Domains Review (Terraform Associate 003)

## 🎯 Purpose

This module is a comprehensive study guide covering all 9 exam objectives for the **HashiCorp Terraform Associate (003)** certification.

---

## Exam Overview

| Detail | Info |
|--------|------|
| **Exam Code** | 003 |
| **Duration** | 60 minutes |
| **Questions** | 57 questions |
| **Format** | Multiple choice, multiple answer, true/false, fill-in-the-blank |
| **Passing Score** | ~70% (not officially published) |
| **Cost** | $70.50 USD |
| **Validity** | 2 years |
| **Prerequisite** | None |

---

## Objective 1: Understand Infrastructure as Code (IaC) Concepts

### What to Know
- IaC benefits: versioning, automation, consistency, collaboration
- Declarative vs imperative approaches
- IaC patterns and practices
- Day 0 (initial provisioning) vs Day 1 (ongoing management)

### Key Points
- Terraform is **declarative** — you define the desired end state
- IaC enables **version control**, **peer review**, and **automated testing** of infrastructure
- IaC reduces **configuration drift** and **human error**

> 📚 **Covered in**: Module 01

---

## Objective 2: Understand the Purpose of Terraform (vs Other IaC)

### What to Know
- What Terraform is and what it does
- Benefits of Terraform over other tools
- Multi-cloud and provider-agnostic capabilities
- When to use Terraform vs other tools (Ansible, CloudFormation)

### Key Points
- Terraform is **cloud-agnostic** — works with AWS, Azure, GCP, and 3000+ providers
- Uses **HCL** (HashiCorp Configuration Language) — human-readable
- **State-based** — tracks infrastructure in a state file
- **Execution plans** show changes before applying

> 📚 **Covered in**: Modules 01, 04

---

## Objective 3: Understand Terraform Basics

### What to Know
- Install Terraform and describe the plugin-based architecture
- Describe providers, their purpose, and configuration
- Describe resource address, block types, and block bodies
- Describe Terraform settings, required_version, and required_providers

### Key Points
- Terraform Core + Providers (plugins) architecture
- Provider source: `registry.terraform.io/hashicorp/aws`
- Resource address: `resource_type.resource_name` (e.g., `aws_instance.web`)
- `terraform {}` block for settings, version constraints, backend config
- `.terraform/` directory stores downloaded providers
- `.terraform.lock.hcl` locks provider versions — **commit to Git**

> 📚 **Covered in**: Modules 02, 03

---

## Objective 4: Use the Terraform CLI

### What to Know
- `terraform init`, `plan`, `apply`, `destroy`
- `terraform fmt`, `validate`
- `terraform state` subcommands
- `terraform import`
- `terraform workspace` subcommands
- `terraform taint`/`-replace`

### Key Points
```
init    → downloads providers, initializes backend
plan    → shows execution plan (what will change)
apply   → executes the plan
destroy → removes all managed resources
fmt     → auto-formats code
validate → checks syntax and consistency
```
- `terraform plan -out=plan.tfplan` saves a plan for exact apply
- `terraform apply -auto-approve` skips confirmation
- `terraform state list`, `show`, `mv`, `rm`, `pull`, `push`
- `terraform import <address> <id>` imports existing resources
- `terraform apply -replace=<address>` replaces `taint` (deprecated)

> 📚 **Covered in**: Modules 04, 09

---

## Objective 5: Interact with Terraform Modules

### What to Know
- Module sources (local, registry, Git)
- Module inputs and outputs
- Module versioning
- Public Terraform Registry

### Key Points
- Module = reusable package of configuration
- Root module = working directory where you run `terraform`
- Child modules = `module "name" { source = "..." }`
- Access outputs: `module.<name>.<output>`
- Version pin: `version = "~> 5.0"`
- Registry URL: `registry.terraform.io`

> 📚 **Covered in**: Modules 11, 12

---

## Objective 6: Navigate Terraform Workflow

### What to Know
- Core workflow: Write → Plan → Apply
- Working with backends
- Collaboration with Terraform
- Terraform Cloud/Enterprise features

### Key Points
- The workflow is always: **init → plan → apply**
- Plans should be **reviewed** before applying
- Remote backends enable **team collaboration**
- Saved plans ensure **what you reviewed = what you apply**
- CI/CD pipelines automate the workflow

> 📚 **Covered in**: Modules 04, 05, 15, 16

---

## Objective 7: Implement and Maintain State

### What to Know
- Purpose of state
- State storage and backends
- State locking
- Sensitive data in state
- State commands
- Backend types (S3, Azure Blob, GCS, Consul)

### Key Points
- State maps configuration to real-world resources
- State contains **sensitive data** — encrypt and restrict access
- S3 + DynamoDB = standard AWS backend (storage + locking)
- `terraform state` commands for management
- `terraform refresh` (deprecated) → `terraform apply -refresh-only`
- **Never manually edit** the state file
- Workspaces for environment isolation

> 📚 **Covered in**: Modules 09, 10

---

## Objective 8: Read, Generate, and Modify Configuration

### What to Know
- Variables, outputs, and data sources
- Resource addressing and dependencies
- Built-in functions
- Dynamic blocks and iteration
- `count`, `for_each`, `lifecycle`
- Provisioners

### Key Points
- Variable precedence: defaults < env vars < tfvars < CLI flags
- `data` sources are **read-only** queries
- `for_each` preferred over `count` (keyed vs indexed)
- `dynamic` blocks reduce repetition
- `lifecycle`: `prevent_destroy`, `ignore_changes`, `create_before_destroy`
- Provisioners are a **last resort**
- Functions: `merge`, `lookup`, `join`, `format`, `cidrsubnet`, `templatefile`

> 📚 **Covered in**: Modules 02, 05, 17, 18

---

## Objective 9: Understand HCP Terraform Capabilities

### What to Know
- HCP Terraform (formerly Terraform Cloud) features
- Remote execution
- Private module registry
- Sentinel policies
- Workspaces in HCP Terraform vs CLI workspaces
- Run triggers
- VCS integration

### Key Points
- HCP Terraform provides **remote state**, **remote execution**, and **collaboration**
- **Sentinel** = policy as code (HashiCorp proprietary)
- HCP Terraform workspaces ≠ CLI workspaces (HCP = separate state + config)
- **Free tier** available (up to 500 resources)
- VCS-driven workflows: auto-plan on PR, manual apply

> 📚 **Covered in**: Module 16 (overview), this study guide

---

## 📋 Last-Minute Revision Checklist

- [ ] Understand declarative vs imperative
- [ ] Know all CLI commands and their purposes
- [ ] Understand state: purpose, storage, locking, sensitivity
- [ ] Know variable types and precedence order
- [ ] Understand modules: sources, inputs, outputs, versioning
- [ ] Know `count` vs `for_each` differences
- [ ] Understand provider configuration and aliasing
- [ ] Know what `.terraform.lock.hcl` does (commit it!)
- [ ] Understand `lifecycle` meta-arguments
- [ ] Know HCP Terraform features vs open-source
- [ ] Understand `terraform import` workflow
- [ ] Know provisioner types and why to avoid them

---

**Next**: [Module 20 — Practice Exams →](../module-20-practice-exams/exam-1.md)
