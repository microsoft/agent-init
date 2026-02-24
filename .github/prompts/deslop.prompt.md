---
name: deslop
description: Remove AI-generated slop from a branch by diffing against main
---

Get the diff (`git diff main...HEAD`) and remove AI-generated slop from changed files:

- Comments inconsistent with the rest of the file
- Defensive checks or try/catch blocks abnormal for that codepath
- `any` casts used to work around type issues
- Inline imports (move to top of file)
- Style inconsistencies with the surrounding code

Preserve legitimate changes. Report a 1-3 sentence summary of what was removed.
