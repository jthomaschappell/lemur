# root terraform configuration
terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# connect to aws 
provider "aws" {
  region = var.aws_region
}

# build bucket
resource "aws_s3_bucket" "frontend" {
  bucket = var.frontend_bucket_name
}

resource "aws_s3_bucket_public_access_block" "frontend" {
  bucket                  = aws_s3_bucket.frontend.id
  block_public_acls       = true
  block_public_policy     = false
  ignore_public_acls      = true
  restrict_public_buckets = false
}

resource "aws_cloudfront_origin_access_identity" "oai" {}

resource "aws_s3_bucket_policy" "frontend" {
  bucket = aws_s3_bucket.frontend.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          AWS = aws_cloudfront_origin_access_identity.oai.iam_arn
        }
        Action   = ["s3:GetObject"]
        Resource = "${aws_s3_bucket.frontend.arn}/*"
      }
    ]
  })
}

resource "aws_cloudfront_distribution" "frontend" {
  enabled             = true
  default_root_object = "index.html"

  origin {
    domain_name = aws_s3_bucket.frontend.bucket_regional_domain_name
    origin_id   = "s3-frontend"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.oai.cloudfront_access_identity_path
    }
  }

  default_cache_behavior {
    target_origin_id       = "s3-frontend"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}

# aws ddb tables 
resource "aws_dynamodb_table" "products" {
  name         = "products"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "productId"

  attribute {
    name = "productId"
    type = "S"
  }
}

resource "aws_dynamodb_table" "orders" {
  name         = "orders"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "orderId"

  attribute {
    name = "orderId"
    type = "S"
  }
}

# aws lambda

# lambda iam role 
resource "aws_iam_role" "checkout_lambda_role" {
  name = "checkout-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })
}

# lambda iam role policy
resource "aws_iam_role_policy" "checkout_policy" {
  name = "checkout-lambda-policy"
  role = aws_iam_role.checkout_lambda_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      # Read products
      {
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:Scan",
          "dynamodb:Query"
        ]
        Resource = aws_dynamodb_table.products.arn
      },

      # Write orders
      {
        Effect = "Allow"
        Action = [
          "dynamodb:PutItem"
        ]
        Resource = aws_dynamodb_table.orders.arn
      },

      # CloudWatch logs
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "*"
      }
    ]
  })
}

# the resource itself 
resource "aws_lambda_function" "checkout" {
  function_name = "checkout"
  handler       = "app.handler"
  runtime       = "python3.12"
  role          = aws_iam_role.checkout_lambda_role.arn

  filename         = "${path.module}/checkout.zip"
  source_code_hash = filebase64sha256("${path.module}/checkout.zip")

  environment {
    variables = {
      ORDERS_TABLE   = aws_dynamodb_table.orders.name
      PRODUCTS_TABLE = aws_dynamodb_table.products.name
    }
  }
}

# Ask-Order Lambda IAM Role
resource "aws_iam_role" "ask_lambda_role" {
  name = "ask-order-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = "sts:AssumeRole"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy" "ask_policy" {
  name = "ask-order-lambda-policy"
  role = aws_iam_role.ask_lambda_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      # Read orders from DynamoDB  (CHANGE WAS MADE HERE)
      {
        Effect   = "Allow"
        Action   = ["dynamodb:GetItem", "dynamodb:Query", "dynamodb:Scan"]
        Resource = aws_dynamodb_table.orders.arn
      },
      # lambda can invoke bedrock model
      {
        Effect = "Allow"
        Action = [
          "bedrock:InvokeModel",
          "bedrock:InvokeModelWithResponseStream"
        ]
        Resource = "*"
      },
      # CloudWatch logs  (required)
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "*"
      }
    ]
  })
}

resource "aws_lambda_function" "ask_order" {
  function_name = "ask-order"
  handler       = "app.handler"
  runtime       = "python3.12"
  role          = aws_iam_role.ask_lambda_role.arn

  filename         = "${path.module}/ask_order.zip"
  source_code_hash = filebase64sha256("${path.module}/ask_order.zip")

  environment {
    variables = {
      ORDERS_TABLE = aws_dynamodb_table.orders.name
    }
  }
}

# API GATEWAY to both lambdas
resource "aws_apigatewayv2_api" "http_api" {
  name          = "orders-api"
  protocol_type = "HTTP"
  
  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["POST", "OPTIONS"]
    allow_headers = ["content-type"]
    max_age       = 300
  }
}

# Checkout integration
resource "aws_apigatewayv2_integration" "checkout" {
  api_id                 = aws_apigatewayv2_api.http_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.checkout.invoke_arn
  payload_format_version = "2.0"
}

# Ask-order integration
resource "aws_apigatewayv2_integration" "ask_order" {
  api_id                 = aws_apigatewayv2_api.http_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.ask_order.invoke_arn
  payload_format_version = "2.0"
}

# the routes to the lambdas in the api gateway
resource "aws_apigatewayv2_route" "checkout" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "POST /checkout"
  target    = "integrations/${aws_apigatewayv2_integration.checkout.id}"
}

resource "aws_apigatewayv2_route" "ask_order" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "POST /ask-order"
  target    = "integrations/${aws_apigatewayv2_integration.ask_order.id}"
}

# stage... I guess? 
resource "aws_apigatewayv2_stage" "prod" {
  api_id      = aws_apigatewayv2_api.http_api.id
  name        = "$default"
  auto_deploy = true
}

resource "aws_lambda_permission" "apigw_checkout" {
  statement_id  = "AllowAPIGatewayInvokeCheckout"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.checkout.arn
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http_api.execution_arn}/*/*"
}

resource "aws_lambda_permission" "apigw_ask_order" {
  statement_id  = "AllowAPIGatewayInvokeAskOrder"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.ask_order.arn
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http_api.execution_arn}/*/*"
}

