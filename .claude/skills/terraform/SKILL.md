---
name: Terraform
description: Infrastructure as code with Terraform/OpenTofu — state management, modules, workspaces, plan review, drift, secret handling, and CI pipelines. Use when provisioning or changing cloud infrastructure instead of clicking in a console.
triggers: [terraform, opentofu, infrastructure as code, iac, terraform state, terraform plan, terraform module, provision infrastructure, remote state, drift, tfstate]
version: "1.0"
source: community
---

# Terraform Skill

## § RULES
- Remote state with locking, always. Local state means two engineers can corrupt infrastructure simultaneously.
- Read the whole plan before applying. `terraform apply -auto-approve` outside CI is how production gets deleted.
- Pin provider and module versions. An unpinned provider changes your infrastructure on someone else's release schedule.
- Never put secrets in `.tf` files or variables with defaults — state stores them in plaintext.
- `destroy` is never run against production without a second pair of eyes.

---

## Layout

```
infra/
  modules/
    network/        reusable, no environment specifics
    service/
  envs/
    dev/main.tf     thin: wires modules, sets variables
    prod/main.tf
```

Environments are separate state files, not workspaces, once they differ meaningfully. Workspaces share a configuration — good for identical copies, bad once prod needs something dev does not.

---

## State

```hcl
terraform {
  required_version = "~> 1.9"
  backend "s3" {
    bucket         = "acme-tfstate"
    key            = "prod/service.tfstate"
    region         = "eu-west-1"
    dynamodb_table = "tf-locks"   # locking — do not omit
    encrypt        = true
  }
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.60" }
  }
}
```

State contains secrets in plaintext — encrypt the bucket, restrict access to it as tightly as the infrastructure it describes, and enable versioning so you can recover a corrupted state.

Keep blast radius small: one state file per environment per service. A monolithic state means a 40-minute plan and one mistake touching everything.

---

## Reading a plan

```
+ create     new resource
~ update     in place, safe
-/+ replace  DESTROY AND RECREATE  ← stop and read why
-  destroy   gone
```

`-/+` is where outages come from. A tag change forcing replacement of a database is a plan you reject, not one you approve faster.

```bash
terraform plan -out=tfplan
terraform show -json tfplan | jq '.resource_changes[] | select(.change.actions[0]=="delete")'
terraform apply tfplan      # apply the reviewed plan, not a fresh one
```

Applying a re-generated plan means you approved something you did not read.

---

## Modules

```hcl
module "api" {
  source  = "../../modules/service"
  version = "~> 2.1"        # required for registry modules

  name         = "api"
  environment  = "prod"
  instance_type = "t3.medium"
}
```

Write a module when the pattern repeats three times, not before. Modules have interfaces: variables with types, descriptions and validation; outputs for everything a caller needs.

```hcl
variable "environment" {
  type        = string
  description = "Deployment environment"
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "environment must be dev, staging or prod."
  }
}
```

---

## Secrets

Never:
```hcl
variable "db_password" { default = "hunter2" }   # in state, in git
```

Instead pull at apply time from a secret manager, or inject via `TF_VAR_` from the CI secret store, and mark outputs `sensitive = true`. Remember this only keeps it out of *logs* — state still holds it, which is why the state bucket is a secret store.

---

## CI pipeline

```
fmt -check  →  validate  →  tflint  →  tfsec/checkov  →  plan  →  [manual approval]  →  apply
```

Post the plan on the PR. Apply only from the default branch, with a pinned Terraform version and an OIDC-assumed role rather than long-lived keys.

---

## Drift

Someone will change something in the console. Detect it:

```bash
terraform plan -detailed-exitcode   # 0 no changes, 2 drift, 1 error
```

Run on a schedule and alert on exit code 2. Reconcile by importing the change or reverting it — never by quietly letting state diverge.

```bash
terraform import aws_s3_bucket.logs my-existing-bucket
```

---

## Caveats
- OpenTofu is a drop-in fork; most of this applies unchanged.
- `terraform destroy` has no undo. Production destroys go through the same review as any irreversible operation.
- Moving resources between modules needs `moved` blocks, or Terraform destroys and recreates them.
- Count vs for_each: `count` reindexes on removal and destroys unrelated resources. Prefer `for_each` with stable keys.
