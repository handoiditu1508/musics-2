---
name: eslint-upgrade
description: Keep ESLint and plugins at latest versions, add new rules, remove obsolete ones, and maintain existing configurations
---

1. **Audit phase**
  - Review `eslint.config.js` and extract all active plugins with versions from `package.json`.
  - Check the npm registry for the latest versions of each plugin. Use `npm view <package> versions` to see available versions.
  - Review changelog/GitHub releases for the latest version to identify:
    - Deprecated or removed rules.
    - New rules that align with project standards.
    - Breaking changes in configuration.
  - Document findings and recommend actions.

2. **Update phase**
  - Update plugin versions in `package.json` (use `npm install --save-dev` or `npm update`).
  - Modify `eslint.config.js`:
    - Remove rules that no longer exist.
    - Add or adjust rules for new plugin versions.
    - Sort all rules alphabetically by plugin and within each section.
    - Add comments explaining non-obvious configurations.

3. **Validation phase**
  - Run `npm run lint` to check the entire codebase.
  - Run `npm run lint:fix` to fix auto-fixable lint issues.
  - Run `npm run tsc` to verify TypeScript compilation still works.
  - Report any unfixed violations with context about which rules are now triggering them.
