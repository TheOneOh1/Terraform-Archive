# Module 06 — AWS Networking with Terraform

## 🎯 Learning Objectives

- Design and deploy a complete VPC from scratch
- Configure subnets, Internet Gateway, and route tables
- Implement Security Groups and NACLs
- Understand public vs private subnet patterns

---

## 1. VPC Architecture Overview

```
Production VPC Architecture:
┌─────────────────────────────────────────────────────────────────┐
│ VPC: 10.0.0.0/16                                               │
│                                                                 │
│   Availability Zone A          Availability Zone B              │
│   ┌─────────────────────┐     ┌─────────────────────┐         │
│   │ Public Subnet        │     │ Public Subnet        │         │
│   │ 10.0.1.0/24          │     │ 10.0.2.0/24          │         │
│   │ ┌─────────────────┐  │     │ ┌─────────────────┐  │         │
│   │ │   Web Server    │  │     │ │   Web Server    │  │         │
│   │ └─────────────────┘  │     │ └─────────────────┘  │         │
│   └──────────┬────────────┘     └──────────┬────────────┘       │
│              │                              │                    │
│   ┌──────────┴────────────┐     ┌──────────┴────────────┐       │
│   │ Private Subnet        │     │ Private Subnet        │       │
│   │ 10.0.3.0/24           │     │ 10.0.4.0/24           │       │
│   │ ┌─────────────────┐   │     │ ┌─────────────────┐   │       │
│   │ │   App Server    │   │     │ │   Database      │   │       │
│   │ └─────────────────┘   │     │ └─────────────────┘   │       │
│   └───────────────────────┘     └───────────────────────┘       │
│                                                                 │
│              ┌──────────────────┐                               │
│              │ Internet Gateway │───── Internet                  │
│              └──────────────────┘                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. VPC Components

### VPC

```hcl
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "main-vpc"
  }
}
```

### Subnets

```hcl
resource "aws_subnet" "public_a" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "us-east-1a"
  map_public_ip_on_launch = true

  tags = { Name = "public-subnet-a" }
}

resource "aws_subnet" "private_a" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.3.0/24"
  availability_zone = "us-east-1a"

  tags = { Name = "private-subnet-a" }
}
```

### Internet Gateway

```hcl
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id
  tags   = { Name = "main-igw" }
}
```

### Route Tables

```hcl
# Public route table — routes to IGW
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = { Name = "public-rt" }
}

resource "aws_route_table_association" "public_a" {
  subnet_id      = aws_subnet.public_a.id
  route_table_id = aws_route_table.public.id
}
```

### Security Groups

```hcl
resource "aws_security_group" "web" {
  name        = "web-sg"
  description = "Allow HTTP/HTTPS inbound"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "web-sg" }
}
```

---

## 3. Security Groups vs NACLs

```
┌──────────────────────┬───────────────────────┐
│   Security Groups    │        NACLs          │
├──────────────────────┼───────────────────────┤
│ Instance level       │ Subnet level          │
│ Allow rules only     │ Allow + Deny rules    │
│ Stateful             │ Stateless             │
│ All rules evaluated  │ Rules processed in    │
│                      │ order (by number)     │
│ Applied to ENI       │ Applied to subnet     │
└──────────────────────┴───────────────────────┘
```

---

## 📝 Key Takeaways

1. **VPCs** are the foundation of AWS networking
2. **Public subnets** have routes to an Internet Gateway
3. **Private subnets** have no direct internet access
4. **Security Groups** are stateful firewalls at the instance level
5. **Route tables** control traffic flow between subnets and the internet

---

**Next**: [Lab →](lab.md)
