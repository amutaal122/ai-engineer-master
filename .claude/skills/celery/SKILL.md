---
name: celery
description: Celery — distributed task queues, beat scheduler, task routing, retries, chaining, monitoring with Flower, and patterns for AI/LLM background jobs.
triggers: [celery, celery task, celery beat, celery worker, task queue, background task python, celery redis, celery flower, celery chain, celery retry]
version: "1.0"
source: https://docs.celeryq.dev
---

# Celery

## Setup
```bash
pip install celery redis flower
export CELERY_BROKER_URL=redis://localhost:6379/0
export CELERY_RESULT_BACKEND=redis://localhost:6379/1
```

```python
# celery_app.py
from celery import Celery

celery = Celery(
    "myapp",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/1",
    include=["tasks.ai_tasks", "tasks.email_tasks"],
)

celery.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    timezone="UTC",
    task_track_started=True,
    task_acks_late=True,          # ack after task completes (not at pickup)
    worker_prefetch_multiplier=1, # one task at a time per worker
    task_routes={
        "tasks.ai_tasks.*": {"queue": "ai"},
        "tasks.email_tasks.*": {"queue": "email"},
    },
)
```

## Task definition
```python
from celery_app import celery
from celery.utils.log import get_task_logger

logger = get_task_logger(__name__)

@celery.task(
    bind=True,
    max_retries=3,
    default_retry_delay=60,  # seconds
    queue="ai",
)
def generate_report(self, user_id: str, report_type: str) -> dict:
    try:
        logger.info(f"Generating {report_type} for {user_id}")
        result = run_report(user_id, report_type)
        return result
    except TransientError as exc:
        raise self.retry(exc=exc, countdown=2 ** self.request.retries * 10)
    except Exception as exc:
        logger.error(f"Failed: {exc}")
        raise

# Dispatch
task = generate_report.delay(user_id="123", report_type="monthly")
print(task.id)   # track with this ID

# With options
generate_report.apply_async(
    args=["123", "monthly"],
    countdown=30,       # run in 30 seconds
    expires=3600,       # discard if not run within 1 hour
    priority=9,         # higher = more urgent (0-9)
)
```

## Task chaining and groups
```python
from celery import chain, group, chord

# Chain: A → B → C (output of each is input to next)
pipeline = chain(
    extract_data.s(source="s3://bucket/file.csv"),
    transform_data.s(schema="v2"),
    load_to_db.s(table="processed"),
)
pipeline.delay()

# Group: A, B, C in parallel
job = group(
    process_chunk.s(chunk) for chunk in chunks
)
result = job.apply_async()
results = result.get()  # wait for all

# Chord: parallel then callback
chord(
    group(embed_document.s(doc) for doc in docs),
)(update_vector_index.s())  # called with list of all results
```

## Beat scheduler (cron jobs)
```python
from celery.schedules import crontab

celery.conf.beat_schedule = {
    "nightly-report": {
        "task": "tasks.ai_tasks.generate_nightly_report",
        "schedule": crontab(hour=2, minute=0),  # 2 AM UTC
        "args": [],
    },
    "every-5-minutes-health": {
        "task": "tasks.health_check",
        "schedule": 300.0,  # every 5 minutes
    },
}
# Run beat: celery -A celery_app beat --loglevel=info
```

## LLM task pattern (AI-specific)
```python
@celery.task(bind=True, max_retries=5, queue="ai", time_limit=300)
def process_with_llm(self, document_id: str):
    """Long-running LLM task with progress tracking."""
    try:
        # Update progress (readable via task.info)
        self.update_state(state="PROGRESS", meta={"stage": "fetching", "progress": 10})
        doc = fetch_document(document_id)

        self.update_state(state="PROGRESS", meta={"stage": "processing", "progress": 50})
        result = call_llm(doc.content)

        self.update_state(state="PROGRESS", meta={"stage": "saving", "progress": 90})
        save_result(document_id, result)

        return {"status": "complete", "document_id": document_id}
    except RateLimitError as exc:
        raise self.retry(exc=exc, countdown=60)  # wait 1 min on rate limit
```

## Run workers
```bash
# Standard worker
celery -A celery_app worker --loglevel=info -Q default,ai -c 4

# AI queue with single concurrency (LLM calls are I/O heavy)
celery -A celery_app worker --loglevel=info -Q ai -c 10 --pool=gevent

# Monitor with Flower
celery -A celery_app flower --port=5555
```

## Rules
- `task_acks_late=True` — prevents task loss if worker crashes mid-task
- `worker_prefetch_multiplier=1` for long tasks — prevents worker holding tasks it can't finish
- Use queues to separate fast/slow tasks — don't let LLM jobs block email sends
- Always set `time_limit` on long-running tasks — prevents zombie workers
- Use `bind=True` for retry access via `self.retry()`
