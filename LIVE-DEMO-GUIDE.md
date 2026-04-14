# Git KT - Live Demo Guide

## Setup Before Session (15 min before)

```bash
cd /Users/aditya/kt/demo-backend
git checkout main
```

**Share your screen with:**
- Terminal (large font)
- Browser open to: https://github.com/adityaeuron/demo-backend

---

## Part 1: Git Basics (15 min)

### What to say:
> "Everyone clone the repo now"

### Command to run:
```bash
git log --oneline
```

### Show them:
```bash
git log --oneline --graph --all
```

Point out:
- Each commit = a snapshot
- Branches = pointers to commits
- Main has 4 commits already

### Live demo:
```bash
# Show 3 areas of Git
git status          # Working directory
echo "// test" > temp.txt
git add temp.txt    # Staging area
git status
git commit -m "test: add temp file"  # Repository
git status
git rm temp.txt
git commit -m "test: remove temp"
```

**Key takeaway:** Working → Staging → Repo flow

---

## Part 2: Branching Strategy (15 min)

### What to say:
> "We'll add a feature without touching main"

### Command to run:
```bash
git checkout -b feature/calculator-api
```

### Show them the code:
```bash
cat src/controllers/calculatorController.js
cat src/routes/calculator.js
```

Explain:
- Controller = business logic
- Routes = HTTP endpoints
- Branch = isolated workspace

### Live demo:
```bash
# Switch back and forth
git checkout main
cat src/index.js          # No calculator routes
git checkout feature/calculator-api
cat src/index.js          # Has calculator routes
```

### Push it:
```bash
git checkout feature/calculator-api
git push origin feature/calculator-api
```

**Open GitHub** → Show the branch appeared

**Key takeaway:** Branches let you work in parallel without breaking main

---

## Part 3: Merge vs Rebase (20 min)

### MERGE Demo

```bash
# Go to main
git checkout main

# Merge calculator (fast-forward)
git merge feature/calculator-api
git push origin main

# Check history
git log --oneline --graph
```

### REBASE Demo

```bash
# Create scenario: main got updated while you worked
git checkout -b feature/scientific-ops

# Show what's on this branch
cat src/controllers/scientificController.js
cat src/routes/calculator.js

# Simulate teammate updating main
git checkout main
git merge feature/scientific-ops --no-edit
git push origin main

# Now show what happens when you rebase
git checkout feature/scientific-ops
git rebase main
git log --oneline --graph    # Linear history!
```

### Side-by-side comparison:

```bash
# Show merge creates merge commit
git checkout main
git merge feature/calculator-api
git log --oneline --graph    # Has merge commit

# Show rebase is linear
git checkout feature/scientific-ops
git rebase main
git log --oneline --graph    # Straight line
```

**Key takeaway:** 
- Merge = preserves history
- Rebase = cleaner, linear history
- Never rebase shared branches!

---

## Part 4: Pull Requests (20 min)

### What to say:
> "PRs are how teams review code, not merge buttons"

### Step 1: Checkout and show branch
```bash
git checkout feature/request-logging
cat src/middleware/requestLogger.js
```

### Step 2: Show the code
Explain:
- Logs every request with method + URL
- Tracks response time
- Good for debugging

### Step 3: Create PR LIVE

1. Push branch (already pushed):
```bash
git push origin feature/request-logging
```

2. Open GitHub → Click "Compare & pull request"

3. Fill in PR:
   - **Title:** `feat: add request logging middleware`
   - **Body:**
     ```
     ## What this does
     - Logs all incoming requests
     - Tracks response time
     - Helps debug slow endpoints
     
     ## Tested
     - Manual testing with curl
     ```

4. Show "Create pull request" button

5. Show the PR page - explain review flow

### Step 4: Merge the PR
- Click "Merge pull request"
- Delete branch

### Step 5: Pull locally
```bash
git checkout main
git pull origin main
```

**Key takeaway:** PR = code review conversation, not just merge

---

## Part 5: Merge Conflicts (15 min)

### What to say:
> "Conflicts are normal. Two people editing same lines = conflict"

### Show the conflict scenario:

```bash
# Main has cors-support merged
git checkout main
git log --oneline    # Shows CORS commit

# Rate-limiting branch was made BEFORE cors was merged
git checkout feature/rate-limiting
cat src/index.js     # No cors, has rate limiting
```

### Try to merge (will conflict):
```bash
git checkout main
git merge feature/rate-limiting
```

### Show the conflict markers:
```bash
cat src/index.js
```

They'll see:
```javascript
<<<<<<< HEAD
const cors = require('cors');
=======
const rateLimit = require('express-rate-limit');
>>>>>>> feature/rate-limiting
```

### Explain the markers:
- `<<<<<<< HEAD` = what's on main
- `=======` = separator
- `>>>>>>> feature/rate-limiting` = what's on the branch

### Resolve it LIVE (step-by-step):

**Step 1: Open the conflicted file in your editor**
```bash
# Open src/index.js in VS Code or your editor
code src/index.js
```

**Step 2: Find the conflict markers and REPLACE with this:**

Delete everything between (and including) `<<<<<<< HEAD` and `>>>>>>> feature/rate-limiting`

Replace with:
```javascript
const cors = require('cors');
const rateLimit = require('express-rate-limit');
```

And keep both middlewares:
```javascript
app.use(cors());
app.use(limiter);
```

**Step 3: Save the file**

**Step 4: Complete the merge**
```bash
git add src/index.js
git commit -m "Merge feature/rate-limiting: resolve conflict"
git push origin main
```

**⚠️ If you mess up the resolution:**
```bash
git merge --abort     # Undo the merge, start over
git merge feature/rate-limiting   # Try again
```

**Key takeaway:** Read markers → decide what to keep → stage → commit

---

## Part 6: Good Commit Messages (10 min)

### What to say:
> "Your commit message is a note to your future self"

### Show the error-handling branch:
```bash
git checkout refactor/error-handling
git log --oneline    # Shows one commit

ls src/middleware/
ls src/utils/
```

### Show good commit format:
```bash
git log --format="%B" -1
```

Explain the format:
```
type: short description

detailed explanation

footer (optional)
```

### Types to mention:
- `feat` = new feature
- `fix` = bug fix
- `docs` = documentation
- `refactor` = code restructuring
- `test` = adding tests
- `chore` = maintenance

### Bad examples (tell them):
```
❌ "fix stuff"
❌ "updated files"
❌ "wip"
❌ "added user thing"
```

**Key takeaway:** First line < 50 chars, body explains WHY

---

## Part 7: Git Hooks (10 min)

### What to say:
> "Hooks run automatically. Catch mistakes before commit"

### Create hook LIVE:
```bash
git checkout main
mkdir -p hooks
```

Create `hooks/pre-commit`:
```bash
#!/bin/sh
echo "🔍 Running pre-commit checks..."

# Check for console.log
if grep -r "console\.log" --include="*.js" --exclude-dir=node_modules src/; then
    echo "⚠️  Found console.log in production code"
fi

echo "✅ Pre-commit checks passed!"
exit 0
```

```bash
chmod +x hooks/pre-commit
git config core.hooksPath hooks
```

### Test it:
```bash
git add .
git commit -m "test: trigger hook"
```

Show it runs automatically!

**Key takeaway:** Automate quality checks before commits

---

## Part 8: CI/CD (15 min)

### What to say:
> "CI runs tests on every push. Catch bugs before they reach main"

### Show the CI setup branch:
```bash
git checkout feature/ci-setup
```

### Show the workflow file:
```bash
cat .github/workflows/ci.yml
```

Explain:
- Runs on every push and PR
- Tests on Node 16, 18, 20
- Fails if tests don't pass

### Show the tests:
```bash
cat tests/health.test.js
cat tests/calculator.test.js
```

### Run tests locally:
```bash
npm install
npm test
```

### Merge to main:
```bash
git checkout main
git merge feature/ci-setup --no-edit
git push origin main
```

### Open GitHub → Actions tab
- Show the workflow running
- Explain green checkmark = all good
- Explain red X = something broke

### Branch protection:
1. Settings → Branches → Add rule for `main`
2. Require PR reviews
3. Require CI to pass
4. Include administrators

**Key takeaway:** CI = automatic testing on every push

---

## Q&A (10 min)

### Quick command demos they might ask:

**"How to undo a commit?"**
```bash
git reset --soft HEAD~1    # Keep changes in staging
```

**"How to see what changed?"**
```bash
git diff                   # Unstaged changes
git diff --staged         # Staged changes
```

**"How to stash work?"**
```bash
git stash                  # Save current work
git stash pop             # Get it back
```

**"How to see who changed what?"**
```bash
git blame <file>
```

**"I lost my commits!"**
```bash
git reflog                 # Recovery tool
```

---

## Session Wrap-up

### What to say:
> "You don't need to memorize everything. Just master this flow:"

```bash
git pull origin main
git checkout -b feature/my-feature
# ... work ...
git add .
git commit -m "feat: my change"
git push -u origin feature/my-feature
# Create PR on GitHub
```

### Share these resources:
- https://learngitbranching.js.org/ (interactive tutorial)
- https://git-scm.com/book/en/v2 (free book)
- The repo: https://github.com/adityaeuron/demo-backend

---

## Timing Summary

| Part | Topic | Time |
|------|-------|------|
| 1 | Git Basics | 15 min |
| 2 | Branching | 15 min |
| 3 | Merge vs Rebase | 20 min |
| 4 | Pull Requests | 20 min |
| 5 | Merge Conflicts | 15 min |
| 6 | Commit Messages | 10 min |
| 7 | Git Hooks | 10 min |
| 8 | CI/CD | 15 min |
| - | Q&A | 10 min |
| **Total** | | **~2 hours** |

---

## Pro Tips for Live Demo

1. **Speak while typing** - Narrate what you're doing
2. **Ask questions** - "Who's seen a conflict before?"
3. **Make mistakes on purpose** - Show how to recover
4. **Keep terminal big** - Increase font size
5. **Pause after commands** - Let them catch up
6. **Point with mouse** - Show exactly what to look at
7. **Don't rush** - Better to cover less, understand more

---

**You're ready! Good luck! 🚀**
