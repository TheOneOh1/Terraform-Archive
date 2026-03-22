# Module 01 — Assignment: IaC Research & First Deployment

## 🎯 Objectives

- Deepen your understanding of IaC tools through research
- Practice the Terraform workflow independently
- Create your first GitHub-ready Terraform project

**Estimated Time**: 45 minutes

---

## Part 1: Research (15 minutes)

Write short answers (2–3 sentences each) for the following questions. Create a file called `answers.md` in your working directory.

1. **What is configuration drift?** Give a real-world example from your on-prem experience.

2. **Why is Terraform considered "cloud-agnostic"?** What makes it different from AWS CloudFormation?

3. **What is the purpose of the Terraform state file?** What could go wrong if you lose it?

4. **Compare Terraform and Ansible.** When would you use each tool? Can they work together?

5. **What is "idempotency"?** How does Terraform achieve it?

---

## Part 2: Hands-On Challenge (30 minutes)

### Challenge: Deploy an S3 Bucket with Versioning

Create a Terraform configuration that:

1. Creates an S3 bucket with a unique name
2. Enables **versioning** on the bucket
3. Adds at least 4 tags:
   - `Name`
   - `Environment` = "dev"
   - `Project` = "terraform-bootcamp"
   - `Owner` = your name
4. Outputs the bucket name, ARN, and versioning status

### Requirements

- Use a separate `outputs.tf` file for outputs
- Use `terraform fmt` before committing
- Follow the project structure below

### Project Structure

```
assignment-01/
├── main.tf          # Provider and resource definitions
├── outputs.tf       # Output values
├── answers.md       # Research answers from Part 1
└── README.md        # Brief description of what this does
```

### Hints

- S3 versioning requires a separate resource: `aws_s3_bucket_versioning`
- Check the [Terraform AWS Provider docs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket_versioning)

### Validation

After running `terraform apply`:

```bash
# Verify versioning is enabled
aws s3api get-bucket-versioning --bucket YOUR_BUCKET_NAME
# Should show: {"Status": "Enabled"}

# Verify tags
aws s3api get-bucket-tagging --bucket YOUR_BUCKET_NAME
```

---

## 🏁 Submission Checklist

- [ ] `answers.md` with all 5 research questions answered
- [ ] Terraform configuration creates an S3 bucket with versioning
- [ ] At least 4 tags applied to the bucket
- [ ] Outputs defined in a separate `outputs.tf`
- [ ] Code formatted with `terraform fmt`
- [ ] Successfully ran `terraform apply` and `terraform destroy`
- [ ] `README.md` with project description

---

**Next**: [Quiz →](quiz.md)
