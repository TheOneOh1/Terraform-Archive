# Module 20 — Practice Exam 1

## 📝 Instructions

- **57 questions** — same as the real exam
- **Time limit**: 60 minutes
- **Passing score**: ~70% (40/57)
- Answer all questions before checking answers at the bottom

---

### Q1
What command initializes a Terraform working directory?

- A) `terraform start`
- B) `terraform init`
- C) `terraform setup`
- D) `terraform begin`

---

### Q2
Which of the following is NOT a benefit of Infrastructure as Code?

- A) Version control
- B) Eliminates the need for cloud accounts
- C) Consistency across environments
- D) Automated provisioning

---

### Q3
Terraform uses which approach?

- A) Imperative
- B) Declarative
- C) Procedural
- D) Object-oriented

---

### Q4
Where are Terraform providers downloaded during `terraform init`?

- A) `~/.terraform/providers/`
- B) `.terraform/providers/`
- C) `/usr/lib/terraform/`
- D) `./providers/`

---

### Q5
What file specifies the exact provider versions used?

- A) `terraform.tfstate`
- B) `versions.tf`
- C) `.terraform.lock.hcl`
- D) `provider.lock`

---

### Q6
Should `.terraform.lock.hcl` be committed to version control?

- A) No
- B) Yes
- C) Only in production
- D) Only for team projects

---

### Q7
What does `terraform plan` do?

- A) Applies changes to infrastructure
- B) Creates an execution plan showing proposed changes
- C) Downloads provider plugins
- D) Destroys resources

---

### Q8
In `resource "aws_instance" "web" {}`, what is "web"?

- A) The AWS instance name
- B) The resource type
- C) The local name for this resource in Terraform
- D) The AWS region

---

### Q9
How do you reference a variable named `region` in HCL?

- A) `${region}`
- B) `variable.region`
- C) `var.region`
- D) `vars.region`

---

### Q10
What is the purpose of the state file?

- A) Store provider credentials
- B) Map configuration to real-world resources
- C) Cache Terraform binary
- D) Store variable values

---

### Q11
Which variable definition method has the HIGHEST precedence?

- A) `terraform.tfvars`
- B) Environment variable (`TF_VAR_xxx`)
- C) `-var` flag on command line
- D) Default value in variable block

---

### Q12
What does `terraform destroy` do?

- A) Deletes the Terraform binary
- B) Removes all resources managed by the configuration
- C) Deletes the state file
- D) Uninstalls providers

---

### Q13
Which block type reads existing infrastructure without managing it?

- A) `resource`
- B) `module`
- C) `data`
- D) `provider`

---

### Q14
What does `sensitive = true` on an output do?

- A) Encrypts the value in state
- B) Prevents the value from appearing in CLI output
- C) Requires MFA to view
- D) Hides it from the state file

---

### Q15
What meta-argument would you use to create multiple similar resources?

- A) `depends_on`
- B) `provider`
- C) `for_each` or `count`
- D) `lifecycle`

---

### Q16
What is the difference between `count` and `for_each`?

- A) No difference
- B) `count` uses integers; `for_each` uses maps/sets
- C) `for_each` is deprecated
- D) `count` is only for modules

---

### Q17
Which command imports an existing resource into Terraform state?

- A) `terraform add`
- B) `terraform import`
- C) `terraform adopt`
- D) `terraform register`

---

### Q18
What backend is commonly used for remote state on AWS?

- A) DynamoDB
- B) S3
- C) RDS
- D) EFS

---

### Q19
What does DynamoDB provide when used with S3 backend?

- A) State encryption
- B) State versioning
- C) State locking
- D) State replication

---

### Q20
What is a Terraform module?

- A) A single Terraform file
- B) A reusable, self-contained package of configuration
- C) A provider plugin
- D) A state management tool

---

### Q21
How do you access a module's output value?

- A) `output.module_name.value`
- B) `module.module_name.output_name`
- C) `module[name].output`
- D) `modules.name.value`

---

### Q22
What does `terraform fmt` do?

- A) Validates syntax
- B) Auto-formats configuration files
- C) Shows formatted state
- D) Formats output display

---

### Q23
What is the `terraform console` used for?

- A) Managing providers
- B) Interactive evaluation of expressions
- C) Remote SSH access
- D) State management

---

### Q24
What does `lifecycle { prevent_destroy = true }` do?

- A) Prevents creating the resource
- B) Prevents Terraform from destroying the resource
- C) Prevents updates to the resource
- D) Prevents state changes

---

### Q25
What does the `depends_on` meta-argument do?

- A) Creates an explicit dependency between resources
- B) Removes a dependency
- C) Makes resources run in parallel
- D) Imports dependencies automatically

---

### Q26
Terraform is cloud-agnostic. What does this mean?

- A) It only works without cloud providers
- B) It can work with multiple cloud providers
- C) It doesn't need an internet connection
- D) It only works with HashiCorp products

---

### Q27
What symbol in `terraform plan` output indicates a resource will be updated?

- A) `+`
- B) `-`
- C) `~`
- D) `!`

---

### Q28
What is the default local state file name?

- A) `state.json`
- B) `terraform.state`
- C) `terraform.tfstate`
- D) `.tfstate`

---

### Q29
Which command shows the current state?

- A) `terraform status`
- B) `terraform show`
- C) `terraform state view`
- D) `terraform current`

---

### Q30
What does the `provider` meta-argument in a resource block do?

- A) Installs a different provider
- B) Specifies which provider configuration (alias) to use
- C) Updates the provider version
- D) Removes the provider

---

### Q31
What is HCL?

- A) HashiCorp Command Language
- B) HashiCorp Configuration Language
- C) High-level Cloud Language
- D) Hybrid Configuration Logic

---

### Q32
What happens if you run `terraform apply` without `terraform init`?

- A) Terraform auto-initializes
- B) An error occurs
- C) Only local resources are created
- D) Plan is generated but not applied

---

### Q33
What type of value can a Terraform variable NOT have?

- A) `string`
- B) `list`
- C) `map`
- D) `array`

---

### Q34
Which file is auto-loaded by Terraform for variable values?

- A) `variables.auto.tf`
- B) `terraform.tfvars`
- C) `defaults.tf`
- D) `config.tfvars`

---

### Q35
What does `terraform workspace new staging` do?

- A) Creates a staging directory
- B) Creates a new workspace called "staging"
- C) Deploys to a staging environment
- D) Switches to the staging branch

---

### Q36
What is the relationship between Terraform workspaces and state?

- A) All workspaces share one state
- B) Each workspace has its own state
- C) Workspaces don't use state
- D) Only the default workspace has state

---

### Q37
Provisioners are considered a:

- A) Best practice
- B) Required feature
- C) Last resort
- D) Deprecated feature

---

### Q38
What function combines two maps?

- A) `combine()`
- B) `join()`
- C) `merge()`
- D) `concat()`

---

### Q39
What does `terraform validate` check?

- A) AWS credentials
- B) Syntax and consistency of configuration
- C) State file integrity
- D) Provider availability

---

### Q40
In HCP Terraform, what is Sentinel?

- A) A logging tool
- B) Policy as Code framework
- C) A monitoring dashboard
- D) A deployment tool

---

### Q41
What version constraint does `~> 5.0` allow?

- A) Only 5.0.0
- B) >= 5.0, < 6.0
- C) >= 5.0, < 5.1
- D) Any version 5+

---

### Q42
What does `terraform state rm` do?

- A) Destroys the resource in the cloud
- B) Removes the resource from state without destroying it
- C) Removes the state file
- D) Resets the state to empty

---

### Q43
How do you pass a variable via environment variable?

- A) `TERRAFORM_region=us-east-1`
- B) `TF_region=us-east-1`
- C) `TF_VAR_region=us-east-1`
- D) `VAR_region=us-east-1`

---

### Q44
What does `(known after apply)` mean in a plan?

- A) The value is secret
- B) The value will be determined by the provider after resource creation
- C) There's a syntax error
- D) The value defaults to null

---

### Q45
A `data` block is:

- A) Write-only
- B) Read-only — queries existing resources
- C) Used to create resources
- D) Used to define variables

---

### Q46
What does `terraform apply -replace=aws_instance.web` do?

- A) Updates the instance in place
- B) Forces recreation of the specified resource
- C) Replaces the provider
- D) Removes the resource from state

---

### Q47
Which block type defines local computed values?

- A) `variable`
- B) `output`
- C) `locals`
- D) `data`

---

### Q48
What is the maximum number of providers a Terraform configuration can use?

- A) 1
- B) 5
- C) 10
- D) Unlimited

---

### Q49
What does `terraform output -json` return?

- A) State in JSON format
- B) All outputs in JSON format
- C) Provider info in JSON
- D) Plan in JSON format

---

### Q50
What is a remote backend used for?

- A) Running Terraform on remote servers
- B) Storing state remotely for collaboration and security
- C) Remote provider installation
- D) Remote code execution

---

### Q51
What does `dynamic` block do?

- A) Creates resources dynamically
- B) Generates repeated nested blocks based on a collection
- C) Enables dynamic provider loading
- D) Creates dynamic variables

---

### Q52
What does `ignore_changes` in lifecycle do?

- A) Ignores errors during apply
- B) Tells Terraform to ignore specific attribute changes
- C) Ignores state drift
- D) Ignores variable changes

---

### Q53
What is the purpose of `terraform.tfvars`?

- A) Define resources
- B) Supply variable values
- C) Configure providers
- D) Define outputs

---

### Q54
HCP Terraform workspaces differ from CLI workspaces because:

- A) They're the same
- B) HCP workspaces have their own variables, state, and configuration
- C) CLI workspaces are more powerful
- D) HCP workspaces don't support modules

---

### Q55
What must you do before using `terraform import`?

- A) Run `terraform plan`
- B) Write the resource block in your configuration
- C) Delete the state file
- D) Install extra plugins

---

### Q56
What is the `for` expression used for?

- A) Looping through commands
- B) Transforming collections (lists and maps)
- C) Creating for-loops in provisioners
- D) Iteration over providers

---

### Q57
Which of these is a valid Terraform resource address?

- A) `aws.instance.web`
- B) `resource:aws_instance:web`
- C) `aws_instance.web`
- D) `aws/instance/web`

---

## ✅ Answer Key

| Q | Answer | Q | Answer | Q | Answer |
|---|--------|---|--------|---|--------|
| 1 | B | 20 | B | 39 | B |
| 2 | B | 21 | B | 40 | B |
| 3 | B | 22 | B | 41 | B |
| 4 | B | 23 | B | 42 | B |
| 5 | C | 24 | B | 43 | C |
| 6 | B | 25 | A | 44 | B |
| 7 | B | 26 | B | 45 | B |
| 8 | C | 27 | C | 46 | B |
| 9 | C | 28 | C | 47 | C |
| 10 | B | 29 | B | 48 | D |
| 11 | C | 30 | B | 49 | B |
| 12 | B | 31 | B | 50 | B |
| 13 | C | 32 | B | 51 | B |
| 14 | B | 33 | D | 52 | B |
| 15 | C | 34 | B | 53 | B |
| 16 | B | 35 | B | 54 | B |
| 17 | B | 36 | B | 55 | B |
| 18 | B | 37 | C | 56 | B |
| 19 | C | 38 | C | 57 | C |

---

## 📊 Score Yourself

| Score | Rating |
|-------|--------|
| 50–57 | 🏆 **Exam Ready** — Schedule your exam! |
| 40–49 | ⭐ **Almost There** — Review weak areas |
| 30–39 | 📖 **Needs Work** — Review study guide and retake |
| < 30 | 🔄 **Not Ready** — Go through the bootcamp again |

---

**Next**: [Practice Exam 2 →](exam-2.md)
