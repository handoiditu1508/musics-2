---
name: deploy-github
description: Deploy current branch to github pages
---

## Prepare to deploy to github pages

### Create deployment branch

Create and switch to `github-pages` branch.

```bash
git checkout -b github-pages
```

### Install `gh-pages`

```bash
npm install --save-dev gh-pages
```

### Config `package.json`

Add these 2 commands.

```json
{
  // existed code
  "scripts": {
    // existed commands
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
  // existed code
}
```

*Content of `package.json`.*

### Config base path

Replace `react-template` with your repository name.

```typescript
export default defineConfig({
  base: "/react-template",
});
```

*Content of `vite.config.ts`.*

### Config router

in `src/routes/router.tsx`, replaces `createBrowserRouter` with `createHashRouter`.

### Config i18n

Replace `react-template` with your repository name.

```typescript
i18n
  // existed code
  .init({
    // existed code
    interpolation: {
      // existed code
    },
    // add this field
    backend: {
      loadPath: "/react-template/locales/{{lng}}/{{ns}}.json",
    }
  });
```

*Content of `src/i18n.ts`.*

### Change app name and title

Replace `React Template` with your app name.

```typescript
const defaultConfig: ConfigType = {
  APP_NAME: "React Template",
  // existed code
};
```

*Content of `src\configs\config.ts`*

```html
<head>
  <!-- existed code -->
  <title>React Template</title>
</head>
```

*Content of `index.html`*

## Deploy to github pages

### Switch to deployment branch

```bash
git switch github-pages
```

### Update from master

```bash
git fetch origin
git merge master
```

### Resolve packages after switching branch

```bash
npm install
```

### Build and deploy

```bash
npm run predeploy
npm run deploy
```
