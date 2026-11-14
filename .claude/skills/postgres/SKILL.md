---
name: postgres
description: PostgreSQL — queries, indexes, EXPLAIN ANALYZE, window functions, CTEs, JSONB, full-text search, migrations, row-level security, and performance patterns.
triggers: [postgres, postgresql, psql, sql query, pg, explain analyze, cte, window function, jsonb, row level security, rls, pg index, sql performance]
version: "1.0"
source: https://www.postgresql.org/docs
---

# PostgreSQL

## EXPLAIN ANALYZE (read this first for any slow query)
```sql
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT * FROM orders WHERE user_id = 42 ORDER BY created_at DESC LIMIT 10;

-- Key things to look for:
-- Seq Scan on large table → need an index
-- Nested Loop with large rows → consider Hash Join
-- Buffers: hit=X (cached) vs read=X (disk) — high read = cache miss
-- rows=X loops=Y actual rows=Z — large discrepancy = stale stats → ANALYZE table
```

## Index patterns
```sql
-- B-tree (default): equality + range
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_orders_user_created ON orders(user_id, created_at DESC);  -- compound

-- Partial: only index subset
CREATE INDEX idx_orders_pending ON orders(created_at) WHERE status = 'pending';

-- GIN: array / JSONB containment
CREATE INDEX idx_tags ON posts USING GIN(tags);                      -- text[]
CREATE INDEX idx_meta ON products USING GIN(metadata jsonb_path_ops); -- JSONB

-- Expression: computed value
CREATE INDEX idx_email_ci ON users(LOWER(email));

-- Non-blocking (production safe):
CREATE INDEX CONCURRENTLY idx_new ON orders(customer_id);
```

## CTEs and Window Functions
```sql
-- CTE (WITH clause)
WITH monthly_revenue AS (
  SELECT DATE_TRUNC('month', created_at) AS month,
         SUM(amount) AS revenue
  FROM orders WHERE status = 'paid'
  GROUP BY 1
)
SELECT month, revenue,
       revenue - LAG(revenue) OVER (ORDER BY month) AS delta
FROM monthly_revenue;

-- Window functions
SELECT user_id, order_id, amount,
  ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) AS rn,
  SUM(amount)  OVER (PARTITION BY user_id) AS total_spent,
  RANK()       OVER (ORDER BY amount DESC) AS amount_rank
FROM orders;

-- Top N per group (using CTE + window)
WITH ranked AS (
  SELECT *, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) AS rn
  FROM orders
)
SELECT * FROM ranked WHERE rn <= 3;
```

## JSONB
```sql
-- Query
SELECT * FROM products WHERE metadata->>'color' = 'red';
SELECT * FROM products WHERE metadata @> '{"brand": "Nike"}';  -- containment

-- Operators
metadata->'key'          -- returns JSONB
metadata->>'key'         -- returns TEXT
metadata#>'{a,b}'        -- nested path → JSONB
metadata#>>'{a,b}'       -- nested path → TEXT
metadata @> '{"k":"v"}' -- contains (use GIN index)
metadata ? 'key'         -- key exists

-- Update
UPDATE products SET metadata = metadata || '{"sale": true}';    -- merge
UPDATE products SET metadata = metadata - 'old_key';            -- remove key
UPDATE products SET metadata = jsonb_set(metadata, '{price}', '9.99');
```

## Full-Text Search
```sql
-- Add tsvector column
ALTER TABLE articles ADD COLUMN search_vector TSVECTOR;
UPDATE articles SET search_vector = to_tsvector('english', title || ' ' || body);
CREATE INDEX idx_articles_fts ON articles USING GIN(search_vector);

-- Query
SELECT title FROM articles
WHERE search_vector @@ to_tsquery('english', 'python & django')
ORDER BY ts_rank(search_vector, to_tsquery('english', 'python & django')) DESC;
```

## Row-Level Security (multi-tenant)
```sql
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON orders
  USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- Set at session start (from app layer):
-- SET LOCAL app.tenant_id = '...';
-- Or: SELECT set_config('app.tenant_id', $1, true);
```

## Useful queries
```sql
-- Table sizes
SELECT relname, pg_size_pretty(pg_total_relation_size(oid))
FROM pg_class WHERE relkind = 'r' ORDER BY pg_total_relation_size(oid) DESC LIMIT 10;

-- Missing indexes on FK columns
SELECT conrelid::regclass, a.attname, confrelid::regclass
FROM pg_constraint c JOIN pg_attribute a ON a.attnum = ANY(c.conkey) AND a.attrelid = c.conrelid
WHERE c.contype = 'f'
AND NOT EXISTS (
  SELECT 1 FROM pg_index i WHERE i.indrelid = c.conrelid AND a.attnum = ANY(i.indkey)
);

-- Long-running queries
SELECT pid, now() - query_start AS duration, query
FROM pg_stat_activity WHERE state = 'active' AND query_start < now() - interval '30s';

-- Lock waits
SELECT blocked.pid, blocking.pid AS blocking_pid, blocked.query
FROM pg_stat_activity blocked
JOIN pg_stat_activity blocking ON blocking.pid = ANY(pg_blocking_pids(blocked.pid));
```

## Rules
- `EXPLAIN ANALYZE` before adding any index — measure first
- `CREATE INDEX CONCURRENTLY` in production — never without it
- `TIMESTAMPTZ` not `TIMESTAMP` — always store UTC
- `UUID` PKs for public-facing IDs
- `VACUUM ANALYZE` after bulk inserts/deletes
- Connection pooling: PgBouncer (transaction mode) in front of Postgres
