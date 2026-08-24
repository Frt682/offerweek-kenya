# Model routing (Fırat Aktaş stack)

**Researched:** 2026-08-24  
**Scope:** Web-primary routing for the tools Fırat actually pays for. One row per job type. No new products.

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

| Situation | Model (where to run it) | Why | Cost class |
| --- | --- | --- | --- |
| **Cheap plumbing / docs / scout Cloud Agents** | **Composer 2.5** (non-fast) on **Cursor Cloud Agent** | Lowest-priced model in the Cursor Models pool; Cursor positions Composer 2.5 for sustained agent work, instruction following, and repo-grounded tasks. Adequate for READMEs, routing docs, and shallow repo reconnaissance. | **Cursor Models pool** (generous included usage on Pro; see [Cursor Models pricing](https://cursor.com/docs/models-and-pricing#cursor-models)) |
| **Repo / debug** (Cursor Cloud on GitHub repos) | **Claude Sonnet 5** on **Cursor Cloud Agent** | Anthropic markets Sonnet 5 as the default agentic/coding Sonnet tier with 1M context ([model card](https://www.anthropic.com/claude/sonnet)). On LMArena Text (2026-08-24 snapshot), `claude-sonnet-4-6` ranks **#14 Coding** and **#19 Instruction Following** — the nearest verified predecessor in the public board ([LMArena Text](https://arena.ai/leaderboard)). Strong enough for Frt682 repo fixes without Opus spend. | **Other Models — mid tier** (draws Pro’s included Other Models allowance; on-demand stays off) |
| **YouTube Unhurried script** (A1–A2 English; quality over volume) | **GPT-5.5** in **ChatGPT Plus** | Keeps Cursor on-demand disabled for everything except this lane. ChatGPT Plus is already subscribed; script quality is prompt- and revision-driven (simple syntax, short sentences) more than frontier creative rank. LMArena lists `gpt-5.5` at **#23 Overall**, **#27 Instruction Following** ([LMArena Text](https://arena.ai/leaderboard)) — sufficient when the brief enforces A1–A2. Audio is **Kokoro + FFmpeg**, not the LLM. **Exception:** if a daily long/short script stalls, enable Cursor on-demand once and use **Claude Sonnet 5** — then turn on-demand off again. | **ChatGPT Plus subscription (included)**; optional **Other Models on-demand** only for the daily YouTube exception |
| **Kenya OfferWeek `data.js` / static PWA edits** | **Grok 4.5** via **Grok Bot team** (or manual edit) | Weekly workflow is intentionally manual ([`SIZIN-ISINIZ.md`](../SIZIN-ISINIZ.md): no scraper, no app rewrites). For a stuck date string, filename, or JSON entry, Grok Bot answers in-chat without opening Cursor. Vercel redeploys from GitHub; model never touches live HTML/CSS beyond what you paste. | **Grok Bot team subscription (included)** |
| **Creative book prose** (Book Writer romantasy) | **Claude Fable 5** in **Book Writer**; escalate to **Claude Opus 5** only if a chapter fails twice | LMArena Text (2026-08-24): `claude-fable-5` is **#1 Creative Writing** and **#1 Overall**; `claude-opus-5-high` is only **#10 Creative Writing** ([LMArena Text](https://arena.ai/leaderboard)). Fable covers romantasy voice without defaulting to Opus. Book Writer owns drafts; Emanet/Play Books stays untouched. | **Other Models — premium tier** (Fable 5 / Opus 5 rates in [Other Models pricing](https://cursor.com/docs/models-and-pricing#other-models); billed through Book Writer’s backend, not OfferWeek) |
| **Translation** (TR↔EN; Kenya English UI copy) | **Gemini 3.7 Flash** in **Cursor** for shipped UI strings; **LM Studio** local OSS for bulk TR↔EN drafts | Kenya UI needs clear, simple English — not literary prose. LMArena: `gemini-3.7-flash-high` is **#10 Instruction Following**, **#3 Creative Writing** ([LMArena Text](https://arena.ai/leaderboard)). Cursor lists Gemini 3.7 Flash in the low end of Other Models ([pricing table](https://cursor.com/docs/models-and-pricing#model-pricing)). LM Studio on the Lenovo is valid for offline first-pass translation at zero marginal cost ([LM Studio docs](https://lmstudio.ai/docs)). | **Other Models — low tier** or **free / local (LM Studio)** |
| **Long-context** (full manuscript, long agent transcripts, big diffs) | **Gemini 3.1 Pro** in **Cursor** | LMArena: `gemini-3.1-pro-preview` is **#9 Longer Query**, **#14 Overall** ([LMArena Text](https://arena.ai/leaderboard)). Cursor documents Gemini 3.1 Pro with extended context at standard per-token rates ([model pricing](https://cursor.com/docs/models-and-pricing#model-pricing)). Beats burning Opus for read-the-whole-thing tasks. | **Other Models — mid tier** |
| **Tool-calling / agentic** (multi-step Cloud Agent with MCP/tools) | **Claude Opus 5 (High)** on **Cursor Cloud Agent** | LMArena Agent board (2026-08-24): **#1** `Claude Opus 5 (High)` at 12.47% win rate; Anthropic positions Opus 5 for production agents ([Opus model card](https://www.anthropic.com/claude/opus)). Use when Composer/Sonnet loops on tool errors. | **Other Models — premium tier** (Opus 5 in [Other Models pricing](https://cursor.com/docs/models-and-pricing#model-pricing); consumes Pro allowance faster — still keep on-demand off unless YouTube exception) |

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
| Anthropic — Claude Opus | https://www.anthropic.com/claude/opus | Opus 5 agent positioning |
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
