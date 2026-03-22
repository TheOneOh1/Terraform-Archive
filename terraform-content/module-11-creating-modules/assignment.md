# Module 11 — Assignment & Quiz

## Assignment
Create a reusable S3 module and a security group module. Use both from a root module. The S3 module should accept parameters for versioning, encryption, and lifecycle rules. Output all resource details.

### Checklist
- [ ] S3 module with configurable versioning/encryption
- [ ] Security group module with configurable rules
- [ ] Root module using both modules
- [ ] All outputs working
- [ ] Destroyed

---

## Quiz

### Q1: What is a root module?
A) A module from the registry B) The main working directory C) A module with no variables D) The first module created

<details><summary>Answer</summary>**B) The main working directory** where you run terraform commands</details>

### Q2: How do you access module outputs?
A) `output.module.name` B) `module.name.output_name` C) `module[name].output` D) `modules.name.value`

<details><summary>Answer</summary>**B) `module.name.output_name`**</details>

### Q3: Which command downloads modules?
A) `terraform get` B) `terraform modules` C) `terraform init` D) Both A and C

<details><summary>Answer</summary>**D) Both A and C** — `init` downloads modules as part of initialization, `get` only downloads modules</details>

### Q4: Where are registry modules stored?
A) `.terraform/modules/` B) `./modules/` C) `/usr/share/terraform/` D) `~/.terraform/`

<details><summary>Answer</summary>**A) `.terraform/modules/`**</details>

### Q5: Should you version-pin modules from the registry?
A) No, always use latest B) Yes, use version constraints C) Only in production D) Not necessary

<details><summary>Answer</summary>**B) Yes, use version constraints** — same as providers, for reproducibility</details>

---

**Next**: [Module 12 →](../module-12-advanced-modules/theory.md)
