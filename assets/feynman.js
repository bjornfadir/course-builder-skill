/**
 * Feynman Check: the mandatory "explain it back" gate at the end of every
 * lesson (see SKILL.md — Feynman Check). This is deliberately NOT
 * auto-graded: a free-text explanation can't be checked for correctness by
 * JS. All this does is give the learner a place to draft the explanation
 * and keep it (via localStorage, private to this browser) so it's there to
 * read out to their teacher next session — the actual evaluation, and any
 * gap this surfaces, happens in that conversation, not here.
 *
 * Subject-agnostic — drop in as-is, no edits needed.
 *
 * Usage: <div id="feynman-1"></div><script>initFeynman(document.getElementById('feynman-1'), 'course-0001-feynman');</script>
 * Pick a storageKey that's unique per course + lesson (e.g. `${courseSlug}-${lessonId}-feynman`)
 * so different courses sharing a browser don't collide.
 */
function initFeynman(container, storageKey) {
  container.innerHTML = `
    <span class="label">Feynman Check — explain it back</span>
    <p>Before moving on: explain this lesson's core idea out loud, in plain language, as if to someone who's never seen it — no jargon, no formulas or terms you can't unpack in words. If you catch yourself reaching for a term you can't explain, that's a gap — bring it to your teacher next session and we'll trace it back to the source.</p>
    <textarea aria-label="Explain this lesson's core idea in your own words" placeholder="Type your explanation here if you want to keep it — or just say it out loud and bring it to your next session."></textarea>
    <div class="saved-note">Saved locally in this browser.</div>
  `;
  const textarea = container.querySelector('textarea');
  const savedNote = container.querySelector('.saved-note');
  let saved = null;
  try { saved = localStorage.getItem(storageKey); } catch (e) { /* private browsing / storage blocked — fine, just skip persistence */ }
  if (saved) textarea.value = saved;

  let timer = null;
  textarea.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      try {
        localStorage.setItem(storageKey, textarea.value);
        savedNote.classList.add('visible');
      } catch (e) { /* storage unavailable — the explanation still exists in the textarea for this session */ }
    }, 500);
  });
}
