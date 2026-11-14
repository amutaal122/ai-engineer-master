---
name: sqlalchemy
description: SQLAlchemy 2.x — async ORM, models, relationships, sessions, queries, migrations with Alembic, connection pooling, and production patterns.
triggers: [sqlalchemy, sqlalchemy orm, alembic, async sqlalchemy, sqlalchemy model, sqlalchemy query, sqlalchemy session, sqlalchemy relationship, database orm, python orm]
version: "1.0"
source: https://docs.sqlalchemy.org/en/20/
---

# SQLAlchemy 2.x

## Setup (async)
```bash
pip install sqlalchemy[asyncio] asyncpg alembic
```

```python
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase

DATABASE_URL = "postgresql+asyncpg://user:pass@localhost/db"

engine = create_async_engine(
    DATABASE_URL,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,  # reconnect on stale connections
    echo=False,          # True for SQL debug logging
)

SessionLocal = async_sessionmaker(engine, expire_on_commit=False)

class Base(DeclarativeBase):
    pass
```

## Models
```python
from sqlalchemy import String, Integer, ForeignKey, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid

class User(Base):
    __tablename__ = "users"

    id:         Mapped[uuid.UUID]  = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email:      Mapped[str]        = mapped_column(String(255), unique=True, nullable=False, index=True)
    name:       Mapped[str]        = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime]   = mapped_column(DateTime(timezone=True), server_default=func.now())

    orders: Mapped[list["Order"]] = relationship("Order", back_populates="user", lazy="selectin")

class Order(Base):
    __tablename__ = "orders"

    id:      Mapped[int]      = mapped_column(Integer, primary_key=True)
    user_id: Mapped[uuid.UUID]= mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    amount:  Mapped[float]    = mapped_column(nullable=False)

    user: Mapped["User"] = relationship("User", back_populates="orders")
```

## Session (FastAPI dependency)
```python
from contextlib import asynccontextmanager
from fastapi import Depends

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with SessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise

@app.get("/users/{user_id}")
async def get_user(user_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(404)
    return user
```

## Queries (SQLAlchemy 2.x style)
```python
from sqlalchemy import select, update, delete, func

# SELECT with filter
stmt = select(User).where(User.email == email)
result = await db.execute(stmt)
user = result.scalar_one_or_none()

# JOIN
stmt = (
    select(Order, User)
    .join(User, Order.user_id == User.id)
    .where(Order.amount > 100)
    .order_by(Order.created_at.desc())
    .limit(50)
)
rows = (await db.execute(stmt)).all()

# Aggregate
stmt = select(func.count(Order.id), func.sum(Order.amount)).where(Order.user_id == user_id)
count, total = (await db.execute(stmt)).one()

# Bulk insert
await db.execute(insert(Order).values([{"user_id": uid, "amount": a} for uid, a in items]))

# Update
await db.execute(update(User).where(User.id == user_id).values(name=new_name))

# Delete
await db.execute(delete(Order).where(Order.user_id == user_id))
```

## Relationships — loading strategies
```python
# lazy="selectin"  → separate SELECT per relationship (safe default for async)
# lazy="joined"    → JOIN in same query (best for 1:1 or small 1:N)
# lazy="raise"     → raise if accessed without explicit loading (avoid N+1)

# Explicit loading in query
from sqlalchemy.orm import selectinload, joinedload
stmt = select(User).options(selectinload(User.orders)).where(User.id == user_id)
```

## Alembic migrations
```bash
alembic init alembic
# Edit alembic.ini: sqlalchemy.url = postgresql+asyncpg://...
# Edit alembic/env.py: target_metadata = Base.metadata

alembic revision --autogenerate -m "add orders table"
alembic upgrade head
alembic downgrade -1
alembic history
```

## Rules
- `expire_on_commit=False` — required for async sessions (avoids greenlet errors)
- `pool_pre_ping=True` — reconnects after DB restart without errors
- `lazy="selectin"` for async relationships — `lazy="subquery"` causes errors in async
- Always use `select()` not `session.query()` — 2.x style only
- Use `mapped_column()` with `Mapped[type]` annotations — fully type-safe
- One session per request — never share sessions between requests
