---
name: git-advanced
description: Advanced Git patterns — interactive rebase, cherry-pick, stash, reflog recovery, bisect, worktrees, hooks, conventional commits, and branch strategies.
triggers: [git rebase, git bisect, git stash, git cherry-pick, git reflog, git worktree, git hook, conventional commit, git strategy, git squash, undo git]
version: "1.0"
source: https://git-scm.com/docs
---

# Git Advanced

## Undo cheatsheet
```bash
git restore <file>              # discard working dir changes
git restore --staged <file>     # unstage (keep changes)
git reset HEAD~1                # undo last commit, keep changes staged
git reset --soft HEAD~1         # undo commit, keep changes staged
git reset --hard HEAD~1         # ⚠ undo commit + discard changes
git revert <sha>                # safe undo — creates new commit
git reflog                      # find any lost commit/state
git checkout <reflog-sha>       # recover it
```

## Interactive rebase
```bash
git rebase -i HEAD~4            # edit last 4 commits
# Commands in editor:
# pick   = keep
# reword = keep, edit message
# squash = merge into previous (keep message)
# fixup  = merge into previous (discard message)
# drop   = delete commit
# edit   = pause to amend

git rebase -i --autosquash      # auto-squash fixup! commits
git commit --fixup <sha>        # marks commit to squash into <sha>
```

## Stash
```bash
git stash                       # stash tracked changes
git stash -u                    # include untracked files
git stash push -m "wip: auth"   # named stash
git stash list
git stash pop                   # apply + drop top stash
git stash apply stash@{2}       # apply without dropping
git stash drop stash@{0}
git stash branch feature/x      # stash → new branch
```

## Cherry-pick
```bash
git cherry-pick <sha>           # apply commit to current branch
git cherry-pick A..B            # range (excludes A)
git cherry-pick A^..B           # range (includes A)
git cherry-pick --no-commit <sha>  # apply without committing
```

## Bisect (find which commit broke something)
```bash
git bisect start
git bisect bad                  # current commit is bad
git bisect good v2.1.0          # last known good tag/sha
# Git checks out midpoint; test, then:
git bisect good                 # or: git bisect bad
# Repeat until Git finds the culprit
git bisect reset                # return to HEAD
git bisect run pytest tests/    # automate with a test command
```

## Worktrees (multiple branches checked out simultaneously)
```bash
git worktree add ../hotfix hotfix/login-bug   # new dir for branch
git worktree list
git worktree remove ../hotfix
# Useful: work on hotfix while main feature is in progress
```

## Hooks (`.git/hooks/` or via Husky)
```bash
# pre-commit: run linter before every commit
#!/bin/sh
ruff check . || exit 1
ruff format --check . || exit 1

# commit-msg: enforce conventional commits
#!/bin/sh
grep -qE "^(feat|fix|chore|docs|refactor|test|perf|ci)(\(.+\))?: .{1,72}" "$1" || {
  echo "Bad commit message. Use: type(scope): description"
  exit 1
}
```

## Conventional Commits
```
feat(auth): add OAuth2 login
fix(api): handle null user_id in /users/:id
chore(deps): bump pydantic to 2.9.0
refactor(db): extract query builder
docs(readme): add quickstart section
test(auth): add token expiry test
perf(query): add index on orders.created_at
ci(github): cache pip dependencies

Breaking change: add BREAKING CHANGE: in footer
feat!: remove deprecated /v1/legacy endpoint
```

## Branch strategy (GitHub Flow — simple)
```
main          → always deployable
feat/xyz      → branch from main, PR → main, delete after merge
hotfix/xyz    → branch from main tag, fix, PR → main + tag

Commit to main: squash-merge PRs (clean linear history)
Never force-push main
Tag releases: git tag -a v1.2.0 -m "Release 1.2.0"
```

## Useful one-liners
```bash
git log --oneline --graph --all         # visual branch history
git diff main...HEAD                    # changes since branching from main
git shortlog -sn --no-merges            # contributor commit counts
git ls-files --others --exclude-standard # untracked files
git blame -L 40,60 src/auth.py          # who wrote lines 40-60
git show <sha>:src/auth.py              # file at a past commit
git grep "TODO" -- "*.py"              # search across all tracked files
```
