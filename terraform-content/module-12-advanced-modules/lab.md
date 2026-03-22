# Module 12 — Lab & Assignment & Quiz

## Lab: Composable Infrastructure

Build a root module that composes a VPC module and an S3 module together, passing outputs between them. Add conditional NAT gateway creation controlled by a variable.

### Steps
1. Create `modules/vpc/` with VPC, subnets, IGW, optional NAT
2. Create `modules/storage/` with S3 bucket, versioning, IAM
3. Root module uses both, passing VPC outputs to storage module
4. Deploy with `create_nat_gateway = false` (Free Tier safe)
5. Destroy all resources

---

## Assignment
Create a library of 3 modules (vpc, compute, storage) and compose them into a complete infrastructure. Each module should have README.md documentation.

### Checklist
- [ ] 3 independent modules
- [ ] Modules connected via inputs/outputs
- [ ] Conditional resource creation in at least 1 module
- [ ] README.md in each module
- [ ] Destroyed

---

## Quiz

### Q1: How do modules communicate?
A) Global variables B) Shared state C) Input variables and outputs D) Direct references

<details><summary>Answer</summary>**C) Input variables and outputs**</details>

### Q2: What does `count = var.enabled ? 1 : 0` achieve?
A) Creates 1 resource always B) Conditional resource creation C) Creates a loop D) Error

<details><summary>Answer</summary>**B) Conditional resource creation** — creates the resource only if var.enabled is true</details>

### Q3: How to pin a module to a Git tag?
A) `source = "git::url?tag=v1.0"` B) `source = "git::url?ref=v1.0"` C) `version = "v1.0"` D) `tag = "v1.0"`

<details><summary>Answer</summary>**B) `source = "git::url?ref=v1.0"`**</details>

### Q4: Can a child module use resources from another child module directly?
A) Yes B) No — must pass through root module outputs C) Only with depends_on D) Only if in same directory

<details><summary>Answer</summary>**B) No** — child modules communicate through the root module</details>

### Q5: Where is module documentation best placed?
A) In the root module B) In README.md within each module directory C) In terraform.tfvars D) In a separate docs/ folder

<details><summary>Answer</summary>**B) In README.md within each module directory**</details>

---

**Next Phase**: [Module 13 →](../module-13-multi-tier/theory.md)
