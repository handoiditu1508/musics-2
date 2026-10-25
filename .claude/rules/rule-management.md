---
paths: 
  - ".claude/**/*.md"
  - "AGENTS.md"
  - "CLAUDE.md"
  - "CLAUDE.local.md"
---

# Rules for managing agent rules

## Best practices

- Place new agent rules in the most specific applicable file in `.claude/rules/*.md` or create new file. Add a rule to `CLAUDE.md` only when it applies repository-wide.
- Before adding an agent rule, check `CLAUDE.md` and `.claude/rules/*.md`; do not duplicate or restate an existing rule.
- When a rule is difficult to explain or would require lengthy prose, prefer a concise example code snippet that demonstrates it.
- Keep each agent rule to no more than two sentences.
