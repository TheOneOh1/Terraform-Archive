# Module 04 — Core Workflow: init, plan, apply, destroy

## 🎯 Learning Objectives

By the end of this module, you will:
- Master the complete Terraform workflow
- Understand what happens under the hood at each stage
- Read and interpret execution plans
- Manage resource dependencies and ordering
- Use advanced CLI flags effectively

---

## 1. The Terraform Workflow

```
The Complete Terraform Workflow:

  Write Config ──▶ terraform init ──▶ terraform plan ──▶ terraform apply
       │                │                   │                  │
       │                │                   │                  │
       ▼                ▼                   ▼                  ▼
  ┌─────────┐    ┌───────────┐     ┌──────────────┐   ┌────────────┐
  │  *.tf   │    │ Download  │     │  Compare     │   │  Execute   │
  │  files  │    │ providers │     │  config vs   │   │  changes   │
  │         │    │ Init      │     │  state       │   │  Update    │
  │         │    │ backend   │     │  Show diff   │   │  state     │
  └─────────┘    └───────────┘     └──────────────┘   └────────────┘
                                                            │
                                                            ▼
                                                    ┌────────────┐
                                                    │ terraform  │
                                                    │  destroy   │
                                                    │ (teardown) │
                                                    └────────────┘
```

---

## 2. terraform init — Initialization

The first command you run in any Terraform project.

### What Happens

```
terraform init:
┌────────────────────────────────────────────────┐
│ 1. Backend Initialization                      │
│    • Configure state storage (local/remote)    │
│    • Create .terraform/ directory              │
│                                                │
│ 2. Provider Installation                       │
│    • Read required_providers from config       │
│    • Download matching versions                │
│    • Store in .terraform/providers/            │
│    • Generate .terraform.lock.hcl              │
│                                                │
│ 3. Module Installation (if any)                │
│    • Download modules from registry/git        │
│    • Store in .terraform/modules/              │
│                                                │
│ 4. Child Module Installation                   │
│    • Initialize any child modules recursively  │
└────────────────────────────────────────────────┘
```

### Important Flags

```bash
terraform init                    # Standard init
terraform init -upgrade           # Upgrade providers to latest matching version
terraform init -reconfigure       # Reconfigure backend (ignore existing)
terraform init -migrate-state     # Migrate state to new backend
terraform init -backend=false     # Skip backend configuration
```

---

## 3. terraform plan — Preview Changes

The `plan` command is your **safety net**. It shows what will happen without making changes.

### Reading a Plan

```
Plan Output Legend:
  +  create     (new resource)
  -  destroy    (remove resource)
  ~  update     (modify in-place)
  -/+ replace   (destroy and recreate)
  <= read       (data source query)
```

### Example Plan Output

```
Terraform will perform the following actions:

  # aws_instance.web will be created
  + resource "aws_instance" "web" {
      + ami                    = "ami-0c55b159cbfafe1f0"
      + arn                    = (known after apply)
      + instance_type          = "t2.micro"
      + id                     = (known after apply)
      + public_ip              = (known after apply)
      + tags                   = {
          + "Name" = "WebServer"
        }
    }

  # aws_s3_bucket.logs will be updated in-place
  ~ resource "aws_s3_bucket" "logs" {
        id     = "my-logs-bucket"
      ~ tags   = {
          + "UpdatedAt" = "2026-03-14"
        }
    }

Plan: 1 to add, 1 to change, 0 to destroy.
```

### Important Flags

```bash
terraform plan                       # Standard plan
terraform plan -out=tfplan           # Save plan to file
terraform plan -var="env=prod"       # Pass variable
terraform plan -var-file=prod.tfvars # Use variable file
terraform plan -target=aws_s3.main   # Plan specific resource only
terraform plan -destroy              # Preview destroy
```

---

## 4. terraform apply — Execute Changes

Applies the changes shown in the plan to your infrastructure.

### Execution Flow

```
terraform apply:
┌───────────────────────────────────────────────────┐
│ 1. Generate Plan (same as terraform plan)         │
│ 2. Show Plan to User                              │
│ 3. Wait for Confirmation ("yes")                  │
│ 4. Execute Changes via Provider APIs              │
│    ┌──────────────────────────────────────┐       │
│    │ For each resource (in dependency order):│     │
│    │  • Create / Update / Delete           │      │
│    │  • Wait for completion                │      │
│    │  • Record in state                    │      │
│    └──────────────────────────────────────┘       │
│ 5. Update State File                              │
│ 6. Display Outputs                                │
└───────────────────────────────────────────────────┘
```

### Important Flags

```bash
terraform apply                      # Standard apply (interactive)
terraform apply -auto-approve        # Skip confirmation
terraform apply tfplan               # Apply saved plan
terraform apply -var="env=prod"      # Pass variable
terraform apply -target=aws_s3.main  # Apply specific resource
terraform apply -parallelism=10      # Control concurrency
terraform apply -replace=aws_instance.web  # Force replacement
```

---

## 5. terraform destroy — Tear Down

Removes all resources managed by the current configuration.

```
terraform destroy:
┌───────────────────────────────────────────────────┐
│ 1. Read State File                                │
│ 2. Calculate Destroy Plan (reverse dependency)    │
│ 3. Show Plan to User                              │
│ 4. Wait for Confirmation                          │
│ 5. Destroy Resources (reverse order)              │
│    ┌──────────────────────────────┐               │
│    │  Destroy dependent resources │               │
│    │  first, then dependencies    │               │
│    └──────────────────────────────┘               │
│ 6. Update State to Empty                          │
└───────────────────────────────────────────────────┘
```

```bash
terraform destroy                    # Destroy all
terraform destroy -auto-approve      # Skip confirmation
terraform destroy -target=aws_s3.x   # Destroy specific resource
```

---

## 6. Resource Dependencies

Terraform automatically determines resource ordering using a **dependency graph**.

### Implicit Dependencies

```hcl
# Terraform knows the instance depends on the subnet
resource "aws_subnet" "main" {
  vpc_id     = aws_vpc.main.id    # depends on VPC
  cidr_block = "10.0.1.0/24"
}

resource "aws_instance" "web" {
  subnet_id = aws_subnet.main.id  # depends on subnet
  ami       = "ami-12345"
  instance_type = "t2.micro"
}
```

### Explicit Dependencies

```hcl
# When there's no attribute reference but the dependency exists
resource "aws_s3_bucket" "logs" {
  bucket = "app-logs"
}

resource "aws_instance" "app" {
  ami           = "ami-12345"
  instance_type = "t2.micro"

  depends_on = [aws_s3_bucket.logs]  # Explicit dependency
}
```

### Dependency Graph

```bash
# Visualize the graph (requires Graphviz)
terraform graph | dot -Tpng > graph.png

# Text output
terraform graph
```

```
Dependency Graph Example:
                    ┌───────────┐
                    │  aws_vpc  │
                    │   main    │
                    └─────┬─────┘
                          │
              ┌───────────┴───────────┐
              ▼                       ▼
       ┌────────────┐         ┌────────────┐
       │ aws_subnet │         │ aws_subnet │
       │   public   │         │  private   │
       └──────┬─────┘         └──────┬─────┘
              │                      │
              ▼                      ▼
       ┌────────────┐         ┌────────────┐
       │ aws_instance│        │  aws_rds   │
       │    web     │         │  database  │
       └────────────┘         └────────────┘
```

---

## 7. Other Essential Commands

```bash
# Validate configuration syntax
terraform validate

# Format code
terraform fmt
terraform fmt -recursive

# Show current state
terraform show

# View outputs
terraform output
terraform output -json

# Refresh state (sync with actual infrastructure)
terraform refresh    # Deprecated, use:
terraform apply -refresh-only

# Import existing resources
terraform import aws_s3_bucket.example my-bucket-name

# Taint (mark for recreation) — deprecated in favor of -replace
terraform taint aws_instance.web        # Deprecated
terraform apply -replace=aws_instance.web  # Modern approach
```

---

## 📝 Key Takeaways

1. **init** → downloads providers, sets up backend
2. **plan** → previews changes (your safety net!)
3. **apply** → executes changes, updates state
4. **destroy** → tears down all managed resources
5. Always **read the plan** before applying
6. Terraform automatically resolves **dependencies** via the resource graph
7. Use `-out=tfplan` to save and apply exact plans in CI/CD

---

**Next**: [Lab →](lab.md)
