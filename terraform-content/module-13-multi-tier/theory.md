# Module 13 — Multi-Tier Architecture

## 🎯 Learning Objectives

- Design and deploy a 3-tier web application architecture
- Configure Application Load Balancer (ALB)
- Set up Auto Scaling Groups (ASG)
- Deploy RDS database instances
- Implement cross-tier security group rules

---

## 1. Three-Tier Architecture

```
Production 3-Tier Architecture:
┌──────────────────────────────────────────────────────────────────┐
│                         Internet                                 │
│                            │                                     │
│                    ┌───────┴───────┐                             │
│                    │     ALB       │  (Application Load Balancer) │
│                    │  Port 80/443  │                             │
│                    └───────┬───────┘                             │
│                            │                                     │
│              ┌─────────────┴─────────────┐                      │
│    ┌─────────┴──────────┐   ┌────────────┴─────────┐           │
│    │  Web Tier (ASG)    │   │  Web Tier (ASG)      │           │
│    │  Public Subnet AZ-a│   │  Public Subnet AZ-b  │           │
│    │  t2.micro          │   │  t2.micro             │           │
│    │  SG: allow ALB     │   │  SG: allow ALB        │           │
│    └─────────┬──────────┘   └────────────┬─────────┘           │
│              │                           │                      │
│              └─────────────┬─────────────┘                      │
│                            │                                     │
│    ┌───────────────────────┴───────────────────────┐            │
│    │              App Tier                         │            │
│    │  Private Subnet                               │            │
│    │  SG: allow from Web tier only                 │            │
│    └───────────────────────┬───────────────────────┘            │
│                            │                                     │
│    ┌───────────────────────┴───────────────────────┐            │
│    │            Database Tier (RDS)                 │            │
│    │  Private Subnet (Multi-AZ)                    │            │
│    │  SG: allow from App tier only (port 3306)     │            │
│    │  db.t3.micro (Free Tier)                      │            │
│    └───────────────────────────────────────────────┘            │
└──────────────────────────────────────────────────────────────────┘
```

---

## 2. Key Resources

### ALB

```hcl
resource "aws_lb" "web" {
  name               = "web-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = aws_subnet.public[*].id
}

resource "aws_lb_target_group" "web" {
  name     = "web-tg"
  port     = 80
  protocol = "HTTP"
  vpc_id   = aws_vpc.main.id

  health_check {
    path                = "/"
    healthy_threshold   = 2
    unhealthy_threshold = 10
  }
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.web.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.web.arn
  }
}
```

### Auto Scaling Group

```hcl
resource "aws_launch_template" "web" {
  name_prefix   = "web-"
  image_id      = data.aws_ami.al2023.id
  instance_type = "t2.micro"

  vpc_security_group_ids = [aws_security_group.web.id]

  user_data = base64encode(<<-EOF
    #!/bin/bash
    yum install -y httpd
    systemctl start httpd
    echo "<h1>Server: $(hostname)</h1>" > /var/www/html/index.html
  EOF
  )
}

resource "aws_autoscaling_group" "web" {
  desired_capacity    = 2
  max_size            = 4
  min_size            = 1
  target_group_arns   = [aws_lb_target_group.web.arn]
  vpc_zone_identifier = aws_subnet.public[*].id

  launch_template {
    id      = aws_launch_template.web.id
    version = "$Latest"
  }
}
```

### RDS

```hcl
resource "aws_db_instance" "main" {
  identifier           = "app-db"
  engine               = "mysql"
  engine_version       = "8.0"
  instance_class       = "db.t3.micro"  # Free Tier
  allocated_storage    = 20
  db_name              = "appdb"
  username             = var.db_username
  password             = var.db_password
  skip_final_snapshot  = true
  db_subnet_group_name = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.db.id]
}

resource "aws_db_subnet_group" "main" {
  name       = "app-db-subnet"
  subnet_ids = aws_subnet.private[*].id
}
```

---

## 3. Security Group Rules

```
Cross-Tier Security:
ALB SG ──(80/443 from 0.0.0.0/0)──▶ Web SG ──(80 from ALB SG)──▶ App SG ──(8080 from Web SG)──▶ DB SG ──(3306 from App SG)
```

---

## 📝 Key Takeaways

1. **ALB** distributes traffic across web tier instances
2. **ASG** auto-scales based on demand
3. **RDS** in private subnets for database isolation
4. **Layered security groups** restrict traffic between tiers
5. Use **Free Tier** instance types (t2.micro, db.t3.micro)

---

**Next**: [Lab →](lab.md)
