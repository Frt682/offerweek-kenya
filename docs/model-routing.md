# Model routing (Fırat Aktaş stack)

**Researched:** 2026-08-24 (LMArena snapshot re-fetched 2026-08-24)  
**Scope:** Web-primary routing for the tools Fırat actually pays for. One row per job type. No new products.

**Fırat lock:** LMArena **#2 and #3** are the cheaper defaults for each row’s category. **#1 is escalate-if-stuck only — never the default.** Cloud/system agents default to **Composer / Grok / Sonnet**; cheap scouts stay **Composer 2.5**. **CoS lock (book prose):** default is **`gemini-3.7-flash-high`** (CW #3) — not Fable, not Opus.

## Stack constraints (fixed)

| Asset | Role |
| --- | --- |
| **Cursor Pro** | Primary IDE + Cloud Agents. **On-demand off** except the YouTube daily script job. |
| **ChatGPT Plus** | General chat, Unhurried script drafting. |
| **Grok Bot team** | Quick Q&A, light edits when Cursor is closed. |
| **GitHub (`Frt682`)** | Repo hosting for Cloud Agents and OfferWeek. |
| **Vercel** | Static deploy for OfferWeek Kenya PWA. |
| **Unhurried pipeline** | Kokoro TTS + FFmpeg + `youtube_upload.py`. **Never schedule past `publishAt`.** |
| **LM Studio (Lenovo)** | Local OSS models; zero marginal cost. |
| **Book Writer** | Owns romantasy book drafts. |
| **Emanet / Play Books** | Pending payment — do not touch Partner Center. |
| **Kenya OfferWeek** | Manual weekly covers into `data.js` / `img/`. **No scraper.** |

## Routing table

LMArena ranks from [Text Arena](https://arena.ai/leaderboard) unless noted as **Agent** board. Snapshot date: **2026-08-24**.

| Situation | Stack default (run first) | Cheaper LMArena defaults (#2 · #3) | Escalate if stuck (#1) | Why | Cost class |
| --- | --- | --- | --- | --- | --- |
| **Cheap plumbing / docs / scout Cloud Agents** | **Composer 2.5** → **Grok 4.5** on **Cursor Cloud Agent** | **Instruction Following #2** `claude-fable-5` · **#3** `claude-opus-4-7-high` | **IF #1** `claude-opus-4-6-high` | Scouts/docs need brief adherence, not frontier spend. Composer 2.5 is cheapest in the Cursor Models pool ([Composer 2.5 blog](https://cursor.com/blog/composer-2-5)). Arena #2/#3 are the non-#1 instruction-following tier if Composer/Grok loop. | **Cursor Models pool (included)**; arena #2/#3 → **Other Models — premium tier**; #1 → **Other Models — premium tier** |
| **Repo / debug** (Cursor Cloud on GitHub repos) | **Claude Sonnet 5** on **Cursor Cloud Agent** | **Coding #2** `claude-opus-4-6-high` · **#3** `claude-fable-5` | **Coding #1** `claude-opus-4-7-high` | Sonnet 5 is the stack ceiling for system Cloud Agents ([Sonnet model card](https://www.anthropic.com/claude/sonnet)). Arena coding #2/#3 sit below #1 on the 2026-08-24 board; use only after Sonnet stalls. | **Other Models — mid tier** (Sonnet 5); arena #2/#3/#1 → **Other Models — premium tier** |
| **YouTube Unhurried script** (A1–A2 English; quality over volume) | **GPT-5.5** in **ChatGPT Plus** | **Creative Writing #2** `claude-opus-4-6-high` · **#3** `gemini-3.7-flash-high` | **CW #1** `claude-fable-5` | Plus keeps Cursor on-demand off. A1–A2 is constraint-driven; arena CW #3 (`gemini-3.7-flash-high`) is the cheaper arena default before any #1 Fable spend. Daily exception: enable Cursor on-demand once for **#3** in Cursor, then off. Audio = Kokoro + FFmpeg. | **ChatGPT Plus subscription (included)**; arena #3 → **Other Models — low tier**; #2/#1 → **Other Models — premium tier**; optional **Other Models on-demand** for daily exception only |
| **Kenya OfferWeek `data.js` / static PWA edits** | **Grok 4.5** via **Grok Bot team** (or manual edit) | **Instruction Following #2** `claude-fable-5` · **#3** `claude-opus-4-7-high` | **IF #1** `claude-opus-4-6-high` | Weekly flow stays manual ([`SIZIN-ISINIZ.md`](../SIZIN-ISINIZ.md): no scraper). Grok answers stuck JSON/date strings without opening Cursor. Arena #2/#3 only if Grok/manual fails. | **Grok Bot team subscription (included)**; arena #2/#3/#1 → **Other Models — premium tier** |
| **Creative book prose** (Book Writer romantasy) | **Book Writer** with **`gemini-3.7-flash-high`** | **Creative Writing #3 (default)** `gemini-3.7-flash-high` | **CW #2** `claude-opus-4-6-high` · **CW #1** `claude-fable-5` | CoS lock: CW #3 is the book default on the 2026-08-24 board. **Fable and Opus are escalate-if-stuck only** — never the starting model. Book Writer owns drafts; Emanet untouched. | **Other Models — low tier** (default); escalate #2/#1 → **Other Models — premium tier** |
| **Translation** (TR↔EN; Kenya English UI copy) | **Gemini 3.7 Flash** in **Cursor**; bulk drafts in **LM Studio** | **Instruction Following #2** `claude-fable-5` · **#3** `claude-opus-4-7-high` | **IF #1** `claude-opus-4-6-high` | Kenya UI needs plain English, not literary rank. Gemini 3.7 Flash + LM Studio beat arena #2/#3 on cost for routine strings ([LM Studio docs](https://lmstudio.ai/docs)). Arena #2/#3 only for stubborn phrasing. | **Other Models — low tier** or **free / local (LM Studio)**; arena #2/#3/#1 → **Other Models — premium tier** |
| **Long-context** (full manuscript, long agent transcripts, big diffs) | **Gemini 3.1 Pro** in **Cursor** | **Longer Query #2** `claude-fable-5` · **#3** `claude-opus-4-6` | **LQ #1** `claude-opus-4-6-high` | Gemini 3.1 Pro covers long reads at mid-tier Cursor rates ([model pricing](https://cursor.com/docs/models-and-pricing#model-pricing)). Arena longer-query #2/#3 before burning #1. | **Other Models — mid tier** (Gemini 3.1 Pro); arena #2/#3/#1 → **Other Models — premium tier** |
| **Tool-calling / agentic** (multi-step Cloud Agent with MCP/tools) | **Composer 2.5** → **Grok 4.5** → **Claude Sonnet 5** on **Cursor Cloud Agent** | **Agent board #2** `Claude Opus 5 (Max)` · **#3** `Claude Fable 5 (High)` | **Agent #1** `Claude Opus 5 (High)` | **Opus is not the default.** System agents stay Composer/Grok/Sonnet per stack lock. Agent-board #2/#3 ([LMArena Agent](https://arena.ai/leaderboard)) only after the three-tier stack loop fails. | **Cursor Models pool (included)** then **Other Models — mid tier** (Sonnet 5); arena #2/#3/#1 → **Other Models — premium tier** |

## LMArena snapshot reference (2026-08-24)

Extracted from [arena.ai/leaderboard](https://arena.ai/leaderboard) Text + Agent boards.

| Category | #1 (escalate only) | #2 (default) | #3 (default) |
| --- | --- | --- | --- |
| Instruction Following | `claude-opus-4-6-high` | `claude-fable-5` | `claude-opus-4-7-high` |
| Coding | `claude-opus-4-7-high` | `claude-opus-4-6-high` | `claude-fable-5` |
| Creative Writing | `claude-fable-5` | `claude-opus-4-6-high` | `gemini-3.7-flash-high` |
| Longer Query | `claude-opus-4-6-high` | `claude-fable-5` | `claude-opus-4-6` |
| Agent | `Claude Opus 5 (High)` | `Claude Opus 5 (Max)` | `Claude Fable 5 (High)` |

## Cost-class legend

Aligned with [Cursor models & pricing](https://cursor.com/docs/models-and-pricing) and [Cursor pricing](https://cursor.com/pricing). **Do not invent dollar amounts** beyond those pages.

| Cost class | Meaning |
| --- | --- |
| **Cursor Models pool (included)** | Composer 2.5, Grok 4.6, Grok 4.5 — generous included usage on Pro. |
| **Other Models — low tier** | Cheapest third-party models in Cursor’s Other Models table (e.g. GPT-5 Mini, Gemini 3.7 Flash). |
| **Other Models — mid tier** | Workhorse third-party models (e.g. Claude Sonnet 5, Gemini 3.1 Pro, GPT-5.4). |
| **Other Models — premium tier** | Frontier third-party models (e.g. Claude Opus 5, Claude Fable 5, GPT-5.6 Sol). |
| **Other Models on-demand** | Pay-as-you-go after included allowance — **only for the YouTube daily script exception**. |
| **ChatGPT Plus subscription (included)** | Flat monthly Plus fee; no per-token metering in this table. |
| **Grok Bot team subscription (included)** | Team Grok access per Cursor Teams/Grok Bot entitlements. |
| **Free / local (LM Studio)** | OSS weights on Lenovo; electricity only. |

## Sources (primary, fetched 2026-08-24)

| Source | URL | Used for |
| --- | --- | --- |
| Cursor — Models & pricing | https://cursor.com/docs/models-and-pricing | Cost classes, model names, two-pool billing |
| Cursor — Pricing | https://cursor.com/pricing | Pro plan capabilities, Grok/Cloud Agent inclusion |
| Cursor — Composer 2.5 | https://cursor.com/blog/composer-2-5 | Composer 2.5 agent positioning |
| Anthropic — Claude Sonnet | https://www.anthropic.com/claude/sonnet | Sonnet 5 agentic/coding positioning, 1M context |
| Anthropic — Claude Opus | https://www.anthropic.com/claude/opus | Opus 5 agent positioning (escalate tier only) |
| LMArena (formerly LMSYS Chatbot Arena) | https://arena.ai/leaderboard | Text + Agent leaderboard ranks (2026-08-24 snapshot) |
| LM Studio docs | https://lmstudio.ai/docs | Local OSS inference |
| OpenAI — GPT-5 index | https://openai.com/index/gpt-5/ | GPT-5 family reference (GPT-5 Mini / GPT-5.5 lineage) |
| Google — Gemini API docs | https://ai.google.dev/gemini-api/docs | Gemini 3.x model family reference |

### UNVERIFIED / not fetched (timeouts on 2026-08-24)

- https://developers.openai.com/api/docs/models/gpt-5.4 — GPT-5.4 agentic claims not cited directly; routing uses LMArena + Cursor pricing instead.
- https://openai.com/index/previewing-gpt-5-6-sol/ — GPT-5.6 Sol family not used in default rows.

## Explicit non-recommendations

- **SuperGrok Plus** — not in stack; not recommended.
- **Kenya scraper agents** — out of scope; manual weekly covers only.
- **Second YouTube channel / restore / upload calendar changes** — Unhurried English podcast only; pipeline constraints unchanged.
- **Partner Center / Emanet Play Books** — pending payment; no action.
- **LMArena #1 as default** — Fable, Opus 5 (High), and category #1 models are escalate-only across all rows.
- **Fable / Opus as book-prose default** — CoS lock: start on `gemini-3.7-flash-high` (CW #3) only.
