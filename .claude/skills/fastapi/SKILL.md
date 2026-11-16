---
name: fastapi
description: FastAPI — async REST APIs, Pydantic validation, dependency injection, background tasks, middleware, OpenAPI docs, and production patterns for AI/ML services.
triggers: [fastapi, fast api, rest api, api endpoint, pydantic, uvicorn, starlette, async api, http endpoint, openapi, swagger]
version: "1.0"
source: https://fastapi.tiangolo.com
---

# FastAPI

## Project structure
```
src/
├── api/
│   ├── routes/          # one file per domain
│   └── dependencies.py  # shared deps (db, auth)
├── core/
│   ├── config.py        # pydantic settings
│   └── security.py
├── models/              # SQLAlchemy
├── schemas/             # Pydantic request/response
├── services/            # business logic
└── main.py
```

## App setup
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup
    await db.connect()
    yield
    # shutdown
    await db.disconnect()

app = FastAPI(title="API", version="1.0.0", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
```

## Schemas (Pydantic v2)
```python
from pydantic import BaseModel, Field, field_validator
from datetime import datetime
from uuid import UUID

class UserCreate(BaseModel):
    email: str = Field(..., pattern=r"^[\w.-]+@[\w.-]+\.\w+$")
    name: str = Field(..., min_length=1, max_length=100)

class UserResponse(BaseModel):
    id: UUID
    email: str
    created_at: datetime
    model_config = {"from_attributes": True}  # for ORM objects

class PredictRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000)
    model: str = "claude-sonnet-4-5"

class PredictResponse(BaseModel):
    result: str
    confidence: float
    latency_ms: float
```

## Routes
```python
from fastapi import APIRouter, Depends, HTTPException, status

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/", response_model=UserResponse, status_code=201)
async def create_user(data: UserCreate, db: AsyncSession = Depends(get_db)):
    existing = await db.scalar(select(User).where(User.email == data.email))
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")
    user = User(**data.model_dump())
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user

@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: UUID, db: AsyncSession = Depends(get_db)):
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
```

## Dependency injection
```python
from fastapi import Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as session:
        yield session

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(security),
    db: AsyncSession = Depends(get_db)
) -> User:
    token = credentials.credentials
    user_id = verify_jwt(token)  # raises if invalid
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return user
```

## Background tasks + streaming
```python
from fastapi import BackgroundTasks
from fastapi.responses import StreamingResponse
import asyncio

@router.post("/predict")
async def predict(req: PredictRequest, background_tasks: BackgroundTasks):
    result = await run_model(req.text)
    background_tasks.add_task(log_prediction, req, result)
    return {"result": result}

@router.post("/predict/stream")
async def predict_stream(req: PredictRequest):
    async def generate():
        async with anthropic_client.messages.stream(...) as stream:
            async for text in stream.text_stream:
                yield f"data: {text}\n\n"
        yield "data: [DONE]\n\n"
    return StreamingResponse(generate(), media_type="text/event-stream")
```

## Settings (Pydantic)
```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str
    anthropic_api_key: str
    redis_url: str = "redis://localhost:6379"
    debug: bool = False
    model_config = {"env_file": ".env"}

settings = Settings()
```

## Error handling
```python
from fastapi import Request
from fastapi.responses import JSONResponse

@app.exception_handler(ValueError)
async def value_error_handler(request: Request, exc: ValueError):
    return JSONResponse(status_code=400, content={"detail": str(exc)})

@app.exception_handler(Exception)
async def general_handler(request: Request, exc: Exception):
    logger.error("Unhandled error", error=str(exc), path=request.url.path)
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})
```

## Run
```bash
uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload   # dev
uvicorn src.main:app --host 0.0.0.0 --port 8000 --workers 4 # prod
```

## Rules
- All endpoints async — never use sync blocking I/O in async routes
- Validate at API boundary with Pydantic — never trust raw input
- Use `Depends()` for all shared resources (db, auth, settings)
- Never return internal errors to clients — log them, return generic message
- Background tasks for fire-and-forget (logging, notifications)
- Streaming for LLM responses — always use SSE
