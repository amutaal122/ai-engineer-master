---
name: Incident Response
description: Handle production incidents — severity, roles, mitigation order, comms cadence, evidence preservation, and the blameless postmortem. Use when something is broken in production, or when setting up the on-call process before it is.
triggers: [incident, outage, production down, sev1, postmortem, on-call, oncall, pager, rollback, escalation, site down, runbook, blameless]
version: "1.0"
source: community
---

# Incident Response Skill

## § RULES
- Mitigate before you diagnose. Understanding can wait; users cannot.
- One change at a time, announced before it happens, with its effect observed before the next.
- Preserve evidence before restarting anything — a restart that fixes it also destroys the reason.
- Declare early. Standing down after ten minutes costs nothing; declaring late costs the response.
- No postmortem names a person as the cause.

---

## Severity

| Sev | Meaning | Response |
|---|---|---|
| SEV1 | most users blocked, data loss, or breach | page now, all hands, updates every 15 min |
| SEV2 | major feature broken or severe degradation | page, updates every 30 min |
| SEV3 | minor or has a workaround | business hours, ticket |

Set it on **impact**, not on how interesting the bug is. Re-evaluate as you learn — upgrading late is the common failure.

---

## Roles

Say out loud who holds each, even if one person holds several:

- **Commander** — decides, prioritises, runs the loop. Does not debug.
- **Ops** — the only person changing the system.
- **Comms** — status page and stakeholders.
- **Scribe** — timestamped timeline, written live.

The commander debugging is the most common way an incident loses coordination.

---

## Mitigate, in this order

1. **Roll back** the recent deploy
2. **Flip the flag** off
3. **Shift traffic** — failover, drain the bad region
4. **Scale up**, or shed load deliberately
5. Only then: fix forward

"Fix forward" under pressure, untested, into a broken system, is how a SEV2 becomes a SEV1.

---

## Preserve evidence first

Before the restart that makes it go away:

```bash
kubectl logs <pod> --previous > incident-logs.txt
kubectl describe pod <pod>    > incident-pod.txt
# heap/thread dump if the runtime supports it
# screenshot the dashboards for the incident window
```

Metrics age out of retention. Logs roll. Capture the window now, analyse later.

---

## Comms cadence

Post on schedule even with nothing new — silence gets filled with speculation.

```
[HH:MM] Investigating — checkout is failing for some users.
        Next update by HH:MM.
```

State impact and action. **Never** speculate publicly about cause or ETA; you will be quoted on it.

---

## The loop

Every 15–30 minutes, out loud:

1. What do we know?
2. What have we tried, and what did it do?
3. What next, and who is doing it?
4. Has impact changed? Does severity change?

---

## Postmortem

Within a few days, written, shared:

```markdown
## Summary        one paragraph: what broke, for whom, how long
## Impact         users affected, requests failed, revenue/SLO cost
## Timeline       timestamped, detection → mitigation → resolution
## Contributing factors    plural — there is never one cause
## What went well  keep doing these
## What was hard   detection gaps, missing runbooks, bad tooling
## Action items    owner + date, tracked like any other work
```

**Blameless** means asking what made the failure possible and easy, not who typed the command. A person is the last link in a chain the system permitted. Name the chain. Teams that blame individuals get hidden incidents next time.

Two numbers worth tracking across incidents: **time to detect** and **time to mitigate**. Detection is usually the one with the most room.

---

## Caveats
- Action items without an owner and a date do not happen. Cap the list at what will realistically be done.
- A runbook that has never been followed during a drill is untested.
- See the `incident-commander` agent for running one, and `sre-engineer` for the SLOs and alerts that detect it.
