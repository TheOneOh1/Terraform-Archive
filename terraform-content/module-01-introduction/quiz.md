# Module 01 — Quiz: IaC & Terraform Fundamentals

Test your understanding of Infrastructure as Code and Terraform basics.

---

### Question 1
What is the primary benefit of Infrastructure as Code (IaC)?

- A) It eliminates the need for cloud providers
- B) It allows infrastructure to be versioned, reviewed, and reproduced consistently
- C) It makes infrastructure free of charge
- D) It replaces the need for networking knowledge

<details>
<summary>Answer</summary>

**B) It allows infrastructure to be versioned, reviewed, and reproduced consistently**

IaC enables treating infrastructure like application code — with version control, peer review, automated testing, and consistent reproducibility.

</details>

---

### Question 2
Terraform uses which approach to infrastructure management?

- A) Imperative
- B) Procedural
- C) Declarative
- D) Object-oriented

<details>
<summary>Answer</summary>

**C) Declarative**

Terraform uses a declarative approach — you describe the desired end state, and Terraform determines the steps to achieve it.

</details>

---

### Question 3
Which component of Terraform communicates with cloud provider APIs?

- A) Terraform Core
- B) State file
- C) Providers
- D) Modules

<details>
<summary>Answer</summary>

**C) Providers**

Providers are plugins that allow Terraform to interact with specific cloud platforms and services through their APIs.

</details>

---

### Question 4
What does the `terraform init` command do?

- A) Creates cloud resources
- B) Destroys all resources
- C) Downloads providers and initializes the working directory
- D) Validates the configuration syntax

<details>
<summary>Answer</summary>

**C) Downloads providers and initializes the working directory**

`terraform init` downloads required provider plugins, initializes the backend, and prepares the `.terraform/` directory.

</details>

---

### Question 5
What file does Terraform use to track the current state of managed infrastructure?

- A) `main.tf`
- B) `terraform.tfstate`
- C) `.terraform.lock.hcl`
- D) `provider.tf`

<details>
<summary>Answer</summary>

**B) `terraform.tfstate`**

The state file is a JSON file that maps your Terraform configuration to the real-world resources it manages.

</details>

---

### Question 6
Which of the following is TRUE about Terraform?

- A) It can only manage AWS resources
- B) It uses an agent installed on target servers
- C) It supports multiple cloud providers simultaneously
- D) It requires a paid license for basic usage

<details>
<summary>Answer</summary>

**C) It supports multiple cloud providers simultaneously**

Terraform is cloud-agnostic and can manage resources across AWS, Azure, GCP, Kubernetes, and hundreds of other providers.

</details>

---

### Question 7
What happens when you run `terraform plan`?

- A) Resources are created immediately
- B) The state file is deleted
- C) An execution plan is generated showing proposed changes
- D) Provider plugins are downloaded

<details>
<summary>Answer</summary>

**C) An execution plan is generated showing proposed changes**

`terraform plan` compares the desired configuration to the current state and shows what changes would be made, without actually making them.

</details>

---

### Question 8
In the resource block `resource "aws_s3_bucket" "my_bucket" {}`, what is `"my_bucket"`?

- A) The name of the S3 bucket in AWS
- B) The Terraform resource type
- C) The local name used to reference this resource in Terraform
- D) The AWS region

<details>
<summary>Answer</summary>

**C) The local name used to reference this resource in Terraform**

The second label in a resource block is the local name. You use it to reference the resource elsewhere in your configuration (e.g., `aws_s3_bucket.my_bucket.arn`).

</details>

---

### Question 9
Which command removes all resources managed by Terraform?

- A) `terraform delete`
- B) `terraform remove`
- C) `terraform destroy`
- D) `terraform clean`

<details>
<summary>Answer</summary>

**C) `terraform destroy`**

`terraform destroy` removes all resources defined in your configuration and tracked in the state file.

</details>

---

### Question 10
Why should the `terraform.tfstate` file NOT be committed to Git?

- A) It's too large for Git
- B) It may contain sensitive information like passwords and access keys
- C) Git doesn't support JSON files
- D) Terraform regenerates it automatically

<details>
<summary>Answer</summary>

**B) It may contain sensitive information like passwords and access keys**

The state file can contain sensitive data such as database passwords, access keys, and private IPs. It should be stored securely using a remote backend, never in version control.

</details>

---

## 📊 Score Yourself

| Score | Rating |
|-------|--------|
| 9–10 | ⭐ Excellent — Ready to move on! |
| 7–8 | 👍 Good — Review the topics you missed |
| 5–6 | 📖 Fair — Re-read the theory before proceeding |
| < 5 | 🔄 Review — Go through the theory and lab again |

---

**Next**: [Project →](project/README.md)
