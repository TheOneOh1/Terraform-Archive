# outputs.tf — Output Values

output "bucket_name" {
  description = "The name of the S3 bucket"
  value       = aws_s3_bucket.this.bucket
}

output "bucket_arn" {
  description = "The ARN of the S3 bucket"
  value       = aws_s3_bucket.this.arn
}

output "bucket_region" {
  description = "The region of the S3 bucket"
  value       = aws_s3_bucket.this.region
}

output "versioning_status" {
  description = "The versioning status of the S3 bucket"
  value       = aws_s3_bucket_versioning.this.versioning_configuration[0].status
}
