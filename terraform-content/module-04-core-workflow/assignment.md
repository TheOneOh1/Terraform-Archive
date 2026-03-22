# Module 04 — Assignment: Resource Lifecycle Management

## 🎯 Objective

Practice the full Terraform lifecycle by managing multiple interrelated AWS resources.

**Estimated Time**: 30 minutes

---

## Challenge

1. Create 3 S3 buckets: `raw-data`, `processed-data`, and `archive`
2. Enable versioning on `raw-data` and `processed-data` only
3. Apply at least 5 tags to each bucket
4. Run `terraform apply` and verify all resources
5. **Modify**: Change tags on one bucket and observe the plan diff
6. **Destroy one**: Use `-target` to destroy only the `archive` bucket
7. **Rebuild**: Run `terraform apply` to recreate the `archive` bucket
8. **Full destroy**: Tear down everything

Document each step with the plan output (copy the Plan summary line).

---

## 🏁 Submission Checklist

- [ ] 3 S3 buckets created successfully
- [ ] Versioning enabled on 2 of 3 buckets
- [ ] Tags applied correctly
- [ ] Modification applied and diff observed
- [ ] Targeted destroy worked for single resource
- [ ] Full destroy completed
- [ ] All plan summaries documented

---

**Next**: [Quiz →](quiz.md)
