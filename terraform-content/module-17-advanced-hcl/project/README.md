# Project: advanced-hcl
Showcases `for_each`, `dynamic` blocks, `lifecycle` rules, and meta-arguments.

```hcl
# Create multiple S3 buckets with for_each
resource "aws_s3_bucket" "env" {
  for_each = var.environments
  bucket   = "app-${each.key}"
}
```
