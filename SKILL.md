---
name: course-builder
description: Build a source-grounded, multi-session learning course as a navigable local HTML site for one person on one topic — mission-driven lesson authoring, randomized practice generators, a mandatory Feynman explain-back gate, and a structured design-review pass before calling a module done. Use when someone wants to learn a subject over many sessions and have durable, revisitable course material, not a one-off answer.
argument-hint: "Who is this course for, and what subject?"
---

The user has asked to build (or continue building) a **course**: a stateful, multi-session teaching workspace for one person learning one subject. This is not a single explainer — it produces a small navigable site the learner returns to across many sessions.

This skill is self-contained. It folds in the full teaching-workspace mechanics (mission, resources, lessons, reference, learning records, glossary — originally the shape of the `teach` skill, github.com/mattpocock/skills) plus one additional layer validated on a real multi-module course: a course shell (`index.html` + `modules/`), randomized practice generators, a mandatory Feynman explain-back gate, and a structured design-review pass. Nothing here requires any other skill to be installed, though it'll use one if present — see "Design review" below.

## Workspace structure

Treat the current directory as the course workspace (one directory per person per topic — see Don'ts). It holds:

```
MISSION.md              # why this person is learning this — see MISSION-FORMAT.md
RESOURCES.md            # trusted sources this course draws from — see RESOURCES-FORMAT.md
NOTES.md                # scratchpad: learner preferences, working notes
GLOSSARY.md             # canonical terms, added only once explained back cleanly — see GLOSSARY-FORMAT.md
sources/                # raw source docs (PDFs etc.) that RESOURCES.md cites — gitignore this
learning-records/       # 0001-slug.md, ... — non-obvious insights, ADR-style — see LEARNING-RECORD-FORMAT.md
lessons/                # 0001-slug.html, ... — the primary teaching unit, one tightly-scoped thing each
reference/              # 0001-slug.html, ... — compressed cheat-sheets distilled from lessons
modules/                # 01-slug.html, ... — groups lessons into a shippable unit, see COURSE-SHELL-FORMAT.md
assets/                 # shared components: style.css, quiz.js, feynman.js, generator.js, ...
index.html              # course root: lists modules, links mission/resources/glossary
```

`lessons/`, `reference/`, and `learning-records/` use flat, sequentially-incrementing numbers (`0001`, `0002`, ...) scanned from the highest existing file, never reset per module.

## Philosophy

Deep learning needs three things, in this order of priority when `RESOURCES.md` is thin:

- **Knowledge** — from high-trust resources, never from parametric memory. Before `RESOURCES.md` is well-populated, finding good sources is the actual job.
- **Skills** — acquired through interactive lessons built from that knowledge, tuned to the learner's zone of proximal development (see below).
- **Wisdom** — from real interaction with other learners/practitioners. When a question needs wisdom, answer what you can, then point at a real community (forum, local group, class) — unless the learner has opted out, which gets recorded in `NOTES.md`.

**Fluency vs. storage strength.** Fluency (in-the-moment recall) feels like mastery but fades; storage strength (durable retention) is the real goal. Build it with desirable difficulty: retrieval practice (recall from memory, not recognition), spacing, and interleaving related-but-distinct skills in practice sets.

**Zone of proximal development.** Every lesson should feel challenging *just enough*. If the learner hasn't named an exact next topic, derive it from `learning-records/` (what's already solid) and `MISSION.md` (what it's all for) — teach the most mission-relevant thing that's neither trivial nor out of reach.

## Sourcing discipline

- Prefer primary, high-trust, ideally openly-licensed sources (peer-reviewed texts, official docs, recognized experts) over blog aggregation or your own parametric knowledge. Annotate every `RESOURCES.md` entry with what it covers and when to reach for it — a bare link is dead weight in three months.
- Before trusting any download URL (archive.org and similar), verify it actually resolves for you: `curl -sL -o /dev/null -w "%{http_code}"`. A file that looks freely downloadable can still be lending-restricted; if one identifier is blocked, look for an alternate identifier or an outside mirror of the same open-licensed text before giving up on that source.
- When ingesting a large source document (a PDF especially), don't spend context reading the raw file. Convert it (e.g. via a markdown-conversion tool) and verify structure/content with lightweight `grep`/`wc` checks — confirm chapter headers, page counts, expected sections exist — rather than reading the full text.
- Never commit raw source documents under `sources/` — gitignore that path. `RESOURCES.md` still cites them by relative path so the workspace stays self-describing without shipping copyrighted or personal material.

## Building the course

**1. Mission first.** If `MISSION.md` is missing or vague, interview the learner before writing anything — a bad mission steers every later decision wrong. See `MISSION-FORMAT.md`. Missions can change as the learner develops; update in place and log why in a learning record.

**2. Populate `RESOURCES.md`** from real sources before designing lessons. See `RESOURCES-FORMAT.md`.

**3. Sequence work in modules, not a flat lesson pile.** A module is a coherent chunk of the mission (e.g. one chapter's worth) containing 2-4 lessons plus that module's reference sheets and a final quiz. Validate the whole pattern — lessons, generator, quiz, review — on module 1 before mass-producing later modules; don't scale a pattern you haven't checked works.

**4. Author each lesson** as one self-contained HTML file in `lessons/`, titled `NNNN-dash-case-name.html`. Rules, non-negotiable:
   - Short and completable quickly — working memory is small; one tangible win per lesson, tied directly to the mission.
   - Beautiful, readable typography (think Tufte) — the learner revisits these later.
   - Cite a primary source for every claim, and recommend the single best resource to go deeper.
   - Link to related lessons and reference docs via anchors.
   - Every lesson ends with a reminder to bring questions to the learner's teacher (you), and with the Feynman Check (below) — no exceptions.
   - Build from `assets/` components already in the workspace before writing new inline code; a second lesson needing the same widget means that widget belongs in `assets/`, not copy-pasted.

**5. Distill reference docs** for anything worth quick lookup later: syntax/formulas, cheat sheets, glossaries, algorithms — whatever the subject calls for. Lessons are rarely revisited whole; reference docs are. Keep them short and dense.

**6. Build the module shell** (`modules/NN-slug.html` + entries in the course-root `index.html`) once a module's lessons exist. See `COURSE-SHELL-FORMAT.md` for the exact shape, including the interleaved module-final-quiz pattern.

**7. Wire practice generators.** For any subject with checkable, generate-able practice (math, syntax drills, translation, anything with a right answer), add generator functions to `assets/generator.js` feeding both per-lesson mini-quizzes and the module's interleaved final quiz. See the template in `assets/generator.js` and the rules below. Not every subject supports this (e.g. pure conceptual/qualitative learning) — skip it rather than forcing a generator onto ungradeable material.

**8. Write a learning record** whenever the learner demonstrates real understanding, discloses prior knowledge, has a misconception corrected, or the mission shifts. See `LEARNING-RECORD-FORMAT.md`. Coverage is not learning — wait for evidence.

**9. Promote terms to `GLOSSARY.md`** only once explained back cleanly (see Feynman Check) — never on first exposure. See `GLOSSARY-FORMAT.md`.

**10. Run the design review** (below) before calling a module done.

## Practice generators (`assets/generator.js`)

Every generator function returns `{ prompt, answers: [string, ...], hint?: string }` — the exact shape the quiz widget consumes. Non-negotiable rules, learned the hard way (see `assets/generator.js`'s template comments for the concrete bug this prevents):

- **Do all arithmetic/logic with integers or exact string manipulation — never floating-point division** for anything whose answer must match exactly. A float-rounded generator will eventually produce an answer the quiz can't verify against itself.
- **List every acceptable answer form**, not just the canonical one (e.g. an improper fraction and its equivalent mixed numeral are equally correct if the subject has that ambiguity). Getting this wrong makes the tool actively erode the confidence it exists to build — treat a false rejection of a correct answer as the single worst bug this system can have.
- Register each generator in a flat registry keyed by a stable skill id, tagged with the lesson id it belongs to. Expose `forLesson(id)`, `forModule([ids])`, `randomQuestion(skillIds)`, and `practiceSet(skillIds, count)` — this is what lets a module's final quiz interleave across every lesson it contains with one call.

## Feynman Check (mandatory, every lesson)

Every lesson ends with an explicit "explain it back in plain language, no jargon" prompt — this is the real signal that something is understood, not just covered. It is deliberately **not auto-graded**: free text can't be checked for correctness by a script. `assets/feynman.js` gives the learner a place to draft the explanation (saved to `localStorage`, private to their browser) so it's there to read out to their teacher — the actual evaluation happens in that conversation, in the moment or at the start of the next session. Any hedging, jargon-without-substance, or gap that surfaces there becomes a learning-record gap, cross-linked to the specific `RESOURCES.md` source that should close it.

## Design review

Before considering a module done — not just "the content is written," but "this is good to hand to the learner" — run a structured design critique, not a vibe check. If an interface/design-review skill is available in this environment (e.g. one that produces heuristic scores + a deterministic pattern scan), use it. Otherwise, walk the module manually against these, scoring roughly and fixing what's broken before shipping:

1. **Visibility of system status** — is quiz feedback, saved-progress, and "how far am I into this" always clear?
2. **Match with the real world** — does register, vocabulary, and worked examples fit this specific learner, not a generic template?
3. **User control and freedom** — can practice be freely re-rolled; is anything destructive without an undo?
4. **Consistency** — same visual language and, critically, same answer-matching strictness across every quiz in the module.
5. **Error prevention** — does the interface (not just the content) avoid creating false errors? (The concrete failure mode to check for: an answer-matcher that's stricter than the generator that produced the question — see the generator rules above.)
6. **Recognition over recall** — breadcrumbs, sidebar/module nav, and cheat-sheet links present so the learner isn't holding workspace structure in their head.
7. **Aesthetic and minimalism** — restrained, real whitespace, not decorative chrome.
8. **Error recovery** — does a wrong answer explain *why*, not just "incorrect"?
9. **Accessibility** — every quiz input has an associated label (`aria-labelledby` or `aria-label`); every generated diagram/image has a real, specific `aria-label`, not a placeholder; nav regions are semantic landmarks (`<nav aria-label="...">`), not bare `<div>`s.
10. **Help** — is "ask your teacher" framing present and is it clear that's a real, expected action, not a dead-end?

Triage findings P0 (breaks the core loop — e.g. false-rejects correct answers) / P1 (real gap, e.g. missing accessible names) / P2 (polish). Fix P0/P1 before telling the learner the module is ready; P2 can be logged and deferred.

## Don'ts

- Don't create a shared/global mission across topics — one workspace per person per topic. Two unrelated things to learn is two workspaces.
- Don't put one learner's material into another learner's workspace.
- Don't auto-grade the Feynman Check — it's a conversational gate by design.
- Don't promote a term to `GLOSSARY.md` on first exposure — only after it's been explained back cleanly.
- Don't scale the module/generator/review pattern to many modules before it's been validated end-to-end on one.
- Don't use floating-point division inside a generator whose answer must match an exact string.

## Supporting docs in this skill

- `MISSION-FORMAT.md` — template and rules for `MISSION.md`
- `RESOURCES-FORMAT.md` — template and rules for `RESOURCES.md`
- `LEARNING-RECORD-FORMAT.md` — template and rules for `learning-records/*.md`
- `GLOSSARY-FORMAT.md` — template and rules for `GLOSSARY.md`
- `COURSE-SHELL-FORMAT.md` — the `index.html` + `modules/` layer, with a working example
- `assets/quiz.js` — reusable retrieval-practice quiz widget, drop in as-is
- `assets/feynman.js` — reusable Feynman Check widget, drop in as-is
- `assets/generator.js` — annotated template with two example generators; replace the examples, keep the shape and rules
