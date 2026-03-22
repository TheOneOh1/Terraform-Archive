/**
 * Content Data Layer — Dynamic Module Registry & Content Loader
 * 
 * Modules are auto-discovered from modules-manifest.json,
 * generated at build time by scripts/generate-manifest.js.
 */

let _modules = [];
let _initialized = false;

export const SECTION_META = {
  theory: {
    label: 'Theory',
    icon: 'menu_book',
    file: 'theory.md',
  },
  lab: {
    label: 'Lab',
    icon: 'terminal',
    file: 'lab.md',
  },
  assignment: {
    label: 'Assignment',
    icon: 'assignment',
    file: 'assignment.md',
  },
  quiz: {
    label: 'Quiz',
    icon: 'fact_check',
    file: 'quiz.md',
  },
  project: {
    label: 'Project',
    icon: 'account_tree',
    file: 'project/README.md',
  },
};

/**
 * Initialize modules from the generated manifest.
 * Must be called before accessing MODULES.
 */
export async function initModules() {
  if (_initialized) return _modules;
  try {
    const res = await fetch('/modules-manifest.json');
    if (!res.ok) throw new Error('Manifest not found');
    const data = await res.json();
    _modules = data.modules || [];
    _initialized = true;
    console.log(`Loaded ${_modules.length} modules from manifest`);
  } catch (err) {
    console.error('Failed to load modules manifest:', err);
    _modules = [];
    _initialized = true;
  }
  return _modules;
}

/**
 * Get all modules (must call initModules first).
 */
export function getModules() {
  return _modules;
}

/**
 * Get module by ID.
 */
export function getModule(id) {
  return _modules.find(m => m.id === id);
}

/**
 * Check if a module has a specific section.
 */
export function hasSection(moduleId, section) {
  const mod = getModule(moduleId);
  return mod ? mod.sections.includes(section) : false;
}

/**
 * Get modules that have a specific section.
 */
export function getModulesWithSection(section) {
  return _modules.filter(m => m.sections.includes(section));
}

/**
 * Fetch markdown content for a module section.
 */
export async function fetchContent(moduleSlug, sectionFile) {
  const url = `/terraform-content/${moduleSlug}/${sectionFile}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ${url}`);
    return await response.text();
  } catch (err) {
    console.error(err);
    return null;
  }
}

/**
 * Simple progress tracker using localStorage.
 */
const PROGRESS_KEY = 'terraform-archive-progress';

export function getProgress() {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
  } catch {
    return {};
  }
}

export function markVisited(moduleId, section) {
  const progress = getProgress();
  if (!progress[moduleId]) progress[moduleId] = {};
  progress[moduleId][section] = true;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export function isVisited(moduleId, section) {
  const progress = getProgress();
  return !!(progress[moduleId] && progress[moduleId][section]);
}
