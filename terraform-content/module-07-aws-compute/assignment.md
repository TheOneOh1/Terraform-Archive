# Module 07 — Assignment & Quiz

## Assignment
Deploy two EC2 instances (web + app) in the same VPC using different security groups. The web instance should accept HTTP from the internet, and the app instance should only accept traffic from the web instance's security group. Use `templatefile()` for user data.

### Checklist
- [ ] 2 EC2 instances with different SGs
- [ ] Web SG allowing HTTP from internet
- [ ] App SG allowing traffic only from web SG
- [ ] `templatefile()` for user data
- [ ] Outputs for both IPs
- [ ] Destroyed

---

## Quiz

### Q1: What instance type is Free Tier eligible?
A) t3.small  B) t2.micro  C) t2.small  D) t3.medium

<details><summary>Answer</summary>**B) t2.micro** (also t3.micro in some regions)</details>

### Q2: When does user_data run?
A) Every boot  B) Only on first launch  C) On every apply  D) Manual trigger

<details><summary>Answer</summary>**B) Only on first launch** (by default)</details>

### Q3: What happens if user_data changes in the config?
A) Script re-runs  B) Instance is replaced  C) Nothing  D) Error

<details><summary>Answer</summary>**B) Instance is replaced** — user_data is a ForceNew attribute</details>

### Q4: Which resource provides a static public IP?
A) aws_ip  B) aws_eip  C) aws_static_ip  D) aws_public_ip

<details><summary>Answer</summary>**B) aws_eip** (Elastic IP)</details>

### Q5: Which function reads a template file with variables?
A) `file()` B) `template()` C) `templatefile()` D) `render()`

<details><summary>Answer</summary>**C) `templatefile()`**</details>

---

**Next Module**: [Module 08 →](../module-08-aws-storage-iam/theory.md)
