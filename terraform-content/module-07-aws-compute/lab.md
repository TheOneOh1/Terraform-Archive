# Module 07 — Lab: Deploy a Web Server on EC2

## 🎯 Lab Objectives
Deploy an EC2 instance running Apache HTTP in a custom VPC with SSH access.

**Estimated Time**: 45 minutes

---

## Step 1: Create the Project

```bash
mkdir -p ~/terraform-labs/module-07-ec2
cd ~/terraform-labs/module-07-ec2
```

---

## Step 2: Create main.tf

```hcl
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.0" }
    tls = { source = "hashicorp/tls", version = "~> 4.0" }
  }
}

provider "aws" { region = "us-east-1" }

data "aws_ami" "al2023" {
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

# VPC
resource "aws_vpc" "lab" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  tags                 = { Name = "ec2-lab-vpc" }
}

resource "aws_internet_gateway" "lab" {
  vpc_id = aws_vpc.lab.id
}

resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.lab.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
  availability_zone       = "us-east-1a"
  tags                    = { Name = "ec2-lab-public" }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.lab.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.lab.id
  }
}

resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

# Security Group
resource "aws_security_group" "web" {
  name   = "ec2-lab-web-sg"
  vpc_id = aws_vpc.lab.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "SSH"
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTP"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# SSH Key
resource "tls_private_key" "ssh" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "lab" {
  key_name   = "ec2-lab-key"
  public_key = tls_private_key.ssh.public_key_openssh
}

# EC2 Instance
resource "aws_instance" "web" {
  ami                    = data.aws_ami.al2023.id
  instance_type          = "t2.micro"
  key_name               = aws_key_pair.lab.key_name
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.web.id]

  user_data = <<-EOF
    #!/bin/bash
    yum update -y
    yum install -y httpd
    systemctl start httpd
    systemctl enable httpd
    cat > /var/www/html/index.html << 'HTML'
    <html>
    <head><title>Terraform Bootcamp</title></head>
    <body style="font-family: sans-serif; text-align: center; padding: 50px;">
      <h1>Hello from Terraform! 🚀</h1>
      <p>This server was provisioned automatically.</p>
    </body>
    </html>
    HTML
  EOF

  tags = { Name = "ec2-lab-web" }
}
```

---

## Step 3: Create outputs.tf

```hcl
output "public_ip" {
  value = aws_instance.web.public_ip
}

output "public_dns" {
  value = aws_instance.web.public_dns
}

output "ssh_command" {
  value = "ssh -i key.pem ec2-user@${aws_instance.web.public_ip}"
}

output "web_url" {
  value = "http://${aws_instance.web.public_ip}"
}

output "private_key" {
  value     = tls_private_key.ssh.private_key_pem
  sensitive = true
}
```

---

## Step 4: Deploy

```bash
terraform init
terraform plan
terraform apply -auto-approve

# Get the web URL
terraform output web_url
# Visit in browser — wait 1-2 minutes for user_data to finish

# Save private key for SSH
terraform output -raw private_key > key.pem
chmod 400 key.pem
```

---

## Step 5: Verify

```bash
# Test HTTP
curl $(terraform output -raw public_ip)

# SSH into instance
ssh -i key.pem ec2-user@$(terraform output -raw public_ip)
```

---

## Step 6: Clean Up

```bash
terraform destroy -auto-approve
rm -f key.pem
```

---

## ✅ Lab Checklist
- [ ] VPC with public subnet deployed
- [ ] EC2 instance running with Apache
- [ ] Web page accessible via public IP
- [ ] SSH access verified
- [ ] All resources destroyed

---

**Next**: [Assignment →](assignment.md)
