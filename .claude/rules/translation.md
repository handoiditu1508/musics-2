---
paths:
  - "public/locales/**.*.json"
---

# Locale rules

## Best practices

- Keep `translation.json` for broadly shared UI text; put module or entity text in its own namespace file.
- Separate translation files for default modules and admin's modules.
  - `src/modules/product` uses `public/locales/en-US/product.json`
  - `src/modules/admin/product` uses `public/locales/en-US/admin-product.json`
- Give persistent shared UI its own namespace; do not load feature namespaces solely for text outside that feature.
- Keep equivalent keys in every supported locale.
- Prefer duplication between namespaces over making page-specific text global.
- Locale JSON keys should be `snake_case` using only lowercase letters, numbers and underscores.
- Exception: locale JSON keys in `errors.json` map BE error codes, so they may use a different format.
- Locale JSON values should use Title Case, and paragraph text should use Sentence case ending with punctuation.

```json
{
  "about_us": "About Us",
  "about_us_line_1": "This is a long and boring introduction about myself.",
}
```
