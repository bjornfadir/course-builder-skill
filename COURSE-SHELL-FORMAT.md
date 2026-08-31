# Course Shell Format

This is the layer on top of the base lesson/reference mechanics: it groups lessons into shippable **modules** and gives the learner one navigable entry point instead of a pile of loose HTML files. Validated on a real multi-module course before being written up here — don't skip straight to building five modules' worth of shell before module 1's pattern has actually been used.

## Layout

```
index.html                          # course root
modules/
  01-slug.html                      # module landing page: lessons + reference + final quiz
lessons/
  0001-slug.html
  0002-slug.html
reference/
  0001-slug.html
assets/
  style.css  quiz.js  feynman.js  generator.js
```

Module files are numbered `01`, `02`, ... by shipping order. Lesson/reference numbers stay flat and sequential across the whole course (see `SKILL.md`), not reset per module — a module's landing page just links the range of lesson numbers it covers.

## `index.html` (course root)

- A breadcrumb nav (`<nav class="breadcrumb" aria-label="Breadcrumb">`) linking back up to wherever this course sits (a parent portal, a person's page, whatever the hosting context is).
- A one-paragraph description of the course, linking `MISSION.md`'s rendered form for the full why.
- A `## Modules` list: one entry per module, each with a status (`available` / `planned` / `in progress`) and a one-line description — including modules not yet built. This makes the roadmap visible to the learner, not just to you.
- Links to the glossary and resources pages.

## `modules/NN-slug.html` (module landing page)

- Breadcrumb back to the course root.
- What this module covers and why it matters to the mission (1-2 sentences), with a citation to its primary source.
- `## Lessons` — links to every lesson in this module, each with a one-line description.
- `## Reference` — links to every reference doc this module produced.
- `## Module final quiz` — an interleaved quiz pulling from every lesson in the module (not just the last one), built via the generator registry: `Generators.forModule([ids])` → `Generators.practiceSet(skills, count)` → `initQuiz(...)`. This is the actual test of whether the module stuck as a whole, not lesson-by-lesson in isolation.
- A "more practice" panel wired to `initPracticePanel` for open-ended re-rollable drilling beyond the fixed quiz.
- A link back to the course root.

## Worked example

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Module 1 · Fractions &amp; Decimals</title>
<link rel="stylesheet" href="../assets/style.css">
</head>
<body>

<nav class="breadcrumb" aria-label="Breadcrumb">
  <a href="../index.html">Course</a><span class="sep">›</span>
  <span class="current">Module 1: Fractions &amp; Decimals</span>
</nav>

<h1>Module 1: Fractions &amp; Decimals</h1>
<p class="sidenote">Built from <a href="../sources/primary-source.pdf#page=1">the primary source</a>.</p>

<p>One or two sentences on why this module matters to the mission.</p>

<h2>Lessons</h2>
<ul class="lesson-list">
  <li>
    <a href="../lessons/0001-slug.html">Lesson 1 — Title</a>
    <div class="desc">One-line description.</div>
  </li>
</ul>

<h2>Reference</h2>
<ul class="lesson-list">
  <li><a href="../reference/0001-slug.html">Cheat Sheet Title</a></li>
</ul>

<hr class="divider">

<h2>Module final quiz</h2>
<p>Interleaved across every lesson in this module — work through the lessons first if you haven't.</p>
<div id="module-quiz"></div>

<h3>More practice</h3>
<div id="module-practice"></div>

<p class="footer-note">
  Questions about anything in this module? Ask your teacher directly.
  <br><br>
  <a href="../index.html">← Back to course</a>
</p>

<script src="../assets/quiz.js"></script>
<script src="../assets/generator.js"></script>
<script>
  const moduleSkills = Generators.forModule(['0001']);
  initQuiz(document.getElementById('module-quiz'), Generators.practiceSet(moduleSkills, 12));
  initPracticePanel(document.getElementById('module-practice'), moduleSkills, 8);
</script>

</body>
</html>
```

## Design notes, not prescriptions

The exact visual system (typography, color tokens, breakpoints, sidenote/margin-note treatment) should come from whatever design skill or convention this environment already has — don't copy a stylesheet wholesale from another course, since design specifics get reviewed and tuned per-course (see "Design review" in `SKILL.md`). What's load-bearing about the shell is the *information architecture* above: breadcrumb → root → module → lesson/reference, status visibility for unbuilt modules, and the interleaved final quiz — not any particular CSS.
