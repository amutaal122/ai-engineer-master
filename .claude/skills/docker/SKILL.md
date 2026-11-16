---
name: docker
description: Docker and Docker Compose — Dockerfile authoring, multi-stage builds, layer caching, compose services, networking, volumes, secrets, and production patterns.
triggers: [docker, dockerfile, docker compose, docker build, docker run, container, multi-stage, docker image, dockerize]
version: "1.0"
source: https://docs.docker.com
---

# Docker

## Dockerfile (production pattern)
```dockerfile
# Multi-stage: build → runtime (smallest final image)
FROM python:3.12-slim AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

FROM python:3.12-slim
WORKDIR /app
COPY --from=builder /install /usr/local
COPY . .
RUN useradd -m app && chown -R app /app
USER app
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## Layer cache rules
```
Order: least-changing → most-changing
  COPY requirements.txt .   # deps (slow, rare)
  RUN pip install ...
  COPY . .                  # app code (fast, frequent)
Never: RUN apt-get && apt-get install in separate layers → combine with &&
Always: --no-cache-dir (pip), rm -rf /var/lib/apt/lists/* (apt)
```

## .dockerignore
```
.git
__pycache__
*.pyc
.env
.venv
node_modules
*.log
dist/
```

## Key commands
```bash
docker build -t myapp:1.0 .
docker build --target builder .          # stop at stage
docker build --no-cache .
docker run -p 8000:8000 --env-file .env myapp:1.0
docker run -it --rm myapp:1.0 bash       # debug shell
docker exec -it <id> bash                # enter running container
docker logs -f <id>
docker system prune -af                  # remove all unused
docker image ls --filter dangling=true   # find <none> images
```

## Docker Compose
```yaml
# compose.yaml
services:
  api:
    build: .
    ports: ["8000:8000"]
    env_file: .env
    depends_on:
      db: { condition: service_healthy }
    volumes:
      - ./src:/app/src   # dev only — remove in prod

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: mydb
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes: [pgdata:/var/lib/postgresql/data]
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "user"]
      interval: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    command: redis-server --maxmemory 256mb --maxmemory-policy allkeys-lru

volumes:
  pgdata:
```

```bash
docker compose up -d          # start detached
docker compose up --build     # rebuild before start
docker compose down -v        # stop + delete volumes
docker compose logs -f api    # tail one service
docker compose exec api bash  # shell into service
docker compose ps             # status
```

## Secrets (never ENV for sensitive values in prod)
```yaml
# compose.yaml (dev only — use Vault/AWS Secrets Manager in prod)
services:
  api:
    secrets: [db_password]
secrets:
  db_password:
    file: ./secrets/db_password.txt  # or: external: true
# Mounted at: /run/secrets/db_password
```

## Rules
- Never `COPY . .` before installing deps — kills cache
- Non-root user always: `useradd` + `USER app`
- Use `slim` or `alpine` base images; never `latest` tag in prod
- One process per container; use compose for multi-service
- Health checks on every service that others depend_on
