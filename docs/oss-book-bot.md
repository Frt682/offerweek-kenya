# OSS book bot (Grok-quota fallback)

Parking note: this file only records the later handoff tool. It does not change the OfferWeek Kenya site. Do not run the fluency loop from this repo.

Checked against GitHub on 24 Aug 2026. $0. No SaaS writing tools. No new paid API key.

## 1. The pick: Aider

**Aider** is the one bot for the later *Signed in Silver* fluency loop. It is a terminal agent that reads and surgically edits files in a git repo, commits each change, and talks to a local Ollama model with no API key. That matches the job: score one chapter markdown file, patch only failing spans, re-test, then the next chapter. On a 15 GB RAM CPU box it stays light (no Docker, no IDE). OpenHands is too heavy next to a local model. Goose and Cline need reliable tool-calling that 7B–14B local models do not have. Continue is read-only after the Cursor acquisition. SWE-agent is a GitHub-issue researcher. Open WebUI is a chat window. llama.cpp is only inference. Aider’s SEARCH/REPLACE edit format is the piece that still works when the model is small and local.

## 2. License and GitHub

- License: **Apache License 2.0**
- GitHub: <https://github.com/Aider-AI/aider>
- Site: <https://aider.chat/>
- Last repo push at check: **22 May 2026** (mature; slower than Goose/Cline/OpenHands, still the right tool for file patches)

## 3. Install ($0) — Linux and Windows

Install **Ollama** (local model runtime) and **Aider** (the agent). Both are free. Do this on the Linux box and/or the Windows Lenovo, not in this cloud run.

### Linux

```bash
# Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Aider (installs its own Python 3.12 if needed)
curl -LsSf https://aider.chat/install.sh | sh

# Local model (see section 4)
ollama pull qwen2.5:7b

# Point Aider at local Ollama
export OLLAMA_API_BASE=http://127.0.0.1:11434
```

Start Ollama with a usable context (default 2k silently drops chapter text):

```bash
OLLAMA_CONTEXT_LENGTH=8192 ollama serve
```

In another terminal, from the **manuscript** git repo (not this Kenya catalogue repo):

```bash
cd /path/to/signed-in-silver
aider --model ollama_chat/qwen2.5:7b
```

### Windows (Lenovo)

```powershell
# Ollama
winget install Ollama.Ollama

# Aider
powershell -ExecutionPolicy ByPass -c "irm https://aider.chat/install.ps1 | iex"

# Local model (PowerShell after Ollama is on PATH; restart the shell if needed)
ollama pull qwen2.5:7b

setx OLLAMA_API_BASE http://127.0.0.1:11434
```

Restart the shell after `setx`. Then:

```powershell
cd \path\to\signed-in-silver
$env:OLLAMA_CONTEXT_LENGTH = "8192"
# If ollama serve is not already running as a service:
# ollama serve
aider --model ollama_chat/qwen2.5:7b
```

Optional same-stack install if `uv` is already present:

```bash
uv tool install --force --python python3.12 --with pip aider-chat@latest
```

No paid account. No Aider Cloud. No OpenAI/Anthropic key. If `aider` is missing from PATH, open a new terminal or run `python -m aider`.

## 4. Local model (15 GB RAM, CPU, no GPU guaranteed)

**One tag: `qwen2.5:7b`**

- Size on disk / RAM: about **4.7 GB** (Ollama Q4)
- Fits 15 GB system RAM with OS + Ollama + Aider + an 8k chapter context
- Apache 2.0 weights (the 7B checkpoint; not the Qwen-licensed 3B/72B)
- Instruct-tuned, so it can follow a fail-closed F1–F11 rubric better than a coder-only tag

Do **not** pull `qwen2.5:14b` (9.0 GB) on this box as the default. Weights plus KV cache plus Windows/Linux desktop often swap or OOM. If a later machine has more RAM, the same Aider SOP can switch to `ollama_chat/qwen2.5:14b` without changing the loop.

GGUF equivalent if skipping Ollama and using llama.cpp only as the server: `Qwen2.5-7B-Instruct-Q4_K_M.gguf`. Prefer the Ollama tag above so Aider’s `ollama_chat/` path just works.

## 5. What it cannot do

- It is not a novelist. A 7B CPU model will miss craft that Gemini 3.7 Flash High (or Grok) would catch. Treat F1–F11 as a gate, then read the patched spans yourself.
- CPU inference is slow (often a few tokens/s). One chapter score → patch → re-score can take a long sitting. That is expected. It is still $0.
- It will not run the 17-chapter loop unattended with frontier quality. `--message` scripts one step; a human still advances chapter by chapter and stops on a messy patch (`aider /undo` or `git revert`).
- It does not replace Sudowrite-class “write the book for me.” Scope is score / surgical patch / re-score only.
- Last upstream push was May 2026. If Aider install breaks on a future Python, pin `aider-chat` and keep using it; do not jump to a paid writing SaaS.
- It must not be pointed at this OfferWeek repo. Live site files (`index.html`, `app.js`, `data.js`, `styles.css`, Kenya catalogue images) stay out of the novel loop.
- Never Opus. Never a new paid API key. If Gemini 3.7 Flash High is not already available at $0, stay on `qwen2.5:7b`.

## 6. Later handoff SOP (do not execute in this PR)

Job: adult English romantasy *Signed in Silver*, 17 chapters. Fluency gates **F1–F11, fail-closed**. Score one chapter at a time. Patch only failing spans. Re-test. Then the next chapter.

**Do not run this SOP now.** It belongs in a separate manuscript git repo of chapter markdown files.

### 6.1 Layout

```
signed-in-silver/          # its own git repo
  rubric/f1-f11.md         # gate definitions (scene turn, hook/prompt, dump,
                           # filters, cadence, mix/white space, POV/tense,
                           # name salad, jump orientation, baton+braid,
                           # expand-padding)
  chapters/ch-01.md … ch-17.md
  scores/ch-01-score.md    # written during the loop; not the novel
```

Keep only **one chapter file** in Aider’s editable set per pass. Put `rubric/f1-f11.md` in as **read-only**.

### 6.2 Model order

1. **Gemini 3.7 Flash High** if it is already available at $0 (no new paid key). Example: `aider --model gemini/gemini-3.7-flash` only after confirming the exact $0 model id you already have.
2. Else **local:** `aider --model ollama_chat/qwen2.5:7b`
3. **Never Opus.** Never Claude paid. Never Sudowrite, NovelCrafter, BookFoundry, DraftZero, Inkfluence, or any writing SaaS.

### 6.3 Per-chapter loop (chapter N)

**A. Score (no edits)**

```bash
OLLAMA_CONTEXT_LENGTH=8192 ollama serve   # if not already running

aider --model ollama_chat/qwen2.5:7b \
  --read rubric/f1-f11.md \
  --read chapters/ch-NN.md \
  --yes-always \
  --no-auto-commits \
  --message-file prompts/score-ch-NN.txt
```

`prompts/score-ch-NN.txt` must tell the model:

- Score **only** `chapters/ch-NN.md` against F1–F11.
- Fail-closed: a gate fails unless the chapter clearly passes.
- For each gate: PASS or FAIL, one-line reason, and **verbatim failing spans** (quote the sentences). If PASS, no span.
- Write the report to `scores/ch-NN-score.md`. Do not rewrite the chapter in this step.
- Stop. Do not start chapter N+1.

If any gate is FAIL, the chapter has not passed. Do not move on.

**B. Patch (failing spans only)**

```bash
aider --model ollama_chat/qwen2.5:7b \
  --read rubric/f1-f11.md \
  --read scores/ch-NN-score.md \
  --file chapters/ch-NN.md \
  --yes-always \
  --message-file prompts/patch-ch-NN.txt
```

`prompts/patch-ch-NN.txt` must tell the model:

- Edit **only** `chapters/ch-NN.md`.
- Change **only** the quoted FAIL spans. Do not restyle passing paragraphs. Do not add padding. Do not rename characters. Do not expand the chapter.
- Keep POV, tense, names, and scene order.
- If a span cannot be fixed without a plot change, leave it and mark it `HUMAN` in the score file.

Aider will git-commit the patch. If the diff touches passing prose, `/undo` (or `git revert`) and patch again with a tighter prompt.

**C. Re-score**

Repeat step A on the same chapter. Replace `scores/ch-NN-score.md`.

- All F1–F11 PASS → go to chapter N+1.
- Any FAIL → repeat B then C. Cap at a small number of patch rounds (for example 3), then human-edit the remaining spans. Do not infinite-loop a 7B model.

**D. Next chapter**

Only after chapter N is all-PASS (or human-accepted). Never score two chapters in one Aider session. Never feed the whole book as editable files.

### 6.4 Fail-closed meaning

A missing, vague, or “probably fine” verdict is a **FAIL**. The local model must quote a span for every FAIL. No quote means the gate is not evidenced → still FAIL → no advance.

### 6.5 Gates (names only; full tests live in `rubric/f1-f11.md`)

F1 scene turn · F2 hook/prompt · F3 dump · F4 filters · F5 cadence · F6 mix/white space · F7 POV/tense · F8 name salad · F9 jump orientation · F10 baton+braid · F11 expand-padding.

### 6.6 When Grok quota returns

Stay on this SOP for remaining chapters, or resume Grok for scoring and keep Aider only for local patches. Do not mix two different patches into the same chapter without a re-score.

---

## Research snapshot (24 Aug 2026)

| Tool | License | Last push | Why not the pick |
| --- | --- | --- | --- |
| **Aider** | Apache-2.0 | 22 May 2026 | **Pick** — surgical file edits + Ollama, light enough for 15 GB RAM |
| OpenHands | MIT | 24 Aug 2026 | Docker/runtime too heavy beside a local 7B–14B |
| Continue | Apache-2.0 | repo marked unmaintained / Cursor acquisition | Do not depend on a retired project |
| Block Goose ([aaif-goose/goose](https://github.com/aaif-goose/goose)) | Apache-2.0 | 24 Aug 2026 | Real agent, but 7B–14B tool-calling is unreliable |
| Cline | Apache-2.0 | 24 Aug 2026 | IDE-first; same local tool-call problem |
| SWE-agent | MIT | 17 Aug 2026 | GitHub-issue solver, not a chapter fluency loop |
| Open WebUI | SPDX “Other” | 24 Aug 2026 | Chat UI; it does not patch markdown files |
| llama.cpp | MIT | 24 Aug 2026 | Inference engine, not an agent |

Rejected by policy regardless of license: Sudowrite, NovelCrafter, BookFoundry, DraftZero, Inkfluence, SuperGrok Plus, any paid writing SaaS, anything that needs a new paid API key.
