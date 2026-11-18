---
name: Scrapling
description: Python web scraping framework built for AI agents — fast HTTP fetchers with TLS fingerprint impersonation, stealth browsers that solve Cloudflare, CSS/XPath/BeautifulSoup-style parsing, Scrapy-like spiders, a CLI, and an MCP server. Use for data acquisition, crawling, and letting an agent extract from live pages.
triggers: [scrapling, web scraping, scrape a website, crawler, spider, beautifulsoup alternative, scrapy alternative, cloudflare bypass, stealth browser, extract data from website, html parsing, mcp scraping]
version: "1.0"
source: https://github.com/D4Vinci/Scrapling
---

# Scrapling Skill

## § RULES
- Respect `robots.txt` and the site's terms of service. The project itself states it is for educational and research purposes.
- Reach for `Fetcher` (plain HTTP) first. Only escalate to `StealthyFetcher` when the page needs JS rendering or is behind anti-bot — browsers are orders of magnitude slower.
- `pip install scrapling` gives you the **parser only**. Importing `scrapling.fetchers` or `scrapling.spiders` without the extra raises `ModuleNotFoundError`.
- Run `scrapling install` after installing the fetchers extra, or no browser is on disk.
- Rate-limit and cache. A spider that hammers a site is a bug, not a feature.

---

## Install

```bash
pip install scrapling                   # parser only
pip install "scrapling[fetchers]"       # + HTTP and browser fetchers
scrapling install                       # download browsers and deps
```

Other extras:

| Extra | Adds |
|---|---|
| `scrapling[ai]` | MCP server |
| `scrapling[shell]` | interactive shell and `extract` CLI |
| `scrapling[rag]` | RAG helpers |
| `scrapling[all]` | everything |

Python 3.10+. Docker image: `docker pull pyd4vinci/scrapling`.

---

## Fetchers — pick the cheapest that works

| Class | What it does | Use when |
|---|---|---|
| `Fetcher` | fast, stealthy HTTP request | static HTML — the default |
| `FetcherSession` | HTTP session, cookies persist | multi-step flows, logins |
| `StealthyFetcher` | full browser (Playwright Chromium or real Chrome) | JS-rendered pages, anti-bot |
| `StealthySession` / `AsyncStealthySession` | persistent browser session | many pages behind one session |

```python
from scrapling.fetchers import Fetcher, FetcherSession, StealthyFetcher

page = Fetcher.get('https://quotes.toscrape.com/')

session = FetcherSession(impersonate='chrome')   # TLS fingerprint impersonation
page = session.get(url)                           # http3=True also supported

page = StealthyFetcher.fetch(url, solve_cloudflare=True)
```

---

## Parsing

Four styles on the same object — use whichever reads best:

```python
page.css('.quote .text::text').getall()        # CSS, ::text pseudo-element
page.xpath('//div[@class="quote"]')            # XPath
page.find_all('div', class_='quote')           # BeautifulSoup-style
page.find_by_text('Albert Einstein', first_match=False)
```

Two things ordinary parsers do not give you:

```python
first_quote.find_similar()      # other elements structurally like this one
```

plus adaptive matching, which relocates an element after the site's markup changes using similarity rather than a brittle selector.

Parse a string with no fetch:

```python
from scrapling.parser import Selector
page = Selector("<html>...</html>")
```

---

## Spiders

```python
from scrapling.spiders import Spider, Response

class QuotesSpider(Spider):
    name = "quotes"
    start_urls = ["https://quotes.toscrape.com/"]
    ...

result = QuotesSpider().start()
result.items.to_json("quotes.json")
```

Pause and resume a long crawl:

```python
QuotesSpider(crawldir="./crawl_data").start()
```

Exports: JSON, JSONL, CSV, XML.

---

## CLI

```bash
pip install "scrapling[shell]"

scrapling shell
scrapling extract get 'https://quotes.toscrape.com/' quotes.md
scrapling extract fetch 'https://quotes.toscrape.com/js/' quotes.md \
  --css-selector '.quote' --wait-selector '.quote' --no-headless
```

`extract` writes `.txt`, `.md`, or `.html`.

---

## MCP server

```bash
pip install "scrapling[ai]"
```

Exposes browsing and extraction as MCP tools so an agent can pull live page data itself. Supports remote browsers over CDP and HTTP transport with authentication. The exact launch command is documented at https://scrapling.readthedocs.io/en/latest/ai/mcp-server.html — check there rather than guessing.

---

## Caveats
- ~104k stars, BSD-3-Clause.
- Benchmarks in the README compare parser speed against Parsel/Scrapy, lxml, PyQuery, Selectolax, MechanicalSoup, and BS4.
- Drop-in Scrapy integration exists if you already have Scrapy spiders.
- Stealth features exist to survive fingerprinting, not to defeat access controls — do not use them to get at content you are not allowed to read.
