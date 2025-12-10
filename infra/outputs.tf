output "frontend_bucket_name" {
  value = aws_s3_bucket.frontend.bucket
}

output "cloudfront_domain" {
  value = aws_cloudfront_distribution.frontend.domain_name
}

output "cloudfront_distribution_id" {
  value = aws_cloudfront_distribution.frontend.id
}

output "products_table_name" {
  value = aws_dynamodb_table.products.name
}

output "orders_table_name" {
  value = aws_dynamodb_table.orders.name
}

output "checkout_lambda_arn" {
  value = aws_lambda_function.checkout.arn
}

output "api_base_url" {
  value = aws_apigatewayv2_api.http_api.api_endpoint
}



