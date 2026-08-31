# RESOURCES.md Format

`RESOURCES.md` is the curated set of trusted sources for this course. Knowledge for lessons should be drawn from here, not from parametric guesses. Wisdom comes from the communities listed here.

## Structure

```md
# {Topic} Resources

## Knowledge

- [Book: _Title_ — Author](https://example.com)
  What it's foundational for. Use for: {the specific sub-topics this source should answer}.
- [Article: "Title" — Author (Publication)](https://example.com)
  What it covers. Use for: {specific use}.

## Wisdom (Communities)

- [Community name](https://example.com)
  What it's good for and why it's trustworthy (moderation quality, expertise level).
- Local: {a real-world group, class, or meetup}
  Use for: real-time feedback outside the workspace.

## Gaps

- {A sub-topic the mission needs but no good resource has been found for yet — drives future search.}
```

## Rules

- **High-trust only.** Prefer primary sources, recognized experts, peer-reviewed or openly-licensed work, and communities with strong moderation. If a resource is marketing dressed as education, leave it out.
- **Annotate every entry.** A bare link is useless in three months. Add one line: what it covers and when to reach for it.
- **Group by Knowledge / Wisdom.** It's fine for a resource to appear in only one group.
- **Surface gaps explicitly** in a `## Gaps` section rather than silently teaching around a missing source.
- **Prune ruthlessly.** A resource that turned out to be wrong, shallow, or off-mission should be removed, not buried. Five sharp sources beat thirty mediocre ones.
- **Record community preferences.** If the learner has opted out of joining communities, note it here so future sessions don't keep proposing them.
- **Before trusting a download URL**, verify it actually resolves (`curl -sL -o /dev/null -w "%{http_code}"`) rather than assuming a link that looks free is actually accessible — some archives gate files that appear open.
