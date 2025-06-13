variable "env" {
  type        = string
  description = "The branch being deployed"
}

locals {
  name     = "PowerLinkerLite"
  app_name = "powerlinkerlite"

  domain = (var.env == "prd") ? "rll.byu.edu" : "rll-dev.byu.edu"
  url    = "${local.name}.${local.domain}"
}

resource "aws_ecr_repository" "ecrRepo" {
  name = "${local.app_name}-repo"

  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_s3_bucket" "private_bucket" {
  bucket = "${local.app_name}-${var.env}-bucket"
}

resource "aws_dynamodb_table" "dynamodbTable" {
  name         = local.app_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "url"

  attribute {
    name = "url"
    type = "S"
  }

  # match-index GSI

  global_secondary_index {
    name            = "match-index"
    hash_key        = "completedTime"
    range_key       = "isMatch"
    projection_type = "ALL"
  }

  attribute {
    name = "completedTime"
    type = "N"
  }

  attribute {
    name = "isMatch"
    type = "S"
  }

  # score-uploadTime-index GSI

  global_secondary_index {
    name            = "score-uploadTime-index"
    hash_key        = "score"
    range_key       = "uploadTime"
    projection_type = "ALL"
  }

  attribute {
    name = "score"
    type = "N"
  }

  attribute {
    name = "uploadTime"
    type = "N"
  }

  # score-exported-index GSI

  global_secondary_index {
    name            = "score-exported-index"
    hash_key        = "score"
    range_key       = "exported"
    projection_type = "ALL"
  }

  attribute {
    name = "score"
    type = "N"
  }

  attribute {
    name = "exported"
    type = "B"
  }
}
