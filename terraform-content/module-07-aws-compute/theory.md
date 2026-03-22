# Module 07 — AWS Compute with Terraform

## 🎯 Learning Objectives

- Launch EC2 instances with Terraform
- Use AMI data sources and key pairs
- Configure user data scripts for auto-configuration
- Understand launch templates and Elastic IPs

---

## 1. EC2 Instance Architecture

```
EC2 Instance Setup:
┌─────────────────────────────────────────────────────────┐
│ VPC                                                     │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Public Subnet                                    │   │
│  │  ┌──────────────────────────────────────────┐    │   │
│  │  │ EC2 Instance (t2.micro)                  │    │   │
│  │  │  ┌──────────────┐                        │    │   │
│  │  │  │  Amazon      │  Key Pair: deployer    │    │   │
│  │  │  │  Linux 2023  │  SG: web-sg            │    │   │
│  │  │  │              │  User Data: install     │    │   │
│  │  │  │  httpd       │            httpd        │    │   │
│  │  │  └──────────────┘                        │    │   │
│  │  │  Public IP: (auto-assigned)              │    │   │
│  │  └──────────────────────────────────────────┘    │   │
│  └──────────────────────────────────────────────────┘   │
│            ▲                                            │
│            │ SSH (port 22) / HTTP (port 80)              │
│            │                                            │
│       ┌────┴────┐                                       │
│       │ Internet│                                       │
│       └─────────┘                                       │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Core EC2 Resources

### AMI Data Source

```hcl
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}
```

### Key Pair

```hcl
resource "tls_private_key" "ssh" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "deployer" {
  key_name   = "deployer-key"
  public_key = tls_private_key.ssh.public_key_openssh
}

# Save private key locally
resource "local_file" "private_key" {
  content         = tls_private_key.ssh.private_key_pem
  filename        = "${path.module}/deployer-key.pem"
  file_permission = "0400"
}
```

### EC2 Instance

```hcl
resource "aws_instance" "web" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = "t2.micro"
  key_name               = aws_key_pair.deployer.key_name
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.web.id]

  user_data = <<-EOF
    #!/bin/bash
    yum update -y
    yum install -y httpd
    systemctl start httpd
    systemctl enable httpd
    echo "<h1>Hello from Terraform!</h1>" > /var/www/html/index.html
    echo "<p>Instance: $(hostname)</p>" >> /var/www/html/index.html
  EOF

  tags = {
    Name = "web-server"
  }
}
```

### Elastic IP

```hcl
resource "aws_eip" "web" {
  instance = aws_instance.web.id
  domain   = "vpc"
  tags     = { Name = "web-eip" }
}
```

---

## 3. User Data Patterns

```hcl
# Inline
user_data = <<-EOF
  #!/bin/bash
  echo "inline script"
EOF

# From file
user_data = file("${path.module}/scripts/init.sh")

# Template with variables
user_data = templatefile("${path.module}/scripts/init.tpl", {
  environment = var.environment
  app_port    = var.app_port
})
```

---

## 4. Free Tier Reminder

| Resource | Free Tier |
|---|---|
| Instance Type | t2.micro (750 hrs/month) |
| Storage | 30 GB EBS |
| Data Transfer | 15 GB/month |

> ⚠️ Always destroy EC2 instances after labs!

---

## 📝 Key Takeaways

1. Use **data sources** for dynamic AMI lookups
2. **Key pairs** enable SSH access to instances
3. **User data** scripts run on first boot for auto-configuration
4. **Security groups** control network access to instances
5. Always use **t2.micro** to stay within Free Tier

---

**Next**: [Lab →](lab.md)
