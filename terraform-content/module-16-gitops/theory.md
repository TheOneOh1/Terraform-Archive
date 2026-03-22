# Module 16 — GitOps for Infrastructure

## 🎯 Learning Objectives

- Apply GitOps principles to infrastructure management
- Implement branch strategies for IaC
- Use PR-based Terraform workflows
- Understand Policy as Code concepts (Sentinel, OPA)
- Learn about Atlantis and HCP Terraform

---

## 1. GitOps Principles for Infrastructure

```
GitOps for IaC:
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  1. Git = Single Source of Truth                             │
│     All infrastructure defined in code, stored in Git        │
│                                                              │
│  2. Changes via Pull Requests                                │
│     No direct `terraform apply` — always through PRs        │
│                                                              │
│  3. Automated Apply                                          │
│     Merge triggers automated deployment                      │
│                                                              │
│  4. Observable State                                         │
│     State file tracks what's deployed                        │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 2. Branch Strategy for IaC

```
Recommended Branch Flow:
                   main (production)
                     │
              ┌──────┴──────┐
              │   staging    │ (pre-production validation)
              └──────┬──────┘
                     │
         ┌───────────┼───────────┐
         │           │           │
    feature/     feature/     bugfix/
    add-vpc     update-sg    fix-nacl
```

### Workflow

```
1. Create feature branch from main
2. Make Terraform changes
3. Push and create PR
4. CI runs: fmt → validate → plan
5. Plan output posted as PR comment
6. Team reviews the plan
7. Approval + merge
8. CD runs: apply on main branch
```

---

## 3. Policy as Code (Overview)

```hcl
# Sentinel Policy Example (HCP Terraform)
import "tfplan"

# Ensure all S3 buckets have encryption enabled
main = rule {
  all tfplan.resources.aws_s3_bucket as _, buckets {
    all buckets as _, bucket {
      bucket.applied.server_side_encryption_configuration is not empty
    }
  }
}
```

```rego
# OPA/Rego Policy Example
package terraform

deny[msg] {
  resource := input.resource_changes[_]
  resource.type == "aws_security_group"
  resource.change.after.ingress[_].cidr_blocks[_] == "0.0.0.0/0"
  resource.change.after.ingress[_].from_port == 22
  msg := "SSH must not be open to the world"
}
```

---

## 4. Atlantis (Open Source)

```
Atlantis Workflow:
┌──────────┐  PR Created   ┌────────────┐
│  GitHub  │──────────────▶│  Atlantis  │
│  /GitLab │               │  Server    │
└──────────┘               └─────┬──────┘
                                 │
                          terraform plan
                                 │
                          ┌──────┴──────┐
                          │ Post plan   │
                          │ as comment  │
                          └──────┬──────┘
                                 │
                           Comment:
                          "atlantis apply"
                                 │
                          terraform apply
```

---

## 📝 Key Takeaways

1. **Git is the single source of truth** for infrastructure
2. All changes go through **pull requests** with plan review
3. **Policy as Code** enforces compliance automatically
4. **Atlantis** is a popular open-source tool for PR-based Terraform
5. **HCP Terraform** provides managed GitOps with Sentinel policies

---

**Next**: [Lab →](lab.md)
