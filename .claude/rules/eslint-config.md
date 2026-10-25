---
paths:
  - "eslint.config.js"
---

# ESLint configuration rules

## Conventions

- Order rules alphabetically.
- Comment non-obvious or project-specific rule configurations to explain the rationale.

```javascript
{
  // ✅ Good - rules are grouped by plugin and ordered by name
  rules: {
    "react/display-name": "off",
    "react/jsx-fragments": "warn",
    "react/no-unescaped-entities": "off",
    "@stylistic/array-bracket-newline": ["warn", "consistent"],
    "@stylistic/block-spacing": ["warn", "always"],
    "@stylistic/comma-style": ["warn", "last"],
  },
}
```

## Severity levels

Use this hierarchy to maintain consistency:

- **`error`**: Critical violations that must be fixed before commit
  - Unused variables/imports
  - Obvious bugs or logic errors
  - Type safety violations
- **`warn`**: Code quality issues that should be addressed
  - Style inconsistencies
  - Potential performance issues
  - Non-critical accessibility warnings
- **`off`**: Rules disabled because they conflict with project practices or other tooling
  - Always document **why** a rule is disabled with a comment

## Important notes

- This is a flat config ESLint setup (ESLint v9+), not the older `.eslintrc` format.

## Boundaries

- ✅ Always do:
  - Install/update eslint packages as dev dependencies.
- 🚫 Never do:
  - Fix linting issues in `src` directly (use `npm run lint:fix` instead and report results)
