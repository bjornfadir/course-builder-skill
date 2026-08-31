# Learning Record Format

Learning records live in `learning-records/` and use sequential numbering: `0001-slug.md`, `0002-slug.md`, etc., scanned from the highest existing file and incremented — never reset per module. Create the directory lazily, only when the first record is written.

They are the teaching equivalent of architectural decision records: they capture non-obvious lessons, key insights, and stated prior knowledge that steer future sessions, and are used to calculate the zone of proximal development.

## Template

```md
# {Short title of what was learned or established}

{1-3 sentences: what was learned (or what prior knowledge was established), and why it matters for future sessions.}
```

That is the whole format. A learning record can be a single paragraph. The value is recording _that_ this is now known and _why_ it changes what to teach next — not filling out sections.

## Optional sections

Only include these when they add genuine value. Most records won't need them.

- **Status** frontmatter (`active | superseded by LR-NNNN`) — useful when an earlier understanding turns out to be wrong and is replaced.
- **Evidence** — how the learner demonstrated the understanding (a question answered, an exercise completed, prior experience cited). Useful when the claim might be revisited.
- **Implications** — what this unlocks or rules out for future sessions. Worth recording when non-obvious.

## When to write a learning record

Write one when any of these is true:

1. **The learner demonstrated genuine understanding of something non-trivial** — not just exposure, but evidence they can use the concept correctly. This sets a new floor for what to teach next.
2. **The learner disclosed prior knowledge** — "I already know X." Record it so future sessions don't re-teach it. Also record the _depth_ claimed.
3. **A misconception was corrected** — the learner previously believed something wrong and now sees why. High-value: predicts future stumbling blocks in related topics.
4. **The mission shifted in response to learning** — the learner discovered they cared about something different than they thought. Cross-link to `MISSION.md` and update it.

### What does _not_ qualify

- Material that was merely covered. Coverage is not learning — wait for evidence.
- Anything already captured tersely as a term definition in `GLOSSARY.md`. Don't duplicate.
- Session-by-session activity logs. Learning records are decision-grade insights, not a journal.

## Supersession

When a later record contradicts an earlier one, mark the old record `Status: superseded by LR-NNNN` rather than deleting it. The history of how understanding evolved is itself useful signal.
