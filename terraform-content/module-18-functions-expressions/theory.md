# Module 18 — Terraform Functions & Expressions

## 🎯 Learning Objectives

- Master commonly used Terraform built-in functions
- Use conditional expressions and complex types
- Apply `templatefile()` for dynamic configurations
- Combine functions for powerful transformations

---

## 1. Function Categories

```
Terraform Functions:
┌─────────────────────────────────────────────────┐
│  String:   format, join, split, replace, upper, │
│            lower, trimspace, substr, regex       │
│                                                 │
│  Collection: merge, lookup, flatten, zipmap,    │
│              keys, values, length, contains,    │
│              concat, distinct, sort             │
│                                                 │
│  Numeric:  min, max, ceil, floor, abs, parseint │
│                                                 │
│  Filesystem: file, templatefile, fileexists,    │
│              basename, dirname, pathexpand      │
│                                                 │
│  Date/Time: timestamp, formatdate, timeadd      │
│                                                 │
│  Encoding: base64encode, base64decode, jsonencode│
│            jsondecode, urlencode, yamlencode     │
│                                                 │
│  IP:       cidrhost, cidrsubnet, cidrnetmask    │
│                                                 │
│  Type:     can, try, tostring, tolist, tomap    │
└─────────────────────────────────────────────────┘
```

---

## 2. Most Used Functions

### String Functions

```hcl
# format — like printf
name = format("%s-%s-%03d", var.project, var.env, count.index + 1)
# Result: "myapp-prod-001"

# join — combine list to string
subnets_str = join(", ", var.subnet_ids)

# split — string to list
parts = split("-", "us-east-1")  # ["us", "east", "1"]

# replace
clean_name = replace(var.name, " ", "-")

# upper / lower
env_upper = upper(var.environment)  # "DEV" → "dev"
```

### Collection Functions

```hcl
# merge — combine maps
all_tags = merge(local.default_tags, var.extra_tags)

# lookup — safe map access with default
instance_type = lookup(var.instance_types, var.environment, "t2.micro")

# flatten — flatten nested lists
all_subnets = flatten([var.public_subnets, var.private_subnets])

# zipmap — create map from two lists
sg_map = zipmap(var.sg_names, aws_security_group.sgs[*].id)

# keys / values
env_names = keys(var.environments)  # ["dev", "staging", "prod"]
```

### Conditional Expressions

```hcl
# Ternary
instance_type = var.environment == "prod" ? "t3.large" : "t2.micro"

# Conditional resource count
count = var.create_bastion ? 1 : 0

# try — graceful fallback
name = try(var.custom_name, "default-name")

# can — test if expression is valid
is_valid_cidr = can(cidrhost(var.cidr, 0))
```

### Template Functions

```hcl
# templatefile — render a template with variables
user_data = templatefile("${path.module}/templates/init.tpl", {
  environment = var.environment
  app_port    = var.app_port
  db_host     = aws_db_instance.main.address
})
```

`templates/init.tpl`:
```bash
#!/bin/bash
export ENVIRONMENT="${environment}"
export APP_PORT="${app_port}"
export DB_HOST="${db_host}"
yum install -y httpd
systemctl start httpd
```

### CIDR Functions

```hcl
# cidrsubnet — calculate subnet CIDRs
# cidrsubnet(prefix, newbits, netnum)
subnet_a = cidrsubnet("10.0.0.0/16", 8, 1)   # "10.0.1.0/24"
subnet_b = cidrsubnet("10.0.0.0/16", 8, 2)   # "10.0.2.0/24"
subnet_c = cidrsubnet("10.0.0.0/16", 8, 3)   # "10.0.3.0/24"
```

---

## 3. for Expressions

```hcl
# Transform a list
upper_names = [for name in var.names : upper(name)]

# Filter a list
prod_instances = [for i in var.instances : i if i.env == "prod"]

# Create a map from a list
instance_map = { for i in var.instances : i.name => i.id }

# Nested for
all_pairs = flatten([
  for env in var.environments : [
    for svc in var.services : {
      name = "${env}-${svc}"
    }
  ]
])
```

---

## 📝 Key Takeaways

1. **Functions** are powerful tools for transforming data in HCL
2. `merge`, `lookup`, `flatten` are the most commonly used collection functions
3. `templatefile()` is essential for dynamic user data and configurations
4. `cidrsubnet()` calculates subnet CIDRs automatically
5. `for` expressions enable list/map transformations inline
6. Use `try()` and `can()` for safe error handling

---

**Next**: [Lab →](lab.md)
