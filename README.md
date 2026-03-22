# Terraform: Archive

> *The Modern Archivist Study Portal* — A comprehensive Terraform learning platform with interactive labs, quizzes, and project showcases.

## 🏗️ Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## 📁 Adding Content

Drop module folders into `terraform-content/`:

```
terraform-content/
├── module-01-introduction/
│   ├── theory.md          # Required: Core theory
│   ├── lab.md             # Optional: Hands-on lab
│   ├── assignment.md      # Optional: Assignment
│   ├── quiz.md            # Optional: MCQ quiz
│   └── project/
│       └── README.md      # Optional: Project guide
├── module-02-hcl-deep-dive/
└── module-XX-topic-name/
```

**Naming convention:** `module-XX-topic-name` (e.g., `module-03-providers-resources`)

- Module titles are auto-generated from the folder name
- Missing sections are handled gracefully — only available tabs are shown
- The manifest is regenerated automatically on `dev` and `build`

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

Or connect the GitHub repo in the Vercel dashboard. The `vercel.json` is already configured.

### GitHub Pages

Push to GitHub with the `main` branch. The included GitHub Actions workflow (`.github/workflows/deploy.yml`) will:
1. Install dependencies
2. Generate the module manifest
3. Build with Vite
4. Deploy to GitHub Pages

Enable **GitHub Pages** in repo Settings → Pages → Source: **GitHub Actions**.

## 🛠️ Tech Stack

- **Vite** — Dev server & build
- **Vanilla JS** — No framework
- **marked** — Markdown → HTML
- **highlight.js** — Syntax highlighting
- **CSS Custom Properties** — Design system tokens

## 📐 Design System

Based on the **"Modern Archivist"** aesthetic:
- **Space Grotesk** (headlines) + **Newsreader** (body) + **JetBrains Mono** (code)
- Off-white parchment background with blueprint dot-grid texture
- Teal primary, terracotta accent, sage green tertiary
