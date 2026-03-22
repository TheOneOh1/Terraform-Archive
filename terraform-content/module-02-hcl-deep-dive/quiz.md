# Module 02 — Quiz: HCL Syntax & Types

---

### Question 1
Which of the following is a valid HCL variable type?

- A) `array(string)`
- B) `list(string)`
- C) `dict(string)`
- D) `hash(string)`

<details><summary>Answer</summary>

**B) `list(string)`**

HCL uses `list`, `map`, and `set` for collection types. There is no `array`, `dict`, or `hash` type.

</details>

---

### Question 2
How do you reference a variable named `instance_type` in a resource block?

- A) `${instance_type}`
- B) `variable.instance_type`
- C) `var.instance_type`
- D) `vars.instance_type`

<details><summary>Answer</summary>

**C) `var.instance_type`**

Variables are referenced using the `var.` prefix followed by the variable name.

</details>

---

### Question 3
What is the purpose of the `locals` block?

- A) To define provider credentials
- B) To create reusable computed values within a configuration
- C) To define remote state backends
- D) To configure Terraform plugins

<details><summary>Answer</summary>

**B) To create reusable computed values within a configuration**

Locals are named values that can be referenced throughout your configuration. They're useful for reducing repetition and computing intermediate values.

</details>

---

### Question 4
Which command auto-formats Terraform configuration files?

- A) `terraform lint`
- B) `terraform format`
- C) `terraform fmt`
- D) `terraform style`

<details><summary>Answer</summary>

**C) `terraform fmt`**

`terraform fmt` rewrites Terraform configuration files to a canonical format and style.

</details>

---

### Question 5
How do you reference a data source named `aws_ami.latest`?

- A) `data.aws_ami.latest.id`
- B) `aws_ami.latest.id`
- C) `source.aws_ami.latest.id`
- D) `ref.aws_ami.latest.id`

<details><summary>Answer</summary>

**A) `data.aws_ami.latest.id`**

Data sources are referenced with the `data.` prefix, followed by the type and name.

</details>

---

### Question 6
What does the `sensitive = true` argument do in an output block?

- A) Encrypts the output value
- B) Prevents the value from being displayed in CLI output
- C) Hides it from the state file
- D) Requires a password to view

<details><summary>Answer</summary>

**B) Prevents the value from being displayed in CLI output**

Sensitive outputs are redacted in `terraform plan` and `terraform apply` output, but are still stored in the state file.

</details>

---

### Question 7
What is the correct syntax for string interpolation in HCL?

- A) `"Hello, {var.name}"`
- B) `"Hello, ${var.name}"`
- C) `"Hello, #{var.name}"`
- D) `"Hello, %(var.name)"`

<details><summary>Answer</summary>

**B) `"Hello, ${var.name}"`**

HCL uses `${}` for interpolation within double-quoted strings.

</details>

---

### Question 8
Which variable type would you use for this structure: `{ name = "web", port = 80, enabled = true }`?

- A) `map(string)`
- B) `list(any)`
- C) `object({ name = string, port = number, enabled = bool })`
- D) `tuple([string, number, bool])`

<details><summary>Answer</summary>

**C) `object({ name = string, port = number, enabled = bool })`**

An `object` type allows defining a structure with named attributes of different types.

</details>

---

### Question 9
What is the Terraform variable precedence order (highest to lowest)?

- A) tfvars file → environment variable → CLI flag → default
- B) CLI flag → tfvars file → environment variable → default
- C) default → environment variable → tfvars file → CLI flag
- D) environment variable → CLI flag → tfvars file → default

<details><summary>Answer</summary>

**C) default → environment variable → tfvars file → CLI flag**

From lowest to highest: defaults, then env vars (`TF_VAR_`), then tfvars files, then CLI flags (`-var`). CLI flags override everything.

</details>

---

### Question 10
How does Terraform handle multiple `.tf` files in the same directory?

- A) Only `main.tf` is read
- B) Files are loaded in alphabetical order and earlier files override later ones
- C) All `.tf` files are merged and processed as a single configuration
- D) You must explicitly import each file

<details><summary>Answer</summary>

**C) All `.tf` files are merged and processed as a single configuration**

Terraform automatically loads and merges all `.tf` files in the current directory. The file names are purely for human organization.

</details>

---

## 📊 Score Yourself

| Score | Rating |
|-------|--------|
| 9–10 | ⭐ Excellent |
| 7–8 | 👍 Good |
| 5–6 | 📖 Fair — Review the theory |
| < 5 | 🔄 Review — Re-read theory and redo the lab |

---

**Next**: [Project →](project/README.md)
