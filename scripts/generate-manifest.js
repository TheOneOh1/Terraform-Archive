/**
 * Generate Modules Manifest
 * 
 * Scans terraform-content/ directory and generates public/modules-manifest.json
 * with metadata about each module and its available sections.
 * 
 * Run: node scripts/generate-manifest.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'terraform-content');
const OUTPUT_FILE = path.join(ROOT, 'public', 'modules-manifest.json');
const SEARCH_DATA_FILE = path.join(ROOT, 'public', 'search-data.json');

// Section file mapping
const SECTION_FILES = {
  theory: 'theory.md',
  lab: 'lab.md',
  assignment: 'assignment.md',
  quiz: 'quiz.md',
  project: path.join('project', 'README.md'),
};

// Difficulty heuristics by module number
function estimateDifficulty(num) {
  const n = parseInt(num, 10);
  if (n <= 5) return 'Beginner';
  if (n <= 12) return 'Intermediate';
  return 'Advanced';
}

// Estimate time based on available sections
function estimateTime(sections) {
  const base = 30; // minutes per section
  const total = sections.length * base;
  if (total <= 60) return '1 hour';
  return `${Math.round(total / 60)} hours`;
}

// Convert slug like "introduction" or "hcl-deep-dive" to title
function slugToTitle(slug) {
  return slug
    .split('-')
    .map(word => {
      // Keep common acronyms uppercase
      const upper = word.toUpperCase();
      if (['HCL', 'IaC', 'IAC', 'AWS', 'GCP', 'CI', 'CD', 'VPC', 'IAM', 'DNS', 'CDN', 'API', 'CLI'].includes(upper)) {
        return upper;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

// Extract first paragraph from theory.md as description
function extractDescription(modulePath) {
  const theoryPath = path.join(modulePath, 'theory.md');
  if (!fs.existsSync(theoryPath)) {
    return 'Explore this module to learn more.';
  }

  const content = fs.readFileSync(theoryPath, 'utf-8');
  const lines = content.split('\n');

  // Look for learning objectives or first paragraph
  let collecting = false;
  let desc = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip headers and empty lines until we find content
    if (trimmed.startsWith('#')) {
      if (collecting && desc.length > 0) break;
      collecting = true;
      continue;
    }

    if (trimmed.startsWith('---')) {
      if (desc.length > 0) break;
      continue;
    }

    if (trimmed.startsWith('- ') && collecting) {
      // Collect bullet points from learning objectives
      desc.push(trimmed.replace(/^-\s*/, '').replace(/\*\*/g, ''));
      continue;
    }

    if (trimmed && collecting && !trimmed.startsWith('```') && !trimmed.startsWith('|')) {
      desc.push(trimmed);
      if (desc.length >= 2) break;
    }
  }

  if (desc.length === 0) return 'Explore this module to learn more.';

  // Join and truncate
  const full = desc.join('. ').replace(/\.\./g, '.').replace(/\s+/g, ' ');
  return full.length > 200 ? full.slice(0, 197) + '...' : full;
}

function main() {
  // Ensure public/ directory exists
  const publicDir = path.join(ROOT, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Check content directory exists
  if (!fs.existsSync(CONTENT_DIR)) {
    console.error(`Content directory not found: ${CONTENT_DIR}`);
    process.exit(1);
  }

  // Scan for module directories
  const entries = fs.readdirSync(CONTENT_DIR, { withFileTypes: true });
  const moduleDirs = entries
    .filter(e => e.isDirectory() && /^module-\d{2}/.test(e.name))
    .sort((a, b) => a.name.localeCompare(b.name));

  console.log(`Found ${moduleDirs.length} module directories`);
  const searchData = [];

  const modules = moduleDirs.map(dir => {
    const modulePath = path.join(CONTENT_DIR, dir.name);
    const match = dir.name.match(/^module-(\d{2})-(.+)$/);

    if (!match) {
      console.warn(`  Skipping ${dir.name}: doesn't match module-XX-name pattern`);
      return null;
    }

    const id = match[1];
    const topicSlug = match[2];
    const title = slugToTitle(topicSlug);

    // Detect available sections and index them for search
    const sections = [];
    for (const [key, file] of Object.entries(SECTION_FILES)) {
      const filePath = path.join(modulePath, file);
      if (fs.existsSync(filePath)) {
        sections.push(key);
        
        // Add to search index
        const content = fs.readFileSync(filePath, 'utf-8');
        // Strip markdown artifacts for cleaner search snippets
        const plainText = content.replace(/[#*`>\[\]\(\)-_]/g, ' ').replace(/\s+/g, ' ').trim();
        
        searchData.push({
          id: `${id}-${key}`,
          title: `${title} — ${key.charAt(0).toUpperCase() + key.slice(1)}`,
          content: plainText,
          url: `#/module/${id}/${key}`
        });
      }
    }

    const description = extractDescription(modulePath);
    const difficulty = estimateDifficulty(id);
    const estimatedTime = estimateTime(sections);

    const mod = {
      id,
      slug: dir.name,
      title,
      description,
      estimatedTime,
      difficulty,
      sections,
    };

    console.log(`  Module ${id}: "${title}" [${sections.join(', ')}]`);
    return mod;
  }).filter(Boolean);

  // Write manifest
  const manifest = { modules, generatedAt: new Date().toISOString() };
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2));
  console.log(`\nManifest written to ${OUTPUT_FILE} (${modules.length} modules)`);

  // Write search data
  fs.writeFileSync(SEARCH_DATA_FILE, JSON.stringify(searchData, null, 2));
  console.log(`Search data written to ${SEARCH_DATA_FILE} (${searchData.length} indexed documents)`);
}

main();
