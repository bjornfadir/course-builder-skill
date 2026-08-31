# course-builder

A Claude Code skill for building a source-grounded, multi-session learning course as a small navigable local site for one person on one topic.

Give it a mission (why someone's learning this, what success looks like), and it builds out mission-driven lessons grounded in real cited sources, groups them into modules with randomized practice generators and an interleaved final quiz, and ends every lesson with a mandatory "explain it back in plain language" gate — the actual signal that something was understood, not just covered. Before a module ships, it runs a structured design-review pass rather than a vibe check.

Fully self-contained — folds in the full teaching-workspace mechanics itself (mission → resources → lessons → reference → learning records → glossary), so nothing else needs to be installed first.

## Install

```bash
git clone https://github.com/bjornfadir/course-builder-skill.git
cd course-builder-skill
bash install.sh
```

This copies the skill into `~/.claude/skills/course-builder/`. Re-run `bash install.sh` after a `git pull` to pick up updates; `bash install.sh --uninstall` removes it.

## Use

Create (or `cd` into) a directory for the course — one directory per person per topic — and ask Claude Code to build a course there, e.g.:

> Use the course-builder skill to start a course on Spanish verb conjugation for me.

It's stateful: running it again in the same directory picks up exactly where the course left off (what's been taught, what's been demonstrated, what's next).

See `SKILL.md` for the full methodology, and the `*-FORMAT.md` files for the exact shape of each workspace document.

## What's in here

- `SKILL.md` — the methodology: workspace layout, sourcing discipline, the lesson/module/reference/learning-record pipeline, the Feynman explain-back gate, practice-generator rules, and the design-review checklist
- `MISSION-FORMAT.md`, `RESOURCES-FORMAT.md`, `LEARNING-RECORD-FORMAT.md`, `GLOSSARY-FORMAT.md` — templates and rules for each workspace document
- `COURSE-SHELL-FORMAT.md` — the course-root `index.html` + `modules/` navigation layer, with a worked example
- `assets/quiz.js`, `assets/feynman.js` — drop-in, subject-agnostic widgets a course's lessons load directly
- `assets/generator.js` — an annotated template for randomized practice generators (replace the two placeholder examples with the course's actual subject)

## Origin

Distilled from a real multi-module course built and design-reviewed end-to-end, generalizing the pattern for reuse on any subject/environment. Not tied to any specific vault, hosting setup, or family — those choices are left to whatever this is installed into.
