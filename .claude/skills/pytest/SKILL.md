---
name: pytest
description: pytest — fixtures, parametrize, marks, conftest, monkeypatch, tmp_path, async tests, coverage, and common patterns for unit and integration testing.
triggers: [pytest, fixture, parametrize, conftest, monkeypatch, pytest mark, pytest async, test coverage, pytest plugin, hypothesis, factory boy]
version: "1.0"
source: https://docs.pytest.org
---

# pytest

## Fixtures
```python
import pytest

@pytest.fixture
def user():
    return User(id=1, name="Alice", email="alice@example.com")

@pytest.fixture(scope="session")  # created once per test session
def db():
    engine = create_engine("postgresql://test:test@localhost/test")
    Base.metadata.create_all(engine)
    yield engine
    Base.metadata.drop_all(engine)

@pytest.fixture(autouse=True)  # applied to every test in scope
def reset_db(db):
    yield
    with db.connect() as conn:
        conn.execute(text("TRUNCATE users, orders RESTART IDENTITY CASCADE"))
        conn.commit()

# Fixture scopes: function (default) | class | module | session
# Use session for expensive resources; function for state isolation
```

## conftest.py
```python
# conftest.py — shared fixtures, auto-loaded by pytest
# Place at: tests/conftest.py (project-wide) or tests/unit/conftest.py (scoped)

@pytest.fixture(scope="session")
def app():
    from myapp import create_app
    return create_app(testing=True)

@pytest.fixture
def client(app):
    with app.test_client() as c:
        yield c
```

## Parametrize
```python
@pytest.mark.parametrize("email,valid", [
    ("alice@example.com", True),
    ("not-an-email",      False),
    ("",                  False),
    ("a@b.c",             True),
])
def test_email_validation(email, valid):
    assert validate_email(email) == valid

# Parametrize fixture
@pytest.fixture(params=["sqlite", "postgres"])
def db_engine(request):
    return create_engine(URLS[request.param])

# IDs for readable test names
@pytest.mark.parametrize("x,y", [(1,2),(3,4)], ids=["small","large"])
```

## Marks
```python
@pytest.mark.slow
@pytest.mark.integration
@pytest.mark.skip(reason="flaky upstream")
@pytest.mark.skipif(sys.platform == "win32", reason="Linux only")
@pytest.mark.xfail(strict=True)   # expected to fail; fail if it passes

# Run only fast tests:
# pytest -m "not slow"
# pytest -m "unit and not db"
```

## Monkeypatch
```python
def test_send_email(monkeypatch):
    sent = []
    monkeypatch.setattr("myapp.email.send", lambda *a, **kw: sent.append(a))
    trigger_welcome_email(user_id=1)
    assert len(sent) == 1

# Common patches:
monkeypatch.setattr(module, "func", mock_func)
monkeypatch.setenv("STRIPE_KEY", "sk_test_xxx")
monkeypatch.delenv("DEBUG", raising=False)
monkeypatch.setitem(config, "key", "value")
monkeypatch.chdir(tmp_path)          # change working dir
```

## tmp_path and tmp_path_factory
```python
def test_writes_file(tmp_path):
    out = tmp_path / "result.txt"
    write_report(out)
    assert out.read_text() == "expected content"

@pytest.fixture(scope="session")
def shared_dir(tmp_path_factory):
    return tmp_path_factory.mktemp("data")
```

## Async tests (pytest-asyncio)
```python
# pyproject.toml:
# [tool.pytest.ini_options]
# asyncio_mode = "auto"

import pytest

@pytest.mark.asyncio
async def test_fetch_user(async_client):
    response = await async_client.get("/users/1")
    assert response.status_code == 200

@pytest.fixture
async def async_db():
    async with AsyncSession(engine) as session:
        yield session
        await session.rollback()
```

## Useful CLI flags
```bash
pytest -x                    # stop on first failure
pytest -v                    # verbose (show test names)
pytest -k "auth and not slow"  # filter by name
pytest --lf                  # run only last-failed
pytest --tb=short            # shorter tracebacks
pytest -s                    # don't capture stdout (see print())
pytest --co -q               # collect only, don't run
pytest --cov=src --cov-report=term-missing  # coverage
pytest -n 4                  # parallel (pytest-xdist)
```

## pyproject.toml config
```toml
[tool.pytest.ini_options]
testpaths = ["tests"]
asyncio_mode = "auto"
markers = [
    "slow: marks tests as slow",
    "integration: requires external services",
]
filterwarnings = ["error", "ignore::DeprecationWarning:pkg_resources"]

[tool.coverage.run]
source = ["src"]
omit = ["*/migrations/*", "*/tests/*"]

[tool.coverage.report]
fail_under = 80
```

## Rules
- Real DB in integration tests — mocked DB tests miss migration bugs
- `scope="session"` for DB setup; `autouse` fixture for cleanup between tests
- Use `tmp_path` for all file I/O in tests — never hardcode paths
- `monkeypatch` over `unittest.mock.patch` — auto-reverts, no context manager needed
- Name tests `test_<what>_<condition>_<expected>`: `test_login_wrong_password_returns_401`
