# Module 18 — Lab & Assignment & Quiz

## Lab: Function Playground
Use `terraform console` to experiment with functions, then build a config that uses at least 10 different functions.

### Steps
1. Open `terraform console`
2. Test: `format()`, `join()`, `merge()`, `lookup()`, `cidrsubnet()`
3. Build a config using `templatefile()`, `for` expressions, `flatten()`
4. Create S3 buckets using computed names from functions

```bash
terraform console
> format("app-%s-%03d", "prod", 1)
> cidrsubnet("10.0.0.0/16", 8, 1)
> merge({"a" = 1}, {"b" = 2})
> join("-", ["hello", "world"])
```

---

## Assignment
Build infrastructure using `cidrsubnet()` to auto-calculate all subnet CIDRs from a single VPC CIDR. Use `for` expressions, `templatefile()`, and at least 8 different functions.

### Checklist
- [ ] `cidrsubnet()` for subnet CIDRs
- [ ] `templatefile()` for user data
- [ ] `for` expression for transformations
- [ ] 8+ different functions used
- [ ] Destroyed

---

## Quiz

### Q1: What does `merge(map1, map2)` do with duplicate keys?
A) Error B) Keeps map1 value C) Keeps map2 value D) Creates a list

<details><summary>Answer</summary>**C) Keeps map2 value** — later maps override earlier ones</details>

### Q2: What does `cidrsubnet("10.0.0.0/16", 8, 1)` return?
A) 10.0.0.0/24 B) 10.0.1.0/24 C) 10.1.0.0/24 D) 10.0.0.1/24

<details><summary>Answer</summary>**B) 10.0.1.0/24**</details>

### Q3: Which function reads a file and fills in variables?
A) `file()` B) `template()` C) `templatefile()` D) `render()`

<details><summary>Answer</summary>**C) `templatefile()`** — `file()` reads without variable substitution</details>

### Q4: What does `try(expr, default)` do?
A) Retries on failure B) Returns default if expr errors C) Throws exception D) Logs error

<details><summary>Answer</summary>**B) Returns default if the expression errors**</details>

### Q5: What does `[for s in list : upper(s)]` produce?
A) A map B) An uppercased list C) A set D) A tuple

<details><summary>Answer</summary>**B) An uppercased list** — `for` in `[]` produces a list</details>

---

**Next Phase**: [Module 19 →](../module-19-exam-review/theory.md)
