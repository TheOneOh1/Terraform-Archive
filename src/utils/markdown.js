/**
 * Markdown Renderer — marked + highlight.js
 */
import { marked } from 'marked';
import hljs from 'highlight.js/lib/core';
import hcl from 'highlight.js/lib/languages/properties';
import bash from 'highlight.js/lib/languages/bash';
import json from 'highlight.js/lib/languages/json';
import yaml from 'highlight.js/lib/languages/yaml';
import plaintext from 'highlight.js/lib/languages/plaintext';

// Register languages
hljs.registerLanguage('hcl', hcl);
hljs.registerLanguage('terraform', hcl);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('shell', bash);
hljs.registerLanguage('json', json);
hljs.registerLanguage('yaml', yaml);
hljs.registerLanguage('plaintext', plaintext);

// Configure marked
marked.setOptions({
  gfm: true,
  breaks: false,
  highlight: function (code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value;
      } catch (e) { /* fallback */ }
    }
    // Try auto-detection for unlabeled blocks
    try {
      return hljs.highlightAuto(code).value;
    } catch (e) {
      return code;
    }
  },
});

/**
 * Render markdown string to HTML.
 */
export function renderMarkdown(md) {
  return marked.parse(md);
}

/**
 * Parse quiz markdown into structured question objects.
 * Expected format: ### Question N, followed by options (- A/B/C/D), then <details> with answer.
 */
export function parseQuiz(md) {
  const questions = [];
  // Split by ### Question
  const sections = md.split(/###\s*Question\s*\d+/i).slice(1);

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];

    // Extract question text (first line after the split)
    const lines = section.trim().split('\n');
    let questionText = '';
    const options = [];
    let answerText = '';
    let correctLetter = '';

    let inDetails = false;
    let detailsContent = [];

    for (const line of lines) {
      const trimmed = line.trim();

      if (trimmed.startsWith('<details>')) {
        inDetails = true;
        continue;
      }
      if (trimmed.startsWith('</details>')) {
        inDetails = false;
        continue;
      }
      if (trimmed.startsWith('<summary>') || trimmed.startsWith('</summary>')) {
        continue;
      }

      if (inDetails) {
        detailsContent.push(trimmed);
        continue;
      }

      // Parse options
      const optionMatch = trimmed.match(/^-\s*([A-D])\)\s*(.*)/);
      if (optionMatch) {
        options.push({
          letter: optionMatch[1],
          text: optionMatch[2],
        });
        continue;
      }

      // Skip horizontal rules
      if (trimmed === '---') continue;

      // Accumulate question text (before options)
      if (options.length === 0 && trimmed) {
        if (questionText) questionText += ' ';
        questionText += trimmed;
      }
    }

    // Parse answer from details
    const detailsText = detailsContent.join('\n');
    const correctMatch = detailsText.match(/\*\*([A-D])\)/);
    if (correctMatch) {
      correctLetter = correctMatch[1];
    }
    // Get explanation (everything after the bold answer line)
    const explanationLines = detailsContent.filter(l => !l.startsWith('**') || !l.includes(')'));
    answerText = explanationLines.join(' ').trim();

    if (questionText && options.length > 0) {
      questions.push({
        number: i + 1,
        text: questionText,
        options,
        correctLetter,
        explanation: answerText,
      });
    }
  }

  return questions;
}
