# Systems scout — three live jobs

Scout date: 24 August 2026. This file is documentation only. It does not change the live static PWA (`index.html`, `data.js`, `app.js`, `img/`, styles). It does not scrape retailer sites, rotate YouTube OAuth tokens, publish Google Cloud Console changes, or touch Google Play Partner Center.

**Hypothesis (kept, not discarded):** the bottleneck is input quality — missing official Kenya weekly posters, and Unhurried English’s schedule / OAuth — not a missing SaaS product. No KEEP below is a new product, a 10-country rollout, or a scraper.

Paid tools are listed only in REJECT. Free/OSS already covers every job that software can cover. The book listing is waiting on Google payment, which no drafting SaaS replaces.

---

## The three jobs

### 1) OfferWeek Kenya — weekly supermarket catalogues (not delivery)

Live site: [https://offerweek-kenya.vercel.app](https://offerweek-kenya.vercel.app). Stack: static HTML/JS PWA on Vercel. Not Next.js. No catalogue API.

Monday human path (already documented in `SIZIN-ISINIZ.md`): open official promo pages, save **this week’s** cover, put it in `img/`, edit `data.js`. Vercel deploys from git.

`app.js` already renders empty Latest as `No catalogues this week.` when `APP_DATA.catalogs` filters to zero rows.

This is **in-store weekly posters**, not Glovo / Jumia Food / other delivery menus.

**Chief of Staff lock (document only — do not implement in this PR):** if a chain has no official weekly poster, use that empty-state instead of recycled “This Week at X” JPEGs or mixed-store `pages[]`. Current `data.js` shows the anti-pattern (same `img/naivas.jpg` reused across weeks; `nv-1.pages` includes `img/quickmart.jpg`). That is input quality, not a missing aggregator.

### 2) Unhurried English YouTube (`@ListenUnhurried`)

This **is** the channel work: one long at 18:00 and one Short at 18:10, `Europe/Istanbul`, every day. No second language. No second channel.

Existing pipeline (operator fact; `https://github.com/Frt682/unhurried-english` returned 404 from this environment, so the repo layout is not independently verified here):

- Kokoro TTS (Apache-2.0) already in that repo
- FFmpeg stills muxed with that audio
- `youtube_upload.py` with `status.publishAt`
- never pass a `publishAt` that is already in the past

OAuth consent screen is Google **Testing**. Google’s OAuth overview states: a project with external user type and publishing status Testing is issued a refresh token expiring in 7 days (except a small OpenID-only subset). Source: [Using OAuth 2.0 to Access Google APIs](https://developers.google.com/identity/protocols/oauth2).

`videos.update` recently returned HTTP 403 `ACCESS_TOKEN_SCOPE_INSUFFICIENT`. Google documents that `videos.update` requires at least one of `youtubepartner`, `youtube`, or `youtube.force-ssl`. `videos.insert` also accepts `youtube.upload`, which is **not** listed for `videos.update`. A token that can upload can still fail update. Sources: [Videos: update](https://developers.google.com/youtube/v3/docs/videos/update), [Videos: insert](https://developers.google.com/youtube/v3/docs/videos/insert). Same error reason is defined as “the OAuth 2.0 access token doesn’t have the required scopes,” commonly from reusing a token minted with a different scope set: [Google Ads API common errors](https://developers.google.com/google-ads/api/docs/get-started/common-errors) (`google.rpc.ErrorInfo` reason `ACCESS_TOKEN_SCOPE_INSUFFICIENT`). This scout does **not** rotate tokens or publish the consent screen.

### 3) Book pipeline

Book Writer owns drafts. **Emanet** is a Google Play Books listing pending Google payment. Google’s Partner Center help: “Go to the Payment Center to add a payment profile. … This step is required in order to sell books on Google Play.” Source: [Configure sales and payment settings](https://support.google.com/books/partner/answer/3316361). Do not touch Partner Center in this work. No KEEP tool is added for this job: the gate is payment setup, not a drafting app.

---

## REJECT (5)

Viral / X-style tools that do not attach. One reason each.

### 1. Apify supermarket / grocery scrapers

**Why it does not attach to Kenya:** this job is an official weekly **poster** dropped into `img/` + `data.js` on a static PWA. Apify Store actors such as the [Carrefour MAF Grocery Scraper](https://apify.com/blackfalcondata/carrefour-maf-scraper/api) describe live **product** price/availability JSON across MAF markets, not Kenya A4 catalogue covers. Retailer scraping is out of scope for this stack. Apify’s own pricing is usage-metered (free plan includes $5/month then **blocks** until the next cycle; Starter is $29/month). Source: [apify.com/pricing](https://apify.com/pricing).

### 2. Flipp

**Why it does not attach to Kenya:** Flipp is a North American weekly-ad / flyer network. Its corporate about page: “Founded in 2007, Flipp has been helping the largest retailers and brands in **North America** transform their digital merchandising strategy.” Source: [corp.flipp.com/about-us](https://corp.flipp.com/about-us/). Naivas, Quickmart, Chandarana Foodplus, Cleanshelf, and Eastmatt are not that market.

### 3. ElevenLabs

**Why it does not attach to Unhurried English:** the channel already has Kokoro (Apache-2.0) in-repo. ElevenLabs is a metered cloud TTS product. Official pricing: Free $0 / 10k credits per month; Starter $6/month and up; “Commercial License” is listed from Starter, not Free; paid plans accept Credit Card, Apple Pay, and Google Pay. Source: [elevenlabs.io/pricing](https://elevenlabs.io/pricing). That is a paid voice API, not a missing piece of this pipeline.

### 4. OpusClip (Opus Pro)

**Why it does not attach to Unhurried English:** OpusClip’s product is AI-clipping long-form video into Shorts. Official site: new users get a 7-day Pro trial, then a free-forever plan with 60 processing minutes/month, or paid Starter/Pro. Source: [opus.pro](https://www.opus.pro/) and [opus.pro/pricing](https://www.opus.pro/pricing). Unhurried Shorts are generated from Kokoro + FFmpeg stills on a clock (`publishAt` 18:10), not recut from the long. Clipping SaaS does not mint YouTube OAuth scopes or stop a past `publishAt`.

### 5. SuperGrok Plus

**Why it does not attach to any of the three jobs:** it is a paid Grok usage tier on [x.ai/pricing](https://x.ai/pricing) (this environment’s live fetch of that URL timed out; the public pricing page lists SuperGrok Plus as a paid plan above SuperGrok). Extra chat/video quota does not produce an official Kenya poster, does not re-consent `videos.update` scopes, and does not complete Play Books payment. Do not buy or recommend it for these jobs.

---

## KEEP (3)

OSS / already-on-this-stack only. No paid KEEP. Book job: **no KEEP** — Book Writer already owns drafts; Emanet waits on Google payment.

### 1. Monday official-poster ingest (this repo)

**What it is:** the existing human + git workflow: official chain poster → `img/` → `data.js` → Vercel. Not a third-party product.

**Job:** OfferWeek Kenya catalogues.

**Exact apply steps on this stack:**

1. Each Monday, open only official promo pages (starting set in `SIZIN-ISINIZ.md`: Naivas, Carrefour Kenya, Quickmart, Chandarana). Do not scrape; do not use delivery apps.
2. If that chain published **this week’s** official poster: save that file under `img/` and point that store’s `cover` and every `pages[]` entry at **that chain’s files only**.
3. If that chain has **no** official weekly poster: omit or remove that catalogue row so Latest can show `No catalogues this week.` Do **not** recycle last week’s “This Week at X” JPEG. Do **not** mix another store into `pages[]`.
4. Do not add a catalogue API, Next.js, or a scraper to this PWA. Empty-state CoS is not implemented in this PR.

**License:** not a third-party package. This repository’s own files. No LICENSE file is present on `main` as of this scout.

**Stays $0 after limits?** Yes (git hosting + existing Vercel site). Unverified: Vercel Hobby quotas on this account were not checked here.

**Credit-card wall?** No for this workflow itself.

**Project alive?** This repo is live at the URL above; `main` at scout time.

**Replaces:** Flipp, Apify grocery scrapers, and any “auto-catalogue” SaaS.

**Beginner trap:** treating a reused hero JPEG or a mixed `pages[]` as “this week.” That is the CoS lock. Also: filling empty weeks with last week’s file so the grid is never empty.

### 2. Kokoro TTS (`hexgrad/kokoro` + `hexgrad/Kokoro-82M`)

**What it is:** open-weight 82M TTS. Inference library: [github.com/hexgrad/kokoro](https://github.com/hexgrad/kokoro). Weights: [huggingface.co/hexgrad/Kokoro-82M](https://huggingface.co/hexgrad/Kokoro-82M) (`license: apache-2.0` in the model card YAML).

**Job:** Unhurried English narration (long + Short).

**Exact apply steps on this stack:**

1. Keep synthesis inside `Frt682/unhurried-english` (already present per operator). Do **not** add Kokoro, PyTorch, or espeak to this Kenya PWA repo.
2. Generate **English** audio only. Do not stand up a second-language voice.
3. Feed the wav into the existing FFmpeg stills step (KEEP 3). Do not swap in ElevenLabs.
4. Hugging Face warns that sites with “kokoro” in the root domain (examples on the model card) are not the authors. Use the GitHub / Hugging Face URLs above.

**License (quote):** from [hexgrad/kokoro LICENSE](https://github.com/hexgrad/kokoro/blob/main/LICENSE):

> 2. Grant of Copyright License. Subject to the terms and conditions of this License, each Contributor hereby grants to You a perpetual, worldwide, non-exclusive, no-charge, royalty-free, irrevocable copyright license to reproduce, prepare Derivative Works of, publicly display, publicly perform, sublicense, and distribute the Work and such Derivative Works in Source or Object form.

Official text also at [apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0).

**Stays $0 after limits?** Self-hosted: yes (your CPU/GPU). Hosted third-party Kokoro APIs are a different product; do not use those for this channel unless separately licensed. Hugging Face notes unofficial API market rates; those are **not** this KEEP.

**Credit-card wall?** No for local `pip` + weights.

**Project alive?** Last observed commit on `hexgrad/kokoro` `main`: 6 August 2025 ([Enable Python 3.13 #244](https://github.com/hexgrad/kokoro/commits/main)). PyPI `kokoro` 0.9.4 uploaded 5 April 2025 ([pypi.org/project/kokoro/0.9.4](https://pypi.org/project/kokoro/0.9.4/)). Weights page v1.0 published 27 January 2025. Alive enough to keep using what is already vendored; not a reason to buy ElevenLabs.

**Replaces:** ElevenLabs and other paid TTS.

**Beginner trap:** installing a random “Kokoro TTS” website (HF scam warning) or adding a cloud TTS “just for quality” while the Apache weights already run in-repo.

### 3. FFmpeg stills + existing `youtube_upload.py` (YouTube Data API v3)

**What it is:** local FFmpeg to mux stills + Kokoro audio; existing `youtube_upload.py` to `videos.insert` with `status.publishAt`. Client library commonly used for that script: [google-api-python-client](https://github.com/googleapis/google-api-python-client).

**Job:** Unhurried English publish clock (18:00 long / 18:10 Short, `Europe/Istanbul`).

**Exact apply steps on this stack:**

1. In `unhurried-english`, mux stills + wav with local FFmpeg. Do not move that render into this Kenya repo.
2. Upload with `youtube_upload.py`. Set `status.privacyStatus` to `private` and `status.publishAt` to RFC 3339 for **today’s** 18:00 (long) and 18:10 (Short) in `Europe/Istanbul`. YouTube: “If you set a value for this property, you must also set the `status.privacyStatus` property to `private`. This property can only be set if the video’s privacy status is `private` and the video has never been published.” Invalid times return `invalidPublishAt`. Source: [Videos: update](https://developers.google.com/youtube/v3/docs/videos/update) / [Videos: insert](https://developers.google.com/youtube/v3/docs/videos/insert) (`status.publishAt`).
3. **Never** pass a `publishAt` that is already in the past at upload time. If the clock has passed 18:00 Istanbul, do not back-date; skip or wait for the next day’s slot. Unverified here: whether the current script already aborts on past times.
4. Do **not** rotate OAuth client secrets or publish the consent screen in this task. Treat Testing 7-day refresh tokens as a known calendar cost, not a SaaS gap.
5. Do **not** “fix” `videos.update` 403 in this PR. Documented cause class: token scopes. `videos.update` does not list `youtube.upload`. Re-consent is out of scope here.

**License:**

FFmpeg, from [ffmpeg.org/legal.html](https://www.ffmpeg.org/legal.html):

> FFmpeg is licensed under the GNU Lesser General Public License (LGPL) version 2.1 or later. However, FFmpeg incorporates several optional parts and optimizations that are covered by the GNU General Public License (GPL) version 2 or later. If those parts get used the GPL applies to all of FFmpeg.

Also: “FFmpeg is not available under any other licensing terms, especially not proprietary/commercial ones, not even in exchange for payment.”

`google-api-python-client` is Apache-2.0 ([LICENSE](https://github.com/googleapis/google-api-python-client/blob/main/LICENSE)). YouTube Data API access is additionally under [YouTube API Services Terms of Service](https://developers.google.com/youtube/terms/api-services-terms-of-service) (not OSS).

**Stays $0 after limits?** FFmpeg: yes. YouTube Data API: no per-call price list on the method pages; default projects have a quota. `videos.insert` from **unverified** API projects created after 28 July 2020 is restricted to private viewing until audit. Source: [Videos: insert](https://developers.google.com/youtube/v3/docs/videos/insert). Quota exhaustion is unverified for this channel.

**Credit-card wall?** FFmpeg: no. Google Cloud Console / YouTube API key: no card required to create a project (unverified for every Google billing SKU). OpusClip/vidIQ are not this KEEP.

**Project alive?** FFmpeg 9.0.1 “Lei” released **12 August 2026** ([ffmpeg.org/download.html](https://ffmpeg.org/download.html)). `google-api-python-client` v2.199.0 released **20 August 2026** ([GitHub release](https://github.com/googleapis/google-api-python-client/releases/tag/v2.199.0)).

**Replaces:** OpusClip, vidIQ-as-uploader, Buffer/Later-style schedulers that do not own this OAuth client.

**Beginner trap:** uploading as `public` and then trying to set `publishAt`; setting `publishAt` in the past; calling `videos.update` with a `youtube.upload`-only token; expecting Testing refresh tokens to last more than 7 days; adding a clip SaaS because a 403 looked like “YouTube growth.”

---

## What this scout is not

- Not an implementation of the Kenya empty-state CoS (lock is documented only).
- Not token rotation, Cloud Console publish, or Partner Center edits.
- Not SuperGrok Plus, not a new app, not a multi-country catalogue product.
- Unverified stays unverified: live `unhurried-english` tree (404 here), Vercel plan limits, YouTube quota remaining, and whether Emanet’s payment profile is already created vs only unpaid.
