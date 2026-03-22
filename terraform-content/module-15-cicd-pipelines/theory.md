# Module 15 — Terraform in CI/CD Pipelines

## 🎯 Learning Objectives

- Automate Terraform with GitHub Actions and GitLab CI
- Implement plan-on-PR, apply-on-merge workflows
- Manage secrets and credentials in CI/CD
- Use saved plans for safe automated deployments

---

## 1. Why Automate Terraform?

```
Manual Workflow Problems:
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Developer A │     │  Developer B │     │  Developer C │
│  runs apply  │     │  runs apply  │     │  runs apply  │
│  locally     │     │  locally     │     │  locally     │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │
       └────────────────────┼────────────────────┘
                            ▼
                     ❌ State conflicts!
                     ❌ No audit trail!
                     ❌ Inconsistent!

Automated CI/CD:
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Developer A │     │  Developer B │     │  Developer C │
│  pushes PR   │     │  pushes PR   │     │  pushes PR   │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │
       └────────────────────┼────────────────────┘
                            ▼
                    ┌──────────────┐
                    │   CI/CD      │
                    │  Pipeline    │
                    │  (central)   │
                    └──────┬───────┘
                           │
                    ┌──────┴───────┐
                    │ Remote State │
                    │ + Locking    │
                    └──────────────┘
                    ✅ Consistent!
                    ✅ Audit trail!
                    ✅ Peer reviewed!
```

---

## 2. GitHub Actions Pipeline

```yaml
# .github/workflows/terraform.yml
name: 'Terraform'

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

permissions:
  contents: read
  pull-requests: write

env:
  TF_VERSION: '1.7.0'
  AWS_REGION: 'us-east-1'

jobs:
  terraform:
    name: 'Terraform'
    runs-on: ubuntu-latest

    steps:
    - name: Checkout
      uses: actions/checkout@v4

    - name: Setup Terraform
      uses: hashicorp/setup-terraform@v3
      with:
        terraform_version: ${{ env.TF_VERSION }}

    - name: Configure AWS Credentials
      uses: aws-actions/configure-aws-credentials@v4
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: ${{ env.AWS_REGION }}

    - name: Terraform Init
      run: terraform init

    - name: Terraform Format
      run: terraform fmt -check

    - name: Terraform Validate
      run: terraform validate

    - name: Terraform Plan
      id: plan
      run: terraform plan -no-color -out=tfplan
      continue-on-error: true

    - name: Comment PR with Plan
      if: github.event_name == 'pull_request'
      uses: actions/github-script@v7
      with:
        script: |
          const plan = `${{ steps.plan.outputs.stdout }}`;
          github.rest.issues.createComment({
            issue_number: context.issue.number,
            owner: context.repo.owner,
            repo: context.repo.repo,
            body: `### Terraform Plan\n\`\`\`\n${plan}\n\`\`\``
          });

    - name: Terraform Apply
      if: github.ref == 'refs/heads/main' && github.event_name == 'push'
      run: terraform apply tfplan
```

---

## 3. GitLab CI Pipeline

```yaml
# .gitlab-ci.yml
image:
  name: hashicorp/terraform:1.7
  entrypoint: [""]

variables:
  TF_ROOT: ${CI_PROJECT_DIR}

stages:
  - validate
  - plan
  - apply
  - destroy

validate:
  stage: validate
  script:
    - terraform init -backend=false
    - terraform fmt -check
    - terraform validate

plan:
  stage: plan
  script:
    - terraform init
    - terraform plan -out=plan.tfplan
  artifacts:
    paths:
      - plan.tfplan

apply:
  stage: apply
  script:
    - terraform init
    - terraform apply plan.tfplan
  dependencies:
    - plan
  when: manual
  only:
    - main
```

---

## 4. Secrets Management in CI/CD

```
Never hardcode credentials!

GitHub Actions:   Repository → Settings → Secrets → Actions
GitLab CI:        Settings → CI/CD → Variables (Protected + Masked)

Required secrets:
• AWS_ACCESS_KEY_ID
• AWS_SECRET_ACCESS_KEY
```

---

## 📝 Key Takeaways

1. Automate Terraform with **CI/CD** for consistency and audit trails
2. **Plan on PR** — let reviewers see infrastructure changes
3. **Apply on merge** — only apply after approval
4. Store credentials in **CI/CD secrets** — never in code
5. Use **saved plans** to ensure what's reviewed is what's applied

---

**Next**: [Lab →](lab.md)
