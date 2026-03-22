# Module 17 — Lab & Assignment & Quiz

## Lab: Refactor with Advanced HCL
Take a config with hardcoded repetitive resources and refactor it using `for_each`, `dynamic` blocks, and `lifecycle` rules.

### Steps
1. Start with 3 manually defined S3 buckets
2. Refactor using `for_each` with a map
3. Add a security group with `dynamic` ingress blocks
4. Add `lifecycle` rules (ignore_changes on tags)
5. Deploy and verify; destroy when done

---

## Assignment
Create a deployment that manages multiple environments (dev, staging, prod) using `for_each` with different configurations per environment. Use `dynamic` blocks for security group rules and `lifecycle` to prevent accidental deletion.

### Checklist
- [ ] `for_each` with map of environment configs
- [ ] `dynamic` blocks for SG rules
- [ ] `lifecycle` with prevent_destroy and ignore_changes
- [ ] All resources destroyed

---

## Quiz

### Q1: What's the main advantage of `for_each` over `count`?
A) Faster execution B) Resources keyed by name, not index C) Supports more resources D) Uses less state

<details><summary>Answer</summary>**B) Resources keyed by name** — removing items doesn't shift indices</details>

### Q2: What does a `dynamic` block replace?
A) Variables B) Repeated nested blocks C) Outputs D) Providers

<details><summary>Answer</summary>**B) Repeated nested blocks** (like multiple ingress rules)</details>

### Q3: What does `create_before_destroy = true` do?
A) Creates a backup B) Creates replacement before destroying old C) Prevents destruction D) Creates in parallel

<details><summary>Answer</summary>**B) Creates the new resource before destroying the old one**</details>

### Q4: Why should provisioners be avoided?
A) They're expensive B) They're not idempotent and break the declarative model C) They're deprecated D) They don't work

<details><summary>Answer</summary>**B) Not idempotent and break the declarative model**</details>

### Q5: How do you access the current key in `for_each`?
A) `each.index` B) `each.key` C) `self.key` D) `for_each.key`

<details><summary>Answer</summary>**B) `each.key`** (and `each.value` for the value)</details>

---

**Next**: [Module 18 →](../module-18-functions-expressions/theory.md)
