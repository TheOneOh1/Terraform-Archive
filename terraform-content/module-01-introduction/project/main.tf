# main.tf — Hello Terraform Project

terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# -------------------------------------------------------------------
# S3 Bucket
# -------------------------------------------------------------------
resource "aws_s3_bucket" "this" {
  bucket = "${var.project_name}-${var.environment}-${random_id.suffix.hex}"

  tags = {
    Name        = var.project_name
    Environment = var.environment
    ManagedBy   = "Terraform"
    Project     = "terraform-bootcamp-module-01"
  }
}

# Enable versioning
resource "aws_s3_bucket_versioning" "this" {
  bucket = aws_s3_bucket.this.id

  versioning_configuration {
    status = "Enabled"
  }
}

# Enable server-side encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "this" {
  bucket = aws_s3_bucket.this.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Block all public access
resource "aws_s3_bucket_public_access_block" "this" {
  bucket = aws_s3_bucket.this.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Random suffix for globally unique bucket name
resource "random_id" "suffix" {
  byte_length = 4
}
