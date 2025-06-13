variable "env" {
  type        = string
  description = "The branch being deployed"
}

locals {
  name     = "PowerLinkerLite" # Replace with the project name
  app_name = "powerlinkerlite" # Replace with the project name

  domain = (var.env == "prd") ? "rll.byu.edu" : "rll-dev.byu.edu"
  url    = lower("${local.name}.${local.domain}")
  apiUrl = "api.${local.url}"
}

module "acs" {
  source = "github.com/byu-oit/terraform-aws-acs-info?ref=v4.0.0"
}

# ========== S3 Static Site ==========
data "aws_route53_zone" "domainZone" {
  name = local.domain
}

module "s3_site" {
  source         = "github.com/byu-oit/terraform-aws-s3staticsite?ref=v7.0.2"
  site_url       = local.url
  hosted_zone_id = data.aws_route53_zone.domainZone.id
  s3_bucket_name = "${local.app_name}-${var.env}"
}

# ========== API ==========

module "lambda-api" {
  source = "./modules/lambda-api/"

  project_name  = local.name
  app_name      = local.app_name
  domain        = local.domain
  url           = local.url
  api_url       = local.apiUrl
  ecr_repo_name = "${local.app_name}-repo"

  lambda_function_definitions = [
    {
      path_part   = "hint"
      http_method = "GET"
      command     = ["main.handle_getHint"]
      timeout     = 15
    },
    {
      path_part   = "set-match"
      http_method = "PUT"
      command     = ["main.handle_setMatch"]
      timeout     = 15
    },
    {
      path_part   = "upload-hints"
      http_method = "POST"
      command     = ["main.handle_uploadHints"]
      timeout     = 900
    },
    {
      path_part   = "results"
      http_method = "GET"
      command     = ["main.handle_getResults"]
    }
  ]
  function_policies = [
    aws_iam_policy.dynamoPolicy.arn,
    aws_iam_policy.s3Policy.arn,

  ]
}

# ========== IAM Policies ==========
data "aws_dynamodb_table" "dynamodbTable" {
  name = local.app_name
}

resource "aws_iam_policy" "dynamoPolicy" {
  name        = "${local.name}-dynamo"
  path        = "/"
  description = "Access to dynamo table"

  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        Effect : "Allow",
        Action : [
          "dynamodb:BatchGet*",
          "dynamodb:DescribeStream",
          "dynamodb:DescribeTable",
          "dynamodb:Get*",
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:BatchWrite*",
          "dynamodb:Update*",
          "dynamodb:PutItem",
          "dynamodb:DeleteItem"
        ],
        Resource : [
          "${data.aws_dynamodb_table.dynamodbTable.arn}",
          "${data.aws_dynamodb_table.dynamodbTable.arn}/index/*"
        ]
      }
    ]
  })
}

data "aws_s3_bucket" "s3Bucket" {
  bucket = "${local.app_name}-${var.env}-bucket"
}

resource "aws_iam_policy" "s3Policy" {
  name        = "${local.name}-s3"
  path        = "/"
  description = "Access to s3 bucket"

  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        Effect : "Allow",
        Action : [
          "s3:GetObject",
          "s3:DeleteObject",
          "s3:PutObject",
          "s3:ListBucket",
        ],
        Resource : [
          "${data.aws_s3_bucket.s3Bucket.arn}",
          "${data.aws_s3_bucket.s3Bucket.arn}/*",
        ]
      }
    ]
  })
}



