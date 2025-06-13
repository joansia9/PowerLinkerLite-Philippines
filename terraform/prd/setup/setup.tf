terraform {
  required_version = ">=1.4.5"

  backend "s3" {
    bucket         = "terraform-state-storage-646364352403"
    dynamodb_table = "terraform-state-lock-646364352403"
    key            = "powerlinkerlite/setup.tfstate" // Replace with the project name
    region         = "us-west-2"
  }
  required_providers {
    aws = {
      source = "hashicorp/aws"
    }
  }
}

provider "aws" {
  region = "us-west-2"
}

module "setup" {
  source = "../../modules/setup/"
  env    = "prd"
}