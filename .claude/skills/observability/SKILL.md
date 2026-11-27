---
name: Observability
description: Instrument services with OpenTelemetry — traces, metrics, structured logs, correlation IDs, sampling, SLO measurement, and alerting that pages on symptoms. Covers AI-specific signals like token spend and model latency. Use when building or operating anything that runs in production.
triggers: [observability, opentelemetry, otel, tracing, distributed tracing, structured logging, metrics, prometheus, grafana, slo, sli, alerting, correlation id, instrumentation, span]
version: "1.0"
source: community
---

# Observability Skill

## § RULES
- Logs are structured JSON with a trace ID on every line. Unstructured logs are not searchable at the moment you need them.
- Alert on user-visible symptoms; put causes on dashboards. An alert nobody can act on trains people to ignore alerts.
- Never log secrets, tokens, full request bodies, or PII. Redact at the logger, not at the reviewer.
- Instrument the boundaries first — inbound requests, outbound calls, queue operations, DB queries. Internals later.
- Use histograms for latency and read p95/p99. An average latency hides every problem you care about.

---

## Three signals, three jobs

| Signal | Answers | Cost |
|---|---|---|
| Metrics | is something wrong, and how bad | cheap, aggregate |
| Traces | where in the flow it is wrong | sampled |
| Logs | what exactly happened | expensive at volume |

Start from a metric, narrow with a trace, confirm with a log. If you cannot follow that path, the instrumentation is incomplete.

---

## OpenTelemetry setup

```python
from opentelemetry import trace, metrics
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter

provider = TracerProvider()
provider.add_span_processor(BatchSpanProcessor(OTLPSpanExporter()))
trace.set_tracer_provider(provider)

tracer = trace.get_tracer(__name__)

with tracer.start_as_current_span("process_order") as span:
    span.set_attribute("order.id", order_id)
    span.set_attribute("order.total_cents", total)
    ...
```

Auto-instrumentation covers your HTTP framework, DB driver and HTTP client — enable it before writing manual spans.

Record failures properly so they are queryable:

```python
except Exception as e:
    span.record_exception(e)
    span.set_status(Status(StatusCode.ERROR))
    raise
```

---

## Structured logs, correlated

```python
logger.info("order.created", extra={
    "order_id": order.id,
    "user_id": user.id,
    "total_cents": order.total,
    "trace_id": format(span.get_span_context().trace_id, "032x"),
})
```

Rules that pay for themselves:
- Event names as stable identifiers (`order.created`), not interpolated prose
- Trace ID on every line, so a log search jumps straight into the trace
- One event per meaningful state change, not one per function call
- Log levels mean something: `ERROR` = a human must look; `WARN` = degraded but handled; `INFO` = business events

---

## Metrics that matter

The four golden signals, per service:

```python
meter = metrics.get_meter(__name__)
requests  = meter.create_counter("http.server.requests")
latency   = meter.create_histogram("http.server.duration", unit="ms")
errors    = meter.create_counter("http.server.errors")
inflight  = meter.create_up_down_counter("http.server.active_requests")
```

Keep cardinality under control. A label with user ID or request ID will multiply your series count into an outage of its own — labels are for bounded sets: route, method, status class, region.

---

## AI-specific signals

Standard web metrics miss the things that actually break LLM systems:

| Metric | Why |
|---|---|
| tokens in / out per request | cost driver, and your real rate limit |
| cost per request, per feature | the number that ends up in a budget meeting |
| time to first token | what the user perceives, not total duration |
| model, prompt version | every number is meaningless without these labels |
| refusal / safety-stop rate | silent product failure |
| tool-call error rate | agent loops fail here first |
| retry and fallback counts | a provider degrading quietly |

Put the prompt version on the span. Without it you cannot attribute a quality regression to a prompt change.

---

## Sampling

Head sampling at 1–10% is normal at volume. Always keep:
- 100% of errors
- 100% of slow requests (tail-based, above your p99)
- a deterministic sample keyed on trace ID so a trace is complete or absent, never half-recorded

---

## Alerting

Page on burn rate against an SLO, not on raw thresholds:

```yaml
- alert: HighErrorBudgetBurn
  expr: |
    (sum(rate(http_server_errors[5m])) / sum(rate(http_server_requests[5m]))) > (14.4 * 0.001)
  for: 2m
  annotations:
    runbook: https://…/runbooks/high-error-rate
```

Fast burn pages; slow burn files a ticket. Every alert carries a runbook link.

---

## Caveats
- Instrumentation has a cost — batch exports, never block the request path on the collector.
- A dashboard nobody opens during an incident is decoration; build dashboards from the runbook's questions.
- Trace context must propagate across queues too, or async work becomes invisible.
- See `research-17-observability` for LLM-tracing tools specifically (LangSmith, Phoenix).
