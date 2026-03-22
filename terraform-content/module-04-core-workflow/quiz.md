# Module 04 — Quiz: Core Workflow

---

### Question 1
What is the correct order of the Terraform workflow?

- A) plan → init → apply → destroy
- B) init → apply → plan → destroy
- C) init → plan → apply → destroy
- D) apply → init → plan → destroy

<details><summary>Answer</summary>

**C) init → plan → apply → destroy**

</details>

---

### Question 2
What does the `+` symbol mean in a Terraform plan?

- A) Update in place
- B) Create a new resource
- C) Destroy a resource
- D) No change

<details><summary>Answer</summary>

**B) Create a new resource**

</details>

---

### Question 3
How do you save a Terraform plan to a file?

- A) `terraform plan > plan.txt`
- B) `terraform plan -save=plan`
- C) `terraform plan -out=plan.tfplan`
- D) `terraform plan --output plan`

<details><summary>Answer</summary>

**C) `terraform plan -out=plan.tfplan`**

</details>

---

### Question 4
What does `terraform apply -auto-approve` do?

- A) Automatically formats the configuration
- B) Skips the interactive approval prompt
- C) Automatically initializes the project
- D) Approves all future changes

<details><summary>Answer</summary>

**B) Skips the interactive approval prompt**

</details>

---

### Question 5
What symbol in a plan indicates a resource will be **destroyed and recreated**?

- A) `+`
- B) `~`
- C) `-`
- D) `-/+`

<details><summary>Answer</summary>

**D) `-/+`** — This means the resource will be replaced (destroyed then recreated).

</details>

---

### Question 6
How does Terraform determine the order of resource creation?

- A) Alphabetical order of resource names
- B) Order of resources in the `.tf` file
- C) Dependency graph based on references
- D) Random order

<details><summary>Answer</summary>

**C) Dependency graph based on references** — Terraform builds a DAG (Directed Acyclic Graph) from resource references.

</details>

---

### Question 7
What does `terraform apply -refresh-only` do?

- A) Only creates new resources
- B) Updates the state to match actual infrastructure without making changes
- C) Refreshes the provider plugins
- D) Deletes and recreates all resources

<details><summary>Answer</summary>

**B) Updates the state to match actual infrastructure without making changes**

</details>

---

### Question 8
When should you use the `-target` flag?

- A) Always, for safety
- B) Only in exceptional circumstances, not regular workflows
- C) Every time you run apply
- D) Only during initialization

<details><summary>Answer</summary>

**B) Only in exceptional circumstances** — Using `-target` skips dependency checks and should be avoided in normal operations.

</details>

---

### Question 9
What does `(known after apply)` mean in a plan?

- A) The value is secret
- B) The value will be determined by the provider during apply
- C) There's an error in the configuration
- D) The value hasn't changed

<details><summary>Answer</summary>

**B) The value will be determined by the provider during apply** — Some attributes (like IDs, ARNs) are only known after the resource exists.

</details>

---

### Question 10
What is the modern replacement for `terraform taint`?

- A) `terraform refresh`
- B) `terraform apply -replace=RESOURCE`
- C) `terraform import`
- D) `terraform state rm`

<details><summary>Answer</summary>

**B) `terraform apply -replace=RESOURCE`** — The `-replace` flag on `apply` replaces the deprecated `taint` command.

</details>

---

## 📊 Score Yourself

| Score | Rating |
|-------|--------|
| 9–10 | ⭐ Excellent |
| 7–8 | 👍 Good |
| 5–6 | 📖 Fair |
| < 5 | 🔄 Review |

---

**Next**: [Project →](project/README.md)
