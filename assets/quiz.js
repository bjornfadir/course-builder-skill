/**
 * Reusable retrieval-practice quiz widget for course lessons and module
 * final quizzes. Subject-agnostic — drop in as-is, no edits needed.
 *
 * Usage in a lesson or module HTML file:
 *
 *   <div id="quiz-1" class="quiz"></div>
 *   <script src="../assets/quiz.js"></script>
 *   <script>
 *     initQuiz(document.getElementById('quiz-1'), [
 *       { prompt: 'Simplify 14/98.', answers: ['1/7'] },
 *       { prompt: 'Convert 5 3/7 to an improper fraction.', answers: ['38/7'] },
 *     ]);
 *   </script>
 *
 * Each question: { prompt: string (HTML ok), answers: string[] (accepted forms),
 *                   hint?: string }.
 * Answers are normalized (whitespace stripped, lowercased) before comparison,
 * so '3/4', ' 3 / 4 ', and '3/4 ' all match. Plain decimal/integer answers
 * (no '/', e.g. a generator's zero-padded "0.70") are additionally compared
 * numerically, so '0.7' correctly matches '0.70' — this is what prevents a
 * generator's exact-string answer from being falsely rejected by a stricter
 * comparison than the generator itself uses (see generator.js's own header
 * comment on the integer-exact-math rule this pairs with). Answers that
 * aren't plain numbers (fractions, mixed numerals, free text) stay
 * exact-string-only on purpose — the canonical form is the thing being
 * tested there.
 */
let quizIdCounter = 0;

function initQuiz(container, questions) {
  container.innerHTML = '';
  let solved = 0;
  const results = new Array(questions.length).fill(null);

  const summary = document.createElement('div');
  summary.className = 'quiz-summary';

  function normalize(s) {
    return String(s).replace(/\s+/g, '').toLowerCase();
  }

  function isPlainNumber(s) {
    return /^-?\d+(\.\d+)?$/.test(String(s).trim());
  }

  function answerMatches(userInput, accepted) {
    if (normalize(userInput) === normalize(accepted)) return true;
    if (isPlainNumber(userInput) && isPlainNumber(accepted)) {
      return Number(userInput) === Number(accepted);
    }
    return false;
  }

  function updateSummary() {
    const attempted = results.filter((r) => r !== null).length;
    if (attempted === 0) {
      summary.classList.remove('visible');
      return;
    }
    const correct = results.filter((r) => r === true).length;
    summary.textContent = `${correct} / ${attempted} correct so far (${questions.length} total).`;
    summary.classList.add('visible');
  }

  questions.forEach((q, i) => {
    const item = document.createElement('div');
    item.className = 'quiz-item';

    const promptId = `quiz-prompt-${++quizIdCounter}`;

    const prompt = document.createElement('div');
    prompt.className = 'quiz-prompt';
    prompt.id = promptId;
    prompt.innerHTML = `<span class="qnum">${i + 1}.</span>${q.prompt}`;
    item.appendChild(prompt);

    const row = document.createElement('div');
    row.className = 'quiz-row';

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'quiz-input';
    input.autocomplete = 'off';
    input.spellcheck = false;
    input.setAttribute('aria-labelledby', promptId);

    const checkBtn = document.createElement('button');
    checkBtn.type = 'button';
    checkBtn.className = 'quiz-check';
    checkBtn.textContent = 'Check';

    const feedback = document.createElement('span');
    feedback.className = 'quiz-feedback';

    const reveal = document.createElement('div');
    reveal.className = 'quiz-reveal';
    reveal.hidden = true;
    reveal.textContent = `Answer: ${q.answers[0]}${q.hint ? ' — ' + q.hint : ''}`;

    function check() {
      const ok = q.answers.some((a) => answerMatches(input.value, a));
      results[i] = ok;
      feedback.textContent = ok ? 'Correct' : 'Not quite';
      feedback.className = 'quiz-feedback ' + (ok ? 'correct' : 'incorrect');
      reveal.hidden = ok;
      updateSummary();
    }

    checkBtn.addEventListener('click', check);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); check(); }
    });

    row.appendChild(input);
    row.appendChild(checkBtn);
    row.appendChild(feedback);
    item.appendChild(row);
    item.appendChild(reveal);
    container.appendChild(item);
  });

  container.appendChild(summary);
}

/**
 * Wires a "generate more practice" button that pulls fresh randomized
 * questions from generator.js (Generators.practiceSet) and re-renders the
 * quiz each time it's clicked — for per-lesson or per-module drilling
 * beyond the fixed authored quiz above it. Requires assets/generator.js to
 * be loaded first.
 *
 * Usage: <div id="practice"></div><script>initPracticePanel(document.getElementById('practice'), Generators.forLesson('0001'), 8);</script>
 */
function initPracticePanel(container, skillIds, count) {
  container.classList.add('practice-panel');
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'quiz-check primary';
  button.textContent = 'Generate practice set';

  const quizHost = document.createElement('div');
  quizHost.className = 'quiz';

  function refresh() {
    initQuiz(quizHost, Generators.practiceSet(skillIds, count));
  }

  button.addEventListener('click', refresh);
  container.innerHTML = '';
  container.appendChild(button);
  container.appendChild(quizHost);
  refresh();
}
