---
name: github-actions
description: GitHub Actions — CI/CD workflows, caching, matrix builds, secrets, Docker publishing, deploy pipelines, reusable workflows, and AI/ML pipeline patterns.
triggers: [github actions, gh actions, ci cd, github workflow, yml workflow, github pipeline, actions cache, docker push github, deploy github actions, matrix build]
version: "1.0"
source: https://docs.github.com/en/actions
---

# GitHub Actions

## Basic CI (Python)
```yaml
# .github/workflows/ci.yml
name: CI
on:
  push:    { branches: [main] }
  pull_request: { branches: [main] }

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: ["3.11", "3.12"]
    steps:
      - uses: actions/checkout@v4

      - uses: astral-sh/setup-uv@v4
        with: { version: "latest" }

      - name: Install
        run: uv sync --frozen

      - name: Lint
        run: uv run ruff check . && uv run ruff format --check .

      - name: Type check
        run: uv run mypy src/

      - name: Test
        run: uv run pytest --cov=src --cov-report=xml -x
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/test

      - uses: codecov/codecov-action@v4
        with: { token: ${{ secrets.CODECOV_TOKEN }} }

    services:
      postgres:
        image: postgres:16-alpine
        env: { POSTGRES_DB: test, POSTGRES_USER: test, POSTGRES_PASSWORD: test }
        options: >-
          --health-cmd pg_isready --health-interval 5s --health-timeout 5s --health-retries 5
        ports: ["5432:5432"]
```

## Docker build + push
```yaml
# .github/workflows/docker.yml
name: Docker
on:
  push: { branches: [main], tags: ["v*"] }

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: docker/setup-buildx-action@v3

      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - uses: docker/metadata-action@v5
        id: meta
        with:
          images: ghcr.io/${{ github.repository }}
          tags: |
            type=ref,event=branch
            type=semver,pattern={{version}}
            type=sha,prefix=sha-

      - uses: docker/build-push-action@v5
        with:
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          build-args: |
            BUILD_DATE=${{ github.event.head_commit.timestamp }}
            GIT_SHA=${{ github.sha }}
```

## Caching (pip / uv / npm)
```yaml
# uv cache
- uses: actions/cache@v4
  with:
    path: ~/.cache/uv
    key: uv-${{ runner.os }}-${{ hashFiles('uv.lock') }}

# pip cache
- uses: actions/cache@v4
  with:
    path: ~/.cache/pip
    key: pip-${{ runner.os }}-${{ hashFiles('requirements*.txt') }}

# npm cache
- uses: actions/cache@v4
  with:
    path: ~/.npm
    key: npm-${{ runner.os }}-${{ hashFiles('package-lock.json') }}
```

## Secrets and environments
```yaml
# In workflow:
env:
  OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
  DATABASE_URL: ${{ secrets.DATABASE_URL }}

# Environment-specific (requires environment approval)
jobs:
  deploy:
    environment: production  # requires manual approval gate
    steps:
      - run: deploy.sh
        env:
          DEPLOY_KEY: ${{ secrets.PROD_DEPLOY_KEY }}
```

## Reusable workflows
```yaml
# .github/workflows/reusable-test.yml
on:
  workflow_call:
    inputs:
      python-version: { required: true, type: string }
    secrets:
      DATABASE_URL: { required: true }

# Caller:
jobs:
  test:
    uses: ./.github/workflows/reusable-test.yml
    with: { python-version: "3.12" }
    secrets: { DATABASE_URL: ${{ secrets.DATABASE_URL }} }
```

## AI/ML pipeline
```yaml
# .github/workflows/ml-eval.yml
name: ML Eval
on:
  pull_request: { paths: ["src/model/**", "prompts/**"] }

jobs:
  eval:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: astral-sh/setup-uv@v4
      - run: uv sync --frozen
      - name: Run evals
        run: uv run python evals/run_evals.py --model gpt-4o-mini --threshold 0.85
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
      - name: Upload eval report
        uses: actions/upload-artifact@v4
        with: { name: eval-report, path: eval-results/ }
```

## Useful patterns
```yaml
# Run only on changed files
- uses: dorny/paths-filter@v3
  id: changes
  with:
    filters: |
      backend: ["src/**", "tests/**"]
      infra: ["terraform/**"]

- if: steps.changes.outputs.backend == 'true'
  run: uv run pytest

# Concurrency (cancel in-progress on new push)
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

# Job dependencies
jobs:
  test:  ...
  build: { needs: test, ... }
  deploy: { needs: [test, build], if: github.ref == 'refs/heads/main', ... }
```

## Rules
- Pin action versions to SHA for security: `actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683`
- Use `GITHUB_TOKEN` for ghcr.io — no separate secret needed
- Set `cancel-in-progress: true` — saves CI minutes on fast pushes
- Never put secrets in `run:` steps — use `env:` instead
- Matrix builds for Python version compat; skip for internal services
