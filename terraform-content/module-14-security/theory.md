# Module 14 — Infrastructure Security

## 🎯 Learning Objectives

- Implement security group best practices
- Use encryption at rest and in transit
- Manage secrets with AWS SSM Parameter Store
- Run security scanning tools (Checkov, tfsec)

---

## 1. Security Architecture

```
Defense in Depth:
┌──────────────────────────────────────────────────────────────┐
│ Layer 1: Network (NACLs)                                     │
│  ┌──────────────────────────────────────────────────────┐    │
│  │ Layer 2: Security Groups                              │    │
│  │  ┌──────────────────────────────────────────────┐    │    │
│  │  │ Layer 3: Encryption (at rest + in transit)    │    │    │
│  │  │  ┌──────────────────────────────────────┐    │    │    │
│  │  │  │ Layer 4: IAM (least privilege)       │    │    │    │
│  │  │  │  ┌──────────────────────────────┐    │    │    │    │
│  │  │  │  │ Layer 5: Secrets Management  │    │    │    │    │
│  │  │  │  └──────────────────────────────┘    │    │    │    │
│  │  │  └──────────────────────────────────────┘    │    │    │
│  │  └──────────────────────────────────────────────┘    │    │
│  └──────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```

---

## 2. Security Group Best Practices

```hcl
# ❌ BAD — Too permissive
resource "aws_security_group" "bad" {
  ingress {
    from_port   = 0
    to_port     = 65535
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # All ports, all IPs
  }
}

# ✅ GOOD — Least privilege
resource "aws_security_group" "good" {
  ingress {
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]  # Only from ALB
    description     = "HTTP from ALB"
  }
}
```

---

## 3. Secrets Management with SSM

```hcl
# Store a secret
resource "aws_ssm_parameter" "db_password" {
  name  = "/app/prod/db_password"
  type  = "SecureString"
  value = var.db_password  # Passed via env var, never hardcoded
}

# Read a secret
data "aws_ssm_parameter" "db_password" {
  name            = "/app/prod/db_password"
  with_decryption = true
}

# Use in RDS
resource "aws_db_instance" "main" {
  password = data.aws_ssm_parameter.db_password.value
}
```

---

## 4. Security Scanning

```bash
# Install Checkov
pip install checkov

# Scan Terraform files
checkov -d .

# Install tfsec
brew install tfsec

# Scan
tfsec .
```

### Common Security Findings

| Finding | Fix |
|--|--|
| S3 bucket without encryption | Add `aws_s3_bucket_server_side_encryption_configuration` |
| SG with 0.0.0.0/0 SSH | Restrict to your IP or use SSM Session Manager |
| No access logging | Enable ALB/S3 access logging |
| Hardcoded secrets | Use SSM, Secrets Manager, or env vars |

---

## 📝 Key Takeaways

1. Apply **defense in depth** — multiple security layers
2. Use **least privilege** for security groups and IAM
3. **Encrypt everything** — at rest (S3, EBS, RDS) and in transit (TLS)
4. Store secrets in **SSM Parameter Store** or Secrets Manager
5. Run **security scanning** tools in CI/CD pipelines

---

**Next**: [Lab →](lab.md)
