---
name: Data Engineering
description: Build reliable data pipelines — orchestration with Airflow/Dagster, dbt transformations, idempotent and backfillable jobs, incremental loads, data quality tests, and schema evolution. Use when moving or transforming data on a schedule.
triggers: [data pipeline, etl, elt, airflow, dagster, dbt, data warehouse, backfill, incremental load, data quality, orchestration, batch job, medallion, data modeling]
version: "1.0"
source: community
---

# Data Engineering Skill

## § RULES
- Every job must be idempotent. Re-running the same partition must produce the same result, not duplicates.
- Partition by the logical date the data belongs to, never by "now". Otherwise backfills are impossible.
- Test the data, not just the code. A green pipeline that loaded zero rows is a failure nobody noticed.
- Load raw first, transform second. Transforming on ingest means a bug in the transform loses the source data.
- Make every job resumable. A 6-hour job that cannot restart from the middle will eventually waste 6 hours.

---

## Layered warehouse

```
raw        exactly as it arrived, append-only, never edited
staging    typed, deduplicated, renamed — one model per source table
marts      business logic, joined, aggregated — what analysts query
```

Raw is your insurance. When a transform turns out to be wrong six months later, you reprocess from raw rather than re-extracting from a source that has since changed.

---

## Idempotency and partitions

The pattern that makes everything else work:

```sql
DELETE FROM events WHERE event_date = '{{ ds }}';
INSERT INTO events SELECT ... WHERE event_date = '{{ ds }}';
```

Delete-then-insert the partition, in a transaction. Re-running is safe; backfilling a range is just a loop.

Never `WHERE created_at > (SELECT MAX(created_at) FROM target)` — that is not reproducible, cannot be backfilled, and silently skips late-arriving rows.

**Late data is normal.** Events arrive hours after their timestamp. Reprocess a trailing window (typically 3 days) on every run rather than assuming yesterday is final.

---

## Orchestration

```python
@dag(schedule="0 3 * * *", start_date=datetime(2026, 1, 1),
     catchup=True, max_active_runs=1,
     default_args={"retries": 3, "retry_delay": timedelta(minutes=5)})
def daily_events():
    extract() >> load() >> transform() >> quality_check()
```

- `catchup=True` with a real `start_date` is what makes backfill a built-in rather than a script
- `max_active_runs=1` for anything writing to the same table
- Retries with backoff on every task that touches a network
- An SLA / timeout on every task — a hung job is worse than a failed one because nothing alerts

---

## dbt transformations

```sql
{{ config(materialized='incremental', unique_key='event_id',
          partition_by={'field': 'event_date', 'data_type': 'date'}) }}

select * from {{ source('raw', 'events') }}
{% if is_incremental() %}
  where event_date >= (select max(event_date) - interval '3 days' from {{ this }})
{% endif %}
```

The 3-day lookback plus `unique_key` handles late arrivals without duplicating.

Tests belong beside the model:

```yaml
models:
  - name: stg_events
    columns:
      - name: event_id
        tests: [unique, not_null]
      - name: user_id
        tests:
          - relationships: {to: ref('dim_users'), field: user_id}
```

---

## Data quality gates

Code tests prove the SQL parses. Data tests prove the output is usable. Check, and **fail the pipeline**:

| Check | Catches |
|---|---|
| row count within expected range | silent empty loads, duplication |
| null rate per critical column | upstream schema change |
| uniqueness on the key | join fan-out |
| referential integrity | missing dimension rows |
| freshness — max timestamp recent | a source that quietly stopped |
| distribution shift vs last 7 days | upstream semantic change |

Freshness is the one most often missing, and the one that silently serves stale dashboards for weeks.

---

## Schema evolution

Upstream will add, rename, and retype columns without telling you.

- Additive changes: safe, ignore unknown columns in raw
- Renames and type changes: detect at the staging layer and fail loudly
- Never `SELECT *` into a typed model — a new upstream column should not change your schema silently

Version the contract with the source team if one exists; otherwise assert the schema explicitly at ingest.

---

## Backfills

1. Test on one partition
2. Check the output against the existing data for that day
3. Run the range with bounded parallelism — a full-history backfill at max concurrency will take the warehouse down
4. Verify row counts across the whole range, not just the first partition

---

## Caveats
- Backfill cost is real. Estimate warehouse spend before reprocessing years of data.
- `MERGE` is convenient and often slower than delete-insert on partitioned tables — measure.
- For ML, the pipeline that builds training features must be the same code that builds serving features, or you get training/serving skew.
- Orchestrator retries do not help a non-idempotent job; they corrupt it faster.
