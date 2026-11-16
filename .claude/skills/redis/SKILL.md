---
name: redis
description: Redis — caching, sessions, rate limiting, pub/sub, streams, distributed locks, leaderboards, and AI response caching patterns.
triggers: [redis, redis cache, redis stream, pub sub redis, redis rate limit, redis lock, redis session, cache layer, in-memory store]
version: "1.0"
source: https://redis.io/docs
---

# Redis

## Connect (Python — redis-py)
```python
import redis.asyncio as redis

pool = redis.ConnectionPool.from_url(
    "redis://localhost:6379",
    max_connections=20,
    decode_responses=True,
)
r = redis.Redis(connection_pool=pool)

# Health check
await r.ping()
```

## Caching patterns
```python
# Simple cache-aside
async def get_user(user_id: str) -> dict:
    key = f"user:{user_id}"
    if cached := await r.get(key):
        return json.loads(cached)
    user = await db.fetch_user(user_id)
    await r.setex(key, 300, json.dumps(user))  # TTL = 300s
    return user

# LLM response cache (hash prompt + params as key)
import hashlib
def cache_key(prompt: str, model: str, **params) -> str:
    h = hashlib.sha256(f"{prompt}:{model}:{sorted(params.items())}".encode()).hexdigest()
    return f"llm:{h}"

# Cache-or-compute pattern
async def cached_llm(prompt: str, model: str) -> str:
    key = cache_key(prompt, model)
    if hit := await r.get(key):
        return hit
    result = await llm_call(prompt, model)
    await r.setex(key, 3600, result)  # 1h TTL for LLM responses
    return result
```

## Rate limiting (token bucket)
```python
async def check_rate_limit(user_id: str, limit: int = 100, window: int = 60) -> bool:
    key = f"rate:{user_id}"
    pipe = r.pipeline()
    now = time.time()
    pipe.zremrangebyscore(key, 0, now - window)
    pipe.zadd(key, {str(now): now})
    pipe.zcard(key)
    pipe.expire(key, window)
    *_, count, _ = await pipe.execute()
    return count <= limit

# Fixed window (simpler, less accurate)
async def rate_limit_fixed(user_id: str, limit: int = 100) -> bool:
    key = f"rate:fw:{user_id}:{int(time.time() // 60)}"
    count = await r.incr(key)
    if count == 1:
        await r.expire(key, 60)
    return count <= limit
```

## Distributed lock
```python
import uuid
from contextlib import asynccontextmanager

@asynccontextmanager
async def redis_lock(key: str, ttl: int = 10):
    token = str(uuid.uuid4())
    acquired = await r.set(f"lock:{key}", token, nx=True, ex=ttl)
    if not acquired:
        raise RuntimeError(f"Could not acquire lock: {key}")
    try:
        yield
    finally:
        # Only release if we still own the lock (Lua script = atomic)
        script = """
        if redis.call("get", KEYS[1]) == ARGV[1] then
            return redis.call("del", KEYS[1])
        end
        """
        await r.eval(script, 1, f"lock:{key}", token)

async with redis_lock("payment:user:123"):
    await process_payment()
```

## Pub/Sub
```python
# Publisher
await r.publish("notifications", json.dumps({"type": "alert", "msg": "..."}))

# Subscriber
async def listen():
    pubsub = r.pubsub()
    await pubsub.subscribe("notifications")
    async for message in pubsub.listen():
        if message["type"] == "message":
            handle(json.loads(message["data"]))
```

## Streams (persistent, consumer groups)
```python
# Producer
await r.xadd("events", {"user_id": "123", "action": "login"})

# Consumer group
await r.xgroup_create("events", "processors", id="0", mkstream=True)

# Worker
messages = await r.xreadgroup("processors", "worker-1", {"events": ">"}, count=10)
for stream, msgs in messages:
    for msg_id, data in msgs:
        await process(data)
        await r.xack("events", "processors", msg_id)
```

## Data structures
```python
# Sorted set — leaderboard
await r.zadd("leaderboard", {"alice": 950, "bob": 1200})
top10 = await r.zrevrange("leaderboard", 0, 9, withscores=True)

# Hash — user session
await r.hset("session:abc", mapping={"user_id": "123", "role": "admin"})
await r.expire("session:abc", 86400)
session = await r.hgetall("session:abc")

# Set — unique visitors
await r.sadd("visitors:2026-11-15", user_id)
count = await r.scard("visitors:2026-11-15")
```

## Rules
- Always set TTL — unbounded keys = memory leak
- Use pipelining for multiple operations in one round trip
- Use Lua scripts for atomic read-modify-write (avoid WATCH/MULTI race)
- Connection pool — never create a new connection per request
- Serialize complex objects to JSON — Redis stores strings
