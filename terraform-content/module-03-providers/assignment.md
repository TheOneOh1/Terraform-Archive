# Module 03 — Assignment: Multi-Provider Configuration

## 🎯 Objective

Build a Terraform configuration that uses multiple providers and demonstrates provider aliasing.

**Estimated Time**: 30 minutes

---

## Challenge

Create a project that:

1. Uses **3 providers**: `aws`, `random`, `tls`
2. Creates **2 S3 buckets** in different regions using provider aliases
3. Generates an SSH key pair using the `tls` provider
4. Creates an `aws_key_pair` resource using the generated public key
5. Uses `random_pet` for human-readable naming
6. Applies `default_tags` on all AWS resources
7. Outputs all resource details

### Bonus
- Add a `null_resource` with a `local-exec` provisioner that prints "Infrastructure deployed!" after apply

---

## 🏁 Submission Checklist

- [ ] 3 providers configured with version constraints
- [ ] Provider alias for a second AWS region
- [ ] SSH key pair generated with `tls_private_key`
- [ ] `aws_key_pair` created from the TLS public key
- [ ] `random_pet` used for naming
- [ ] `default_tags` applied via provider config
- [ ] All resources destroyed after testing

---

**Next**: [Quiz →](quiz.md)
