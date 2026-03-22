# Module 13 — Lab & Assignment & Quiz

## Lab: Deploy 3-Tier Architecture
Deploy a simplified 3-tier architecture on Free Tier: ALB → EC2 (ASG) → S3 (simulating database tier). Using S3 instead of RDS keeps costs at zero.

### Steps
1. Create VPC with public subnets across 2 AZs
2. Create ALB with target group and listener
3. Create launch template with user data (Apache)
4. Create ASG with min=1, max=2, desired=1
5. Verify ALB DNS shows the web page
6. Destroy all resources

> ⚠️ **Free Tier Note**: ALB has 750 hours/month free for the first 12 months. RDS is also free tier. Destroy promptly to avoid charges.

---

## Assignment
Extend the lab with proper RDS (db.t3.micro) in private subnets. Add cross-tier security group rules. Create separate modules for networking, compute, and database.

### Checklist
- [ ] VPC with public + private subnets
- [ ] ALB routing to ASG
- [ ] EC2 instances with user data
- [ ] Cross-tier security groups
- [ ] Outputs for ALB DNS endpoint
- [ ] All resources destroyed

---

## Quiz

### Q1: What type of load balancer works at Layer 7?
A) NLB B) CLB C) ALB D) GLB

<details><summary>Answer</summary>**C) ALB** (Application Load Balancer)</details>

### Q2: What does an ASG do when CPU > threshold?
A) Reboots instances B) Adds more instances C) Migrates instances D) Nothing

<details><summary>Answer</summary>**B) Adds more instances** (scales out)</details>

### Q3: Which instance class is RDS Free Tier?
A) db.t2.large B) db.t3.micro C) db.m5.large D) db.r5.xlarge

<details><summary>Answer</summary>**B) db.t3.micro**</details>

### Q4: What makes a subnet suitable for RDS?
A) Public IP B) DB subnet group with 2+ AZs C) Internet Gateway D) Route to NAT

<details><summary>Answer</summary>**B) DB subnet group** spanning at least 2 AZs</details>

### Q5: What does `skip_final_snapshot = true` do?
A) Skips backups B) Allows RDS deletion without a final snapshot C) Disables encryption D) Skips validation

<details><summary>Answer</summary>**B) Allows RDS deletion** without requiring a final snapshot</details>

---

**Next**: [Module 14 →](../module-14-security/theory.md)
