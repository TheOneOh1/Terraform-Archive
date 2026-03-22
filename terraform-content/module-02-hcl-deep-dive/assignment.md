# Module 02 — Assignment: Multi-Variable Configuration

## 🎯 Objectives

Build a Terraform configuration that demonstrates mastery of HCL syntax by using every variable type and multiple expression techniques.

**Estimated Time**: 45 minutes

---

## Challenge: Build an Environment Configuration System

Create a Terraform project that manages S3 buckets with different configurations per environment.

### Requirements

1. **Variables**: Define at least 8 variables using different types:
   - `string`: region, project name
   - `number`: retention days
   - `bool`: enable logging
   - `list(string)`: tags list
   - `map(string)`: additional tags
   - `object({})`: bucket configuration (name prefix, versioning, encryption)
   - Use `validation` blocks on at least 2 variables

2. **Locals**: Create at least 5 local values:
   - Name prefix (combining project + env)
   - Merged tags
   - Conditional instance sizing
   - A formatted description string
   - A map transformation

3. **Data Sources**: Use at least 2:
   - `aws_caller_identity`
   - `aws_availability_zones`

4. **Outputs**: Create at least 6 outputs showing different value types

5. **Multiple tfvars files**: Create `dev.tfvars` and `staging.tfvars`

### Project Structure

```
assignment-02/
├── main.tf
├── variables.tf
├── outputs.tf
├── locals.tf
├── data.tf
├── dev.tfvars
├── staging.tfvars
└── README.md
```

---

## 🏁 Submission Checklist

- [ ] All 8+ variables defined with proper types and descriptions
- [ ] Validation blocks on at least 2 variables
- [ ] 5+ locals with computed values
- [ ] 2+ data sources
- [ ] 6+ outputs
- [ ] `dev.tfvars` and `staging.tfvars` with different values
- [ ] Code formatted with `terraform fmt`
- [ ] Runs successfully with both tfvars files
- [ ] Destroyed all resources after testing

---

**Next**: [Quiz →](quiz.md)
