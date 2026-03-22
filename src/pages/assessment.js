/**
 * Assessment / Quiz Page
 */
import { renderNavbar, initNavbar } from '../components/navbar.js';
import { renderFooter } from '../components/footer.js';
import { getModulesWithSection, getModule, SECTION_META, fetchContent } from '../utils/content.js';
import { parseQuiz } from '../utils/markdown.js';

export function renderAssessments() {
  const app = document.getElementById('app');
  // Only show modules that have a quiz section
  const quizModules = getModulesWithSection('quiz');

  const quizCards = quizModules.map(mod => `
    <article class="quiz-card" onclick="window.location.hash='/quiz/${mod.id}'" id="quiz-card-${mod.id}">
      <div class="quiz-card__header">
        <span class="quiz-card__module">Module ${mod.id}</span>
        <span class="quiz-card__count">
          <span class="material-symbols-outlined">help_outline</span>
          Quiz
        </span>
      </div>
      <h3 class="quiz-card__title">${mod.title}</h3>
      <p class="quiz-card__description">${mod.description}</p>
      <div class="quiz-card__footer">
        <span class="chip chip-primary">Quiz</span>
        <span class="btn btn-tertiary">
          Start Quiz
          <span class="material-symbols-outlined" style="font-size: 16px;">arrow_forward</span>
        </span>
      </div>
    </article>
  `).join('');

  const emptyState = quizModules.length === 0 ? `
    <div style="text-align: center; padding: var(--space-16) 0; grid-column: 1 / -1;">
      <span class="material-symbols-outlined" style="font-size: 48px; color: var(--outline-variant); margin-bottom: var(--space-4); display: block;">quiz</span>
      <h2 style="margin-bottom: var(--space-3);">No Quizzes Available Yet</h2>
      <p style="color: var(--on-surface-variant);">Quizzes will appear here as modules with quiz content are added.</p>
    </div>
  ` : '';

  app.innerHTML = `
    ${renderNavbar('#/assessments')}
    <main class="assessment page-enter">
      <div class="assessment__inner">
        <header class="assessment__header">
          <p class="assessment__label">Assessment Center</p>
          <h1 class="assessment__title">Validated Proficiency.</h1>
          <p class="assessment__subtitle">
            Test your understanding with rigorous quizzes designed to mirror the Terraform Associate certification. 
            Each assessment maps to a curriculum module.
          </p>
        </header>
        <div class="quiz-grid">
          ${quizCards}
          ${emptyState}
        </div>
      </div>
      ${renderFooter()}
    </main>
  `;

  initNavbar();
}

/**
 * Active Quiz Page
 */
export async function renderQuiz(params) {
  const app = document.getElementById('app');
  const moduleId = params.moduleId;
  const mod = getModule(moduleId);

  if (!mod || !mod.sections.includes('quiz')) {
    app.innerHTML = `
      ${renderNavbar('#/assessments')}
      <main class="assessment page-enter">
        <div class="assessment__inner" style="text-align: center; padding: var(--space-16) 0;">
          <span class="material-symbols-outlined" style="font-size: 48px; color: var(--outline-variant); margin-bottom: var(--space-4); display: block;">block</span>
          <h1>Quiz Not Available</h1>
          <p style="color: var(--on-surface-variant); margin-top: var(--space-3);">This module does not have a quiz section.</p>
          <a href="#/assessments" class="btn btn-primary" style="margin-top: var(--space-6);">Back to Assessments</a>
        </div>
      </main>
    `;
    return;
  }

  // Show loading
  app.innerHTML = `
    ${renderNavbar('#/assessments')}
    <main class="assessment page-enter">
      <div class="assessment__inner quiz-active">
        <div style="display: flex; align-items: center; gap: var(--space-3); color: var(--on-surface-variant); padding: var(--space-16) 0; justify-content: center;">
          <span class="material-symbols-outlined" style="animation: spin 1s linear infinite;">progress_activity</span>
          Loading quiz…
        </div>
      </div>
    </main>
  `;

  initNavbar();

  // Fetch quiz content
  const content = await fetchContent(mod.slug, SECTION_META.quiz.file);
  if (!content) {
    document.querySelector('.quiz-active').innerHTML = `
      <div style="text-align: center; padding: var(--space-12) 0;">
        <h2>Could not load quiz</h2>
        <p style="color: var(--on-surface-variant);">The quiz content file could not be fetched.</p>
        <a href="#/assessments" class="btn btn-primary" style="margin-top: var(--space-6);">Back to Assessments</a>
      </div>
    `;
    return;
  }

  const questions = parseQuiz(content);

  if (questions.length === 0) {
    document.querySelector('.quiz-active').innerHTML = `
      <div style="text-align: center; padding: var(--space-12) 0;">
        <h2>No Questions Found</h2>
        <p style="color: var(--on-surface-variant);">The quiz file exists but no questions could be parsed from it.</p>
        <a href="#/assessments" class="btn btn-primary" style="margin-top: var(--space-6);">Back to Assessments</a>
      </div>
    `;
    return;
  }

  // Quiz state
  let currentQuestion = 0;
  let answers = {};
  let revealed = {};

  function renderQuizUI() {
    const q = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    const selectedAnswer = answers[currentQuestion];
    const isRevealed = revealed[currentQuestion];

    const optionsHtml = q.options.map(opt => {
      let cls = 'option';
      if (selectedAnswer === opt.letter) cls += ' selected';
      if (isRevealed && opt.letter === q.correctLetter) cls += ' correct';
      if (isRevealed && selectedAnswer === opt.letter && opt.letter !== q.correctLetter) cls += ' incorrect';

      return `
        <div class="${cls}" data-letter="${opt.letter}" id="option-${opt.letter}">
          <span class="option__radio"></span>
          <span class="option__text"><strong>${opt.letter})</strong> ${opt.text}</span>
        </div>
      `;
    }).join('');

    const answerRevealHtml = isRevealed ? `
      <div class="answer-reveal">
        <p class="answer-reveal__label">Correct Answer: ${q.correctLetter}</p>
        <p class="answer-reveal__text">${q.explanation || 'Review the theory module for a deeper understanding.'}</p>
      </div>
    ` : '';

    document.querySelector('.quiz-active').innerHTML = `
      <header class="quiz-active__header">
        <a href="#/assessments" class="btn btn-tertiary" style="margin-bottom: var(--space-4);" id="quiz-back">
          <span class="material-symbols-outlined" style="font-size: 16px;">arrow_back</span>
          Back to Assessments
        </a>
        <h2 style="margin-bottom: var(--space-4);">Module ${mod.id}: ${mod.title}</h2>
        <div class="quiz-active__progress">
          <div class="quiz-active__progress-bar">
            <div class="quiz-active__progress-fill" style="width: ${progress}%"></div>
          </div>
          <span class="quiz-active__progress-text">${currentQuestion + 1} / ${questions.length}</span>
        </div>
      </header>

      <div class="question-card">
        <p class="question-card__number">Question ${q.number}</p>
        <p class="question-card__text">${q.text}</p>
        <div class="question-card__options" id="quiz-options">
          ${optionsHtml}
        </div>
        ${answerRevealHtml}
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: var(--space-5);">
          <button class="btn btn-secondary" id="btn-reveal" ${isRevealed || !selectedAnswer ? 'disabled' : ''} style="${isRevealed ? 'opacity: 0.5;' : ''}">
            <span class="material-symbols-outlined" style="font-size: 16px;">visibility</span>
            Reveal Answer
          </button>
          <div style="display: flex; gap: var(--space-3);">
            ${currentQuestion > 0 ? '<button class="btn btn-secondary" id="btn-prev"><span class="material-symbols-outlined" style="font-size: 16px;">arrow_back</span> Previous</button>' : ''}
            ${currentQuestion < questions.length - 1 ?
              '<button class="btn btn-primary" id="btn-next">Next <span class="material-symbols-outlined" style="font-size: 16px;">arrow_forward</span></button>' :
              '<button class="btn btn-primary" id="btn-finish"><span class="material-symbols-outlined" style="font-size: 16px;">flag</span> Finish Quiz</button>'
            }
          </div>
        </div>
      </div>
    `;

    // Event listeners
    document.querySelectorAll('#quiz-options .option').forEach(el => {
      el.addEventListener('click', () => {
        if (revealed[currentQuestion]) return;
        answers[currentQuestion] = el.dataset.letter;
        renderQuizUI();
      });
    });

    const revealBtn = document.getElementById('btn-reveal');
    if (revealBtn) {
      revealBtn.addEventListener('click', () => {
        revealed[currentQuestion] = true;
        renderQuizUI();
      });
    }

    const prevBtn = document.getElementById('btn-prev');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        currentQuestion--;
        renderQuizUI();
      });
    }

    const nextBtn = document.getElementById('btn-next');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentQuestion++;
        renderQuizUI();
      });
    }

    const finishBtn = document.getElementById('btn-finish');
    if (finishBtn) {
      finishBtn.addEventListener('click', showScore);
    }
  }

  function showScore() {
    let correct = 0;
    for (let i = 0; i < questions.length; i++) {
      if (answers[i] === questions[i].correctLetter) correct++;
    }
    const pct = Math.round((correct / questions.length) * 100);

    let message = '';
    if (pct >= 90) message = '⭐ Excellent — Ready to move on!';
    else if (pct >= 70) message = '👍 Good — Review the topics you missed.';
    else if (pct >= 50) message = '📖 Fair — Re-read the theory before proceeding.';
    else message = '🔄 Review — Go through the theory and lab again.';

    document.querySelector('.quiz-active').innerHTML = `
      <div class="quiz-score">
        <p class="quiz-score__value">${correct}/${questions.length}</p>
        <p class="quiz-score__label">Score: ${pct}%</p>
        <p class="quiz-score__message">${message}</p>
        <div style="display: flex; gap: var(--space-4); justify-content: center; flex-wrap: wrap;">
          <button class="btn btn-secondary" onclick="window.location.hash='/quiz/${mod.id}'" id="btn-retake">
            <span class="material-symbols-outlined" style="font-size: 16px;">replay</span>
            Retake Quiz
          </button>
          <a href="#/module/${mod.id}/theory" class="btn btn-tertiary" id="btn-review">
            <span class="material-symbols-outlined" style="font-size: 16px;">menu_book</span>
            Review Theory
          </a>
          <a href="#/assessments" class="btn btn-primary" id="btn-back-assess">
            <span class="material-symbols-outlined" style="font-size: 16px;">arrow_forward</span>
            All Assessments
          </a>
        </div>
      </div>
    `;
  }

  renderQuizUI();
}
