# Module 17 — Advanced HCL & Meta-Arguments

## 🎯 Learning Objectives

- Master `count` and `for_each` for resource iteration
- Use `dynamic` blocks for nested configuration
- Understand `lifecycle` meta-arguments
- Know when (and when NOT) to use provisioners

---

## 1. count vs for_each

```
count vs for_each:
┌─────────────────────────┬────────────────────────────┐
│        count            │       for_each             │
├─────────────────────────┼────────────────────────────┤
│ Based on integer        │ Based on map or set        │
│ Resources indexed [0]   │ Resources keyed by name    │
│ Removing middle item    │ Removing an item doesn't   │
│ shifts all indices!     │ affect others              │
│                         │                            │
│ Good for: identical     │ Good for: similar but      │
│ resources               │ distinct resources         │
└─────────────────────────┴────────────────────────────┘
```

### count Example

```hcl
resource "aws_s3_bucket" "logs" {
  count  = 3
  bucket = "logs-${count.index}"
}
# Creates: logs-0, logs-1, logs-2
```

### for_each Example

```hcl
resource "aws_s3_bucket" "app" {
  for_each = toset(["frontend", "backend", "shared"])
  bucket   = "app-${each.key}-data"
  tags     = { Component = each.key }
}
# Creates named resources: app["frontend"], app["backend"], app["shared"]

# With a map
resource "aws_s3_bucket" "env" {
  for_each = {
    dev     = { versioning = true }
    staging = { versioning = true }
    prod    = { versioning = true }
  }
  bucket = "app-${each.key}"
  tags   = { Environment = each.key }
}
```

---

## 2. dynamic Blocks

```hcl
variable "ingress_rules" {
  default = [
    { port = 80,  cidr = "0.0.0.0/0", desc = "HTTP" },
    { port = 443, cidr = "0.0.0.0/0", desc = "HTTPS" },
    { port = 22,  cidr = "10.0.0.0/8", desc = "SSH" },
  ]
}

resource "aws_security_group" "web" {
  name   = "dynamic-sg"
  vpc_id = aws_vpc.main.id

  dynamic "ingress" {
    for_each = var.ingress_rules
    content {
      from_port   = ingress.value.port
      to_port     = ingress.value.port
      protocol    = "tcp"
      cidr_blocks = [ingress.value.cidr]
      description = ingress.value.desc
    }
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
```

---

## 3. lifecycle Meta-Argument

```hcl
resource "aws_instance" "web" {
  ami           = data.aws_ami.latest.id
  instance_type = "t2.micro"

  lifecycle {
    # Don't destroy this resource
    prevent_destroy = true

    # Ignore changes to these attributes
    ignore_changes = [ami, tags]

    # Create replacement before destroying old
    create_before_destroy = true
  }
}
```

---

## 4. Provisioners (Use Sparingly!)

```hcl
# local-exec — runs on YOUR machine
resource "null_resource" "notify" {
  provisioner "local-exec" {
    command = "echo 'Infrastructure deployed at ${timestamp()}'"
  }
}

# remote-exec — runs on the target resource (needs SSH)
resource "aws_instance" "web" {
  # ...

  provisioner "remote-exec" {
    inline = [
      "sudo yum update -y",
      "sudo yum install -y httpd",
    ]

    connection {
      type        = "ssh"
      user        = "ec2-user"
      private_key = tls_private_key.ssh.private_key_pem
      host        = self.public_ip
    }
  }
}
```

> ⚠️ **Best Practice**: Prefer `user_data` over `remote-exec`. Provisioners are a last resort.

---

## 📝 Key Takeaways

1. **`for_each`** is preferred over `count` for resources that differ
2. **`dynamic`** blocks reduce repetition for nested blocks
3. **`lifecycle`** controls resource behavior during updates
4. **Provisioners** are a last resort — use user_data or config management instead

---

**Next**: [Lab →](lab.md)
