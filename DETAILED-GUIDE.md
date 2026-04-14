# Git & Collaboration - Complete Guide

---

## Table of Contents
1. [What is Git?](#1-what-is-git)
2. [Git Basics](#2-git-basics)
3. [Branching Strategy](#3-branching-strategy)
4. [Merge vs Rebase](#4-merge-vs-rebase)
5. [GitHub Workflow](#5-github-workflow)
6. [Resolving Merge Conflicts](#6-resolving-merge-conflicts)
7. [Writing Good Commit Messages](#7-writing-good-commit-messages)
8. [Git Hooks](#8-git-hooks)
9. [Advanced Git Workflows](#9-advanced-git-workflows)
10. [CI/CD with GitHub Actions](#10-cicd-with-github-actions)
11. [Common Commands Cheat Sheet](#11-common-commands-cheat-sheet)
12. [Troubleshooting](#12-troubleshooting)

---

## 1. What is Git?

### Version Control System
Git is a distributed version control system that tracks changes to files over time. It enables multiple developers to work on the same project simultaneously without overwriting each other's work.

### Why Git?

| Feature | Why It Matters |
|---------|----------------|
| **Distributed** | Every developer has a full copy of the repository, including complete history. No single point of failure. |
| **Fast** | Most operations are local. Branching, committing, and viewing history don't require network access. |
| **Branching** | Lightweight branches encourage experimentation. Creating a branch is instant and cheap. |
| **Industry Standard** | Used by 90%+ of developers worldwide. Essential for collaboration. |

### Git vs GitHub
- **Git**: The tool installed on your computer
- **GitHub**: A cloud service that hosts Git repositories
- You can use Git without GitHub (local repos), but not GitHub without Git

---

## 2. Git Basics

### The Three Areas

Git has three areas that files move through:

```
Working Directory    →    Staging Area    →    Local Repository
(Files you edit)          (Changes ready         (Committed
                           to commit)             snapshots)
```

- **Working Directory**: Files you're currently editing
- **Staging Area**: Changes you've marked for the next commit
- **Local Repository**: Committed snapshots stored permanently

### Core Commands

#### Setup
```bash
# Initialize a new repository
git init

# Clone an existing repository
git clone <url>

# Configure your identity
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
git config --global init.defaultBranch main
```

#### Daily Workflow
```bash
# Check current state
git status

# Add specific file to staging
git add <filename>

# Add all changes to staging
git add .

# Check what's staged
git status

# Commit staged changes
git commit -m "descriptive message"

# Push to remote repository
git push origin main

# Fetch and merge from remote
git pull origin main
```

#### Complete Example
```bash
# Start your day
git pull origin main

# Make changes to files
echo "console.log('hello')" > app.js

# Check what changed
git status              # Shows app.js as untracked

# Stage the change
git add app.js
git status              # Shows app.js as staged

# Commit
git commit -m "feat: add hello world app"

# Push to GitHub
git push origin main
```

### Essential Inspection Commands
```bash
# See commit history
git log

# Compact history
git log --oneline

# Visual history with branches
git log --oneline --graph --all

# See unstaged changes
git diff

# See staged changes
git diff --staged

# See who changed each line
git blame <filename>
```

---

## 3. Branching Strategy

### What is a Branch?

A branch is a lightweight movable pointer to a commit. The default branch is usually called `main` (or `master`).

```
main ──┐
       ▼
  [Commit A] ── [Commit B] ── [Commit C]
                               ▲
                               │
                   feature ────┘
```

Creating a branch is instant - it's just creating a new pointer.

### Feature Branch Workflow

```bash
# Create a new branch
git branch feature/user-auth

# Switch to the branch
git checkout feature/user-auth

# Create + switch in one command (recommended)
git checkout -b feature/user-auth
```

### Why Feature Branches?

1. **Isolate work** - Don't break main while experimenting
2. **Enable parallel development** - Multiple devs work simultaneously
3. **Facilitate code reviews** - PRs require branches
4. **Easy to discard** - Experiment failed? Just delete the branch

### Branch Naming Conventions

| Pattern | Use Case | Example |
|---------|----------|---------|
| `feature/<name>` | New features | `feature/user-auth` |
| `bugfix/<name>` | Bug fixes | `bugfix/login-error` |
| `hotfix/<name>` | Urgent production fixes | `hotfix/security-patch` |
| `release/<version>` | Release preparation | `release/v2.0.0` |
| `refactor/<name>` | Code restructuring | `refactor/db-layer` |
| `docs/<name>` | Documentation changes | `docs/api-reference` |
| `chore/<name>` | Maintenance tasks | `chore/update-deps` |

### Best Practices

**Do's:**
- ✅ Create short-lived feature branches (merge within days)
- ✅ Name branches descriptively
- ✅ Keep branches updated with main
- ✅ Delete branches after merging
- ✅ Push branches to remote regularly

**Don'ts:**
- ❌ Don't work directly on `main`
- ❌ Don't let branches go stale (>2 weeks without updates)
- ❌ Don't force push to shared branches
- ❌ Don't commit to someone else's branch without permission
- ❌ Don't name branches generically (`branch1`, `new-branch`, `fix`)

### Branch Management Commands
```bash
# List local branches
git branch

# List remote branches
git branch -r

# List all branches
git branch -a

# Delete a merged branch locally
git branch -d feature/completed

# Force delete unmerged branch
git branch -D feature/abandoned

# Delete remote branch
git push origin --delete feature/old-feature
```

---

## 4. Merge vs Rebase

### Merge

Merge combines branches by creating a new merge commit that has two parent commits.

```bash
git merge feature/login
```

**How it works:**
- Preserves history exactly as it happened
- Creates a merge commit
- Non-destructive - never changes existing commits
- Can create "noisy" history with many merge commits

**Visual:**
```
      A───B───C  feature
     /         \
main───────────D───E───F  (merge commit D has two parents)
```

### Rebase

Rebase moves commits to a new base by rewriting history.

```bash
git rebase main
```

**How it works:**
- Takes your commits and replays them on top of target branch
- Creates new commits (different hashes)
- Linear, clean history
- **Destructive** - changes commit history

**Visual:**
```
Before rebase:
      A───B───C  feature
     /
main─D───E───F

After rebase:
              A'───B'───C'  feature (new commits)
             /
main─D───E───F
```

### When to Use Which?

| Scenario | Use | Reason |
|----------|-----|--------|
| Feature branch → main | **Merge** | Preserve complete history |
| Update feature branch with main | **Rebase** | Clean history, easier reviews |
| Shared/public branches | **Merge** | Don't rewrite shared history |
| Local cleanup before PR | **Rebase** | Squash/organize commits |
| Long-running feature branch | **Rebase** regularly | Stay up-to-date with main |

### The Golden Rule

> **Never rebase commits that have been pushed and could be used by others.**

Why? Rebasing rewrites history. If others based work on your commits, they'll have broken history.

### Interactive Rebase

For cleaning up your own commits before pushing:

```bash
# Rebase last 3 commits interactively
git rebase -i HEAD~3
```

Opens editor with options:
```
pick abc1234 feat: add user model
pick def5678 fix typo
pick ghi9012 update validation
```

Commands available:
- `pick` - use commit as-is
- `reword` - use commit but change message
- `squash` - meld into previous commit
- `fixup` - like squash but discard message
- `drop` - remove commit entirely

**Example: Squash 3 commits into 1**
```
pick abc1234 feat: add user model
squash def5678 fix typo
squash ghi9012 update validation
```

---

## 5. GitHub Workflow

### Pull Request (PR) Flow

```
1. Create feature branch from main
       │
2. Make changes and commit
       │
3. Push branch to GitHub
       │
4. Open Pull Request
       │
5. Code review by teammates
       │
6. Address review comments (push more commits)
       │
7. Merge to main
       │
8. Delete feature branch
```

### Creating a Good PR

**Title:** Clear, descriptive, conventional commit format
```
feat: add user authentication with JWT
fix: resolve null pointer in payment processing
docs: update API endpoint documentation
```

**Description Template:**
```markdown
## What this does
- Brief summary of changes

## Why this is needed
- Link to issue/ticket
- Problem this solves

## How to test
- Steps to verify the changes work

## Screenshots (if UI changes)
- Before/after images

## Checklist
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No console errors
```

### PR Best Practices

**As an Author:**
- ✅ Keep PRs small (<400 lines of code)
- ✅ Write clear description of changes
- ✅ Add screenshots for UI changes
- ✅ Link related issues
- ✅ Request specific reviewers
- ✅ Self-review before requesting others
- ✅ Respond to reviews promptly

**As a Reviewer:**
- ✅ Be constructive, not critical
- ✅ Check for correctness and logic
- ✅ Look for edge cases and error handling
- ✅ Consider security implications
- ✅ Verify test coverage
- ✅ Use suggestion feature for specific fixes
- ✅ Approve only when confident

### Code Review Checklist

**Correctness:**
- Does the code do what the PR description says?
- Are there any logic errors?
- Are edge cases handled?

**Code Quality:**
- Is the code readable and maintainable?
- Does it follow project conventions?
- Any code duplication that should be DRY'd?

**Security:**
- Any SQL injection vulnerabilities?
- Are user inputs validated?
- No hardcoded secrets or credentials?

**Performance:**
- Any obvious performance issues?
- Database queries optimized?
- Memory leaks possible?

---

## 6. Resolving Merge Conflicts

### What Causes Conflicts?

A conflict occurs when:
1. Two people modify the same lines in the same file
2. One person deletes a file another modified
3. Files are renamed/moved differently

### Understanding Conflict Markers

When Git can't auto-merge, it shows conflict markers:

```javascript
<<<<<<< HEAD
const cors = require('cors');
app.use(cors());
=======
const rateLimit = require('express-rate-limit');
app.use(limiter);
>>>>>>> feature/rate-limiting
```

- `<<<<<<< HEAD` - What's on the current branch (main)
- `=======` - Separator between the two versions
- `>>>>>>> feature/rate-limiting` - What's on the incoming branch

### How to Resolve

**Step 1: Identify the conflict**
```bash
git merge feature/rate-limiting
# Git shows: CONFLICT in src/index.js
```

**Step 2: Open the file**
```bash
cat src/index.js    # or open in editor
```

**Step 3: Decide what to keep**

Option A: Keep both (combine)
```javascript
const cors = require('cors');
const rateLimit = require('express-rate-limit');

app.use(cors());
app.use(limiter);
```

Option B: Keep only HEAD version
```javascript
const cors = require('cors');
app.use(cors());
```

Option C: Keep only incoming version
```javascript
const rateLimit = require('express-rate-limit');
app.use(limiter);
```

**Step 4: Remove conflict markers and save**

**Step 5: Stage the resolved file**
```bash
git add src/index.js
```

**Step 6: Complete the merge**
```bash
git commit -m "Merge feature/rate-limiting: resolve conflict"
```

### Useful Conflict Commands
```bash
# Abort current merge (start over)
git merge --abort

# See all files with conflicts
git diff --name-only --diff-filter=U

# Use a merge tool (visual resolution)
git mergetool

# Accept incoming version (theirs)
git checkout --theirs <file>
git add <file>

# Accept current version (ours)
git checkout --ours <file>
git add <file>
```

### Preventing Conflicts

1. **Pull frequently** - `git pull origin main` daily
2. **Communicate** - Tell team what files you're editing
3. **Small PRs** - Less chance of overlap
4. **Modular code** - Different files for different features
5. **Rebase regularly** - Stay up-to-date with main

---

## 7. Writing Good Commit Messages

### Why It Matters

- Future you will thank you
- Code reviews are faster
- Git history is useful for debugging
- Changelogs can be auto-generated

### Conventional Commits Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

| Type | When to Use | Example |
|------|-------------|---------|
| `feat` | New feature | `feat: add user authentication` |
| `fix` | Bug fix | `fix: resolve null pointer in payments` |
| `docs` | Documentation only | `docs: update API reference` |
| `style` | Formatting, no code change | `style: fix indentation` |
| `refactor` | Code restructuring, same behavior | `refactor: extract validation logic` |
| `test` | Adding tests | `test: add calculator unit tests` |
| `chore` | Maintenance tasks | `chore: update dependencies` |
| `perf` | Performance improvements | `perf: optimize database queries` |
| `ci` | CI/CD changes | `ci: add GitHub Actions workflow` |

### Subject Line Rules
- Start with lowercase (optional, but consistent)
- Use imperative mood ("add" not "added" or "adds")
- No period at the end
- Keep under 50 characters

### Body Rules
- Explain WHAT changed and WHY (not HOW)
- Wrap at 72 characters
- Use blank line between subject and body

### Footer Rules
- Link to issues: `Closes #123`, `Fixes #456`
- Breaking changes: `BREAKING CHANGE: description`
- Co-authors: `Co-authored-by: name <email>`

### Good Examples

**Simple:**
```
feat: add user authentication with JWT
```

**With body:**
```
fix: resolve null pointer in user controller

User.findById() was returning null for deleted users.
Added null check before accessing user properties.

Fixes #145
```

**Breaking change:**
```
feat: change user email validation

Previous validation allowed any string. Now requires
valid email format with @ and domain.

BREAKING CHANGE: Users with invalid emails will be
rejected at registration instead of silently accepted.

Closes #200
```

### Bad Examples

```
❌ fix stuff
❌ updated files
❌ wip
❌ added user thing
❌ changes
❌ fixed the bug
❌ more fixes
```

### Multi-commit PRs

When working on a feature, make small logical commits:

```bash
git commit -m "feat: add user model"
git commit -m "feat: add user controller"
git commit -m "feat: add user routes"
git commit -m "docs: add user API documentation"
git commit -m "test: add user endpoint tests"
```

Better than one massive commit:
```bash
git commit -m "added everything for users"  # ❌
```

---

## 8. Git Hooks

### What are Git Hooks?

Git hooks are scripts that run automatically when certain Git events occur. They're stored in `.git/hooks/` by default, but can be configured to live in your project.

### Common Hooks

| Hook | When it runs | Use Case |
|------|--------------|----------|
| `pre-commit` | Before `git commit` | Linting, formatting checks |
| `commit-msg` | After commit message entered | Validate message format |
| `pre-push` | Before `git push` | Run tests |
| `post-merge` | After `git merge` | Install dependencies |
| `post-checkout` | After `git checkout` | Update environment |
| `prepare-commit-msg` | Before commit message editor opens | Auto-generate messages |

### Creating a Pre-commit Hook

**Step 1: Create hooks directory**
```bash
mkdir -p hooks
```

**Step 2: Create the hook script**

`hooks/pre-commit`:
```bash
#!/bin/sh

echo "🔍 Running pre-commit checks..."

# Check for console.log in production code
echo "Checking for console.log statements..."
if grep -r "console\.log" --include="*.js" --exclude-dir=node_modules src/; then
    echo "⚠️  Warning: Found console.log in production code"
    echo "Consider using a proper logger"
fi

# Check for TODO comments without issue numbers
echo "Checking for TODO comments..."
if grep -r "TODO" --include="*.js" src/ | grep -v "#[0-9]"; then
    echo "⚠️  Warning: Found TODO without issue reference"
fi

# Check file sizes
echo "Checking file sizes..."
for file in $(git diff --cached --name-only); do
    if [ -f "$file" ]; then
        size=$(wc -c < "$file")
        if [ "$size" -gt 1048576 ]; then
            echo "❌ Error: $file is larger than 1MB"
            exit 1
        fi
    fi
done

echo "✅ Pre-commit checks passed!"
exit 0
```

**Step 3: Make it executable**
```bash
chmod +x hooks/pre-commit
```

**Step 4: Configure Git to use project hooks**
```bash
git config core.hooksPath hooks
```

**Step 5: Test it**
```bash
git commit -m "test: trigger hook"
# Hook runs automatically
```

### Commit Message Validation Hook

`hooks/commit-msg`:
```bash
#!/bin/sh

commit_msg=$(cat "$1")

# Check conventional commit format
if ! echo "$commit_msg" | grep -qE "^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .+"; then
    echo "❌ Error: Commit message doesn't follow conventional commits format"
    echo "Expected: type: description"
    echo "Example: feat: add user authentication"
    echo ""
    echo "Types: feat, fix, docs, style, refactor, test, chore"
    exit 1
fi

echo "✅ Commit message format is valid"
exit 0
```

### Pre-push Hook (Run Tests)

`hooks/pre-push`:
```bash
#!/bin/sh

echo "🧪 Running tests before push..."

npm test
if [ $? -ne 0 ]; then
    echo "❌ Tests failed. Push aborted."
    exit 1
fi

echo "✅ All tests passed!"
exit 0
```

### Bypassing Hooks (Emergency Only)

```bash
git commit --no-verify -m "emergency fix"
git push --no-verify
```

⚠️ Only use when absolutely necessary. Hooks exist for a reason.

---

## 9. Advanced Git Workflows

### GitFlow

A structured branching model for projects with scheduled releases.

**Branches:**
- `main` - Production-ready code (stable)
- `develop` - Integration branch for features
- `feature/*` - Branch from develop, merge back to develop
- `release/*` - Branch from develop, merge to main and develop
- `hotfix/*` - Branch from main, merge to main and develop

**Flow:**
```
main ──────────────────────────────●───
        \                   /     /
develop ──\───────────────●─────/────
              \       /   /     /
feature ────────\─────X──/     /
                  \   /       /
release ────────────●────────/
                            /
hotfix ─────────────────────●
```

**When to use:**
- Projects with scheduled releases (monthly, quarterly)
- Teams that need stable main branch
- Enterprise applications

**Pros:**
- Clear structure
- Stable main branch always production-ready
- Good for versioned releases

**Cons:**
- Complex for simple projects
- Slow feedback loop
- develop branch can get messy

### Trunk-Based Development

A simplified model where everyone works on short-lived branches off main.

**Principles:**
- Single `main` branch (the trunk)
- Short-lived feature branches (< 2 days)
- Frequent merges to main (multiple times per day)
- Feature flags for incomplete features
- CI runs on every push

**Flow:**
```
main ──●──●──●──●──●──●──●──●──●──●──
        \    \  /
feat ────●────●─/  (merged within 2 days)
```

**When to use:**
- CI/CD pipelines
- Fast-paced teams
- SaaS applications with continuous deployment

**Pros:**
- Fast feedback
- Fewer merge conflicts
- Simpler model

**Cons:**
- Requires discipline
- Needs good test coverage
- Main can be unstable without feature flags

### Comparison

| Aspect | GitFlow | Trunk-Based |
|--------|---------|-------------|
| Branches | Many | Few |
| Release cycle | Scheduled | Continuous |
| Complexity | High | Low |
| Feedback speed | Slow | Fast |
| Best for | Enterprise | SaaS/Startups |

---

## 10. CI/CD with GitHub Actions

### What is CI/CD?

- **Continuous Integration (CI)**: Automatically build and test on every push
- **Continuous Deployment (CD)**: Automatically deploy after tests pass

### Why CI?

1. **Catch bugs early** - Tests run automatically on every push
2. **Consistent quality** - Same checks for every contributor
3. **Fast feedback** - Developers know within minutes if they broke something
4. **Automated releases** - Deploy without human intervention

### Basic CI Workflow

`.github/workflows/ci.yml`:
```yaml
name: CI Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [16.x, 18.x, 20.x]

    steps:
    - uses: actions/checkout@v3

    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run tests
      run: npm test
```

### Explained

**`on:`** - When to run
- `push` - On every push to main
- `pull_request` - On every PR to main

**`jobs:`** - What to run
- `runs-on` - Which OS (ubuntu, windows, macos)
- `strategy.matrix` - Run on multiple Node versions

**`steps:`** - Sequence of actions
1. `checkout` - Get your code
2. `setup-node` - Install Node.js
3. `npm ci` - Install dependencies (faster, cleaner than npm install)
4. `npm test` - Run your tests

### Pipeline Stages

```
Push → Lint → Test → Build → Deploy
        ↓       ↓       ↓       ↓
      Fast    Most    Slow    Only
      check   checks  steps   on main
```

### CI Best Practices

1. **Keep CI fast** - Under 10 minutes ideally
2. **Fail fast** - Run quick checks first
3. **Use caching** - Speed up dependency installation
4. **Protect main** - Require CI to pass before merging
5. **Notify team** - Alert on failures
6. **Test on multiple versions** - Catch compatibility issues

### Branch Protection Rules

Protect your main branch:

1. Go to **Settings → Branches → Add rule**
2. Select `main`
3. Enable:
   - ✅ Require pull request reviews (minimum 1-2)
   - ✅ Require status checks to pass
   - ✅ Require branches to be up-to-date
   - ✅ Include administrators

### CD Example (Auto-deploy)

```yaml
deploy:
  needs: test
  runs-on: ubuntu-latest
  if: github.ref == 'refs/heads/main'

  steps:
  - uses: actions/checkout@v3

  - name: Deploy to production
    run: ./deploy.sh
    env:
      DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
```

---

## 11. Common Commands Cheat Sheet

### Daily Workflow
```bash
git pull origin main
git checkout -b feature/my-feature
# ... work ...
git add .
git commit -m "feat: my change"
git push -u origin feature/my-feature
# Create PR on GitHub
```

### Undo Operations
```bash
# Undo last commit, keep changes staged
git reset --soft HEAD~1

# Undo last commit, discard all changes
git reset --hard HEAD~1

# Create new commit that undoes changes
git revert <commit-hash>

# Change last commit message
git commit --amend -m "new message"

# Add forgotten files to last commit
git add <file>
git commit --amend --no-edit
```

### Stashing
```bash
# Save current work temporarily
git stash

# List stashes
git stash list

# Get stashed work back
git stash pop

# Apply stash without removing it
git stash apply

# Create stash with message
git stash save "WIP: fixing login bug"
```

### Cleanup
```bash
# Remove deleted remote references
git fetch --prune

# Remove untracked files (careful!)
git clean -fd

# Show what would be deleted
git clean -fdn

# Garbage collect
git gc

# Remove local branches merged to main
git branch --merged main | grep -v "main" | xargs git branch -d
```

### Inspection
```bash
# Visual commit history
git log --oneline --graph --all

# See who changed each line
git blame <file>

# Search commit history
git log --all --grep="search text"

# Search commits by author
git log --all --author="name"

# See changes in a commit
git show <commit-hash>

# Compare two commits
git diff <hash1>..<hash2>

# Find when a bug was introduced
git bisect start
git bisect bad          # Current commit is broken
git bisect good <hash>  # Known good commit
# Git checks out middle commit
# Test and mark: git bisect good/bad
# Repeat until bug found
git bisect reset        # When done
```

### Recovery
```bash
# Lost commits? Check reflog
git reflog

# Recover lost branch
git checkout -b recovered-branch <hash-from-reflog>

# Abort current merge
git merge --abort

# Abort current rebase
git rebase --abort

# Continue rebase after resolving conflicts
git rebase --continue
```

---

## 12. Troubleshooting

### Common Issues and Solutions

#### "Can't push - permission denied"
```bash
# Check remote URL
git remote -v

# If wrong, fix it
git remote set-url origin https://github.com/user/repo.git

# Or setup SSH
git remote set-url origin git@github.com:user/repo.git
```

#### "Refusing to merge unrelated histories"
```bash
# Force merge
git pull origin main --allow-unrelated-histories
```

#### "Stuck in Vim editor during commit"
```bash
# Exit Vim:
# 1. Press Esc
# 2. Type :wq
# 3. Press Enter

# OR set different editor:
git config --global core.editor "nano"
# OR for VS Code:
git config --global core.editor "code --wait"
```

#### "I committed to main by mistake"
```bash
# Move the commit to a new branch
git checkout -b feature/my-mistake
git checkout main
git reset --hard HEAD~1
```

#### "I forgot to add files to last commit"
```bash
git add forgotten-file.js
git commit --amend --no-edit
```

#### "Wrong commit message"
```bash
git commit --amend -m "correct message"
```

#### "Pushed to wrong branch"
```bash
# Reset local branch
git reset --hard HEAD~1

# Force push (only if you're sure)
git push --force-with-lease
```

#### "Merge conflict - I messed up"
```bash
# Start over
git merge --abort

# Or for rebase
git rebase --abort
```

#### "Deleted branch but need it back"
```bash
# Find the commit hash
git reflog

# Recreate branch
git checkout -b recovered-branch <commit-hash>
```

#### "Tests pass locally but fail on CI"
```bash
# Check Node version
node --version

# Clean install
rm -rf node_modules package-lock.json
npm ci

# Check for platform-specific issues
# Check for case sensitivity (Linux vs Mac/Windows)
```

---

## Quick Reference Card

### Most Used Commands
```bash
git status              # What's happening?
git add <file>          # Stage changes
git commit -m "msg"     # Save changes
git push                # Upload to GitHub
git pull                # Download from GitHub
git checkout -b <name>  # Create new branch
git log --oneline       # See history
```

### Commit Message Format
```
type: short description

optional detailed explanation

footer (optional)
```

### Branch Naming
```
feature/<name>
bugfix/<name>
hotfix/<name>
refactor/<name>
docs/<name>
```

---

**For more help:**
- 📖 [Pro Git Book](https://git-scm.com/book/en/v2)
- 🎮 [Learn Git Branching](https://learngitbranching.js.org/)
- 📝 [Conventional Commits](https://www.conventionalcommits.org/)
