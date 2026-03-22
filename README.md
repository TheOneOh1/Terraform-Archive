# Terraform: Archive

A comprehensive, gamified study portal for mastering Terraform through curated deep-theory archives, interactive labs, applied projects, and rigorous assessments.

## Features

- **Dynamic Content Engine**: Automatically builds routing and UI from Markdown files dropped into the `terraform-content` directory.
- **Global Search**: Instantly search across all modules, theory, and labs using `Cmd+K` powered by FlexSearch.
- **Gamification & Readiness Tracking**: Earn points for completing theory, labs, and quizzes to rank up from Novice to Architect.
- **Printable Certificates**: Automatically unlocks a dynamically generated Certificate of Completion once 80% readiness is achieved.
- **Modern Archivist Aesthetic**: A beautiful, responsive design system utilizing off-white parchment, blueprint dot-grid textures, and elegant typography.
- **Zero-Backend**: 100% Client-side architecture built with Vanilla JS and Vite.

## Requirements

- Node.js 18+

## Running Locally

To run the project on your own machine for development or personal study:

1. Clone the repository:
   ```bash
   git clone <repo_url>
   cd terra-site
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:5173` in your browser.

## Architecture & Flow Diagram

The application is a purely client-side Single Page Application (SPA). Content is managed via Markdown files, which are indexed at build-time and rendered into HTML at runtime.

```mermaid
flowchart TD
    %% Define Styles
    classDef file fill:#f4f4f4,stroke:#3b5660,stroke-width:1px,color:#3b5660
    classDef process fill:#eefaff,stroke:#47636c,stroke-width:2px,color:#47636c,font-weight:bold
    classDef storage fill:#e1f0db,stroke:#2d4a22,stroke-width:2px,color:#2d4a22

    A[/"terraform-content/ (Markdown files)"/]:::file -->|npm run build/dev| B("generate-manifest.js"):::process
    B -->|Generates| C[/"modules-manifest.json"/]:::file
    B -->|Generates| D[/"search-data.json"/]:::file

    sublayer1["Client Application (Vanilla JS Single Page App)"]
    C -->|Fetch| E("Module Router (main.js)"):::process
    D -->|Fetch| F("Global Search (FlexSearch)"):::process
    
    A -.->|Runtime Fetch| G("Markdown Renderer (marked + hljs)"):::process
    E --> G
    
    G --> H("UI Components (Dashboard, Module View)"):::process
    H -->|Saves Progress| I[("localStorage")]:::storage
    I -->|Calculates Points| J("Readiness Score Header"):::process
    end
```

## Adding Content

Content is managed entirely through the filesystem. Drop new module folders into the `terraform-content/` directory.

```
terraform-content/
├── module-01-introduction/
│   ├── theory.md          # Required: Core theory
│   ├── lab.md             # Optional: Hands-on lab
│   ├── assignment.md      # Optional: Assignment
│   ├── quiz.md            # Optional: MCQ quiz
│   └── project/
│       └── README.md      # Optional: Project guide
```

- Naming convention: `module-XX-topic-name`
- The manifest (`modules-manifest.json`) and search index (`search-data.json`) are automatically regenerated to reflect your new content during local development.

## Hosting It Yourself

This project is fully static and requires zero backend infrastructure, making it virtually free to host yourself.

### 1. GitHub Pages (Automated CI/CD via Actions)
This is the recommended approach if the repository lives on GitHub.

1. Fork or push this repository to your GitHub account.
2. In your GitHub repository, navigate to **Settings → Pages**.
3. Under the **"Build and deployment"** section, set the **Source** to **GitHub Actions**.
4. The included `.github/workflows/deploy.yml` workflow will automatically build the Vite project, run the manifest generation scripts, and publish the `dist` folder to your `.github.io` live site whenever you push to the `main` branch.

### 2. Vercel
Vercel offers an excellent out-of-the-box hosting experience.

1. Install the Vercel CLI locally or connect your GitHub repository in the Vercel web dashboard.
2. Because the repository includes a preconfigured `vercel.json` and a `build` script in `package.json`, Vercel will automatically publish the site flawlessly.

### 3. Traditional Web Hosts (Apache/Nginx/S3)
1. Run `npm run build` locally.
2. Vite and the pre-build scripts will compile everything into the `dist/` directory.
3. Upload the entire contents of the `dist/` directory to any static file bucket (like AWS S3) or traditional web server (like Apache or Nginx). No server-side scripting (PHP, Node, Python) is required!

## Project Structure

```
.
├── src/                  # Vanilla JS application and CSS
├── terraform-content/    # Markdown module files
├── scripts/              # Build-time manifest and search index generators
├── public/               # Static assets
└── vite.config.js        # Vite build configuration
```

## License

MIT
