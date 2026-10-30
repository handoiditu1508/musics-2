---
name: sync-template
description: Fetch latest code from template repository
disable-model-invocation: true
---

```bash
git remote add template https://github.com/handoiditu1508/react-template
git fetch template master
git merge template/master --allow-unrelated-histories
```
