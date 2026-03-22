# Module 06 — Assignment & Quiz

## Assignment: Production VPC Design
Extend the lab VPC with: a NAT Gateway for private subnets (or document why you'd add one), NACLs for the private subnets, and additional security groups for app and database tiers. Add output for all resource IDs.

### Checklist
- [ ] VPC with 2 public + 2 private subnets
- [ ] Security groups for web, app, and database tiers
- [ ] NACLs on private subnets
- [ ] All outputs defined
- [ ] Resources destroyed

---

## Quiz

### Q1: What makes a subnet "public"?
A) Having a tag B) route to IGW + public IPs C) Being first D) Having a NACL

<details><summary>Answer</summary>**B)** A route to an Internet Gateway and `map_public_ip_on_launch = true`</details>

### Q2: Security Groups are:
A) Stateless B) Subnet level C) Stateful D) Region level

<details><summary>Answer</summary>**C) Stateful** — return traffic is automatically allowed</details>

### Q3: What resource connects a VPC to the internet?
A) NAT Gateway B) VPN Gateway C) Internet Gateway D) Transit Gateway

<details><summary>Answer</summary>**C) Internet Gateway**</details>

### Q4: `count.index` in Terraform starts at:
A) 1 B) 0 C) -1 D) Depends on config

<details><summary>Answer</summary>**B) 0**</details>

### Q5: What does `aws_subnet.public[*].id` return?
A) First subnet ID B) Last subnet ID C) A list of all subnet IDs D) An error

<details><summary>Answer</summary>**C) A list of all subnet IDs** — the `[*]` is the splat expression</details>

---

**Next**: [Project →](project/README.md)
