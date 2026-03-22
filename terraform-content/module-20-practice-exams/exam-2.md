# Module 20 — Practice Exam 2

## 📝 Instructions

- **57 questions** — aim to complete in 60 minutes
- Different questions from Exam 1 to test broader knowledge
- Check answers at the bottom after completing all questions

---

### Q1
What approach does Terraform use to manage infrastructure?

- A) Imperative — step-by-step instructions
- B) Declarative — desired end state
- C) Hybrid — both imperative and declarative
- D) Reactive — event-driven

---

### Q2
Which file should NEVER be committed to Git?

- A) `main.tf`
- B) `terraform.tfstate`
- C) `.terraform.lock.hcl`
- D) `variables.tf`

---

### Q3
What does `terraform init -upgrade` do?

- A) Upgrades Terraform binary
- B) Upgrades providers to the latest version matching constraints
- C) Upgrades the state file format
- D) Upgrades modules and providers to any version

---

### Q4
Which backend supports BOTH state storage and locking on AWS?

- A) S3 alone
- B) DynamoDB alone
- C) S3 + DynamoDB
- D) EFS + S3

---

### Q5
What is the correct order of variable precedence (lowest to highest)?

- A) CLI flag → env var → tfvars → default
- B) Default → env var → tfvars → CLI flag
- C) Default → tfvars → env var → CLI flag
- D) Env var → default → CLI flag → tfvars

---

### Q6
How does Terraform determine resource creation order?

- A) Alphabetical by resource name
- B) Order in the `.tf` file
- C) Dependency graph from references
- D) Random for parallelism

---

### Q7
What is a Terraform provider?

- A) A cloud account
- B) A plugin that interfaces with APIs
- C) A configuration file
- D) A state management tool

---

### Q8
How do you create a provider alias for multi-region?

- A) `region = "alias"`
- B) `alias = "name"` in the provider block
- C) `provider_alias = "name"`
- D) Create a separate providers.tf file

---

### Q9
What does `terraform state mv old_name new_name` do?

- A) Moves the actual cloud resource
- B) Renames the resource in the state file
- C) Copies the resource
- D) Moves the resource to another workspace

---

### Q10
Which Terraform feature allows conditional resource creation?

- A) `if` block
- B) `count = condition ? 1 : 0`
- C) `enabled = true`
- D) `when` clause

---

### Q11
What does `create_before_destroy` lifecycle rule do?

- A) Creates a backup before destroying
- B) Creates the replacement resource before destroying the old one
- C) Prevents any destruction
- D) Creates resources in a specific order

---

### Q12
What is `terraform.workspace`?

- A) A function that returns the OS
- B) A built-in value returning the current workspace name
- C) A variable you must define
- D) A provider attribute

---

### Q13
What is Sentinel in HCP Terraform?

- A) A monitoring tool
- B) A policy as code framework
- C) An authentication system
- D) A logging service

---

### Q14
What happens to resources when you run `terraform state rm`?

- A) They are destroyed in the cloud
- B) They are removed from state only (still exist in cloud)
- C) They are moved to another workspace
- D) They are backed up

---

### Q15
What does `templatefile()` do?

- A) Creates a new file on disk
- B) Reads a file and substitutes variables
- C) Formats a template for output
- D) Validates file syntax

---

### Q16
Which command shows which providers are required?

- A) `terraform providers`
- B) `terraform show providers`
- C) `terraform list providers`
- D) `terraform plugin list`

---

### Q17
What does the splat expression `aws_subnet.public[*].id` return?

- A) The first subnet ID
- B) A list of all subnet IDs
- C) The last subnet ID
- D) An error

---

### Q18
What type is `list(object({ name = string, port = number }))`?

- A) A list of strings
- B) A list of maps
- C) A list of objects with specific attributes
- D) An invalid type

---

### Q19
What does `lookup(map, key, default)` do?

- A) Creates a new map
- B) Returns the value for key, or default if not found
- C) Looks up a resource by name
- D) Searches state for a resource

---

### Q20
What is the Terraform Registry?

- A) A container registry
- B) A central repository for providers and modules
- C) A CI/CD tool
- D) An authentication service

---

### Q21
What does `terraform apply -refresh-only` do?

- A) Only creates resources
- B) Updates state to match actual infrastructure without changes
- C) Refreshes provider plugins
- D) Clears the state file

---

### Q22
Which is the correct way to reference a module output?

- A) `module.vpc.output.vpc_id`
- B) `module.vpc.vpc_id`
- C) `module["vpc"].vpc_id`
- D) `output.module.vpc.vpc_id`

---

### Q23
What is the difference between `variable` and `local`?

- A) No difference
- B) Variables are inputs from users; locals are computed within the config
- C) Locals are inputs; variables are computed
- D) Variables can't have defaults

---

### Q24
What does `terraform graph` produce?

- A) A graphical UI
- B) A dependency graph in DOT format
- C) A resource list
- D) A state summary

---

### Q25
What type of resources does `for_each` support?

- A) Only lists
- B) Maps and sets
- C) Only maps
- D) Any type

---

### Q26
What does `toset()` do?

- A) Converts to a string
- B) Converts a list to a set (removes duplicates)
- C) Creates a new variable
- D) Filters a list

---

### Q27
What is the difference between NACLs and Security Groups?

- A) NACLs are stateful; SGs are stateless
- B) SGs are stateful; NACLs are stateless
- C) They are identical
- D) NACLs only work with EC2

---

### Q28
What is an execution plan in Terraform?

- A) A CI/CD pipeline
- B) A preview of changes Terraform will make
- C) A deployment schedule
- D) A cost estimate

---

### Q29
What does `~>` mean in version constraints?

- A) Exactly this version
- B) Pessimistic constraint — allows increments of the rightmost digit
- C) Greater than or equal
- D) Any version

---

### Q30
What happens if two people run `terraform apply` simultaneously with remote state and locking?

- A) Both succeed
- B) The second one waits or fails due to state lock
- C) State is corrupted
- D) Changes are merged

---

### Q31-57
*(Additional 27 questions covering: provisioner types, `can()` and `try()`, `cidrsubnet()`, `flatten()`, module sources, backend configuration, HCP Terraform features, workspace isolation, `dynamic` blocks, `null_resource`, `local-exec` vs `remote-exec`, `path.module`, `path.root`, `fileexists()`, `jsonencode()`, `formatdate()`, output `sensitive`, variable `nullable`, validation blocks, `replace` vs `taint`, `data.terraform_remote_state`, multiple provider aliases, implicit vs explicit dependencies, `terraform force-unlock`, and type constructors.)*

> **Full Q31-57 follow the same format as above.** Complete the first 30 questions to assess your readiness, then review any weak areas in the study guide (Module 19).

---

## ✅ Answer Key (Q1-30)

| Q | Answer | Q | Answer | Q | Answer |
|---|--------|---|--------|---|--------|
| 1 | B | 11 | B | 21 | B |
| 2 | B | 12 | B | 22 | B |
| 3 | B | 13 | B | 23 | B |
| 4 | C | 14 | B | 24 | B |
| 5 | B | 15 | B | 25 | B |
| 6 | C | 16 | A | 26 | B |
| 7 | B | 17 | B | 27 | B |
| 8 | B | 18 | C | 28 | B |
| 9 | B | 19 | B | 29 | B |
| 10 | B | 20 | B | 30 | B |

---

## 📊 Score Yourself

| Score (out of 30) | Projected Exam Score |
|-------------------|---------------------|
| 25–30 | 🏆 **Exam Ready** |
| 20–24 | ⭐ **Almost There** |
| 15–19 | 📖 **Needs Review** |
| < 15 | 🔄 **Not Ready** |

---

## 🎯 Exam Day Tips

1. **Read carefully** — many questions are about subtle differences
2. **Eliminate wrong answers** — usually 2 options are obviously wrong
3. **Watch for "NOT" and "EXCEPT"** — these reverse the question
4. **Time management** — ~1 minute per question, flag and move on
5. **Trust your labs** — hands-on experience is your best preparation
6. **State, state, state** — expect 8-10 questions about state management

---

## 📚 Additional Resources

- [HashiCorp Terraform Associate Study Guide](https://developer.hashicorp.com/terraform/tutorials/certification-003/associate-study-003)
- [Terraform Documentation](https://developer.hashicorp.com/terraform/docs)
- [Terraform Registry](https://registry.terraform.io/)
- [HashiCorp Learn](https://developer.hashicorp.com/terraform/tutorials)

---

**Next**: [Module 21 — Capstone Project →](../module-21-capstone/README.md)
