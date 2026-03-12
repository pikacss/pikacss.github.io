---
mode: agent
description: "Run the full PikaCSS docs audit: all 6 personas, language synthesis, persona synthesis, and a consolidated report."
---

Run the full PikaCSS documentation audit. Use **GPT-5.4 via `runSubagent`** for every step (Steps 1–8). Do not execute any step inline — each step must be dispatched as a separate `runSubagent` call. Simulate all six reader personas, perform both syntheses, and save one consolidated report.

## Hard Boundary

Only read docs content. Nothing else.

**English reading scope:**
- `docs/**/*.md`, excluding `docs/zh-TW/**`
- Example files under `docs/.examples/**/*` that are referenced by those pages

**zh-TW reading scope:**
- `docs/zh-TW/**/*.md`
- Example files under `docs/zh-TW/.examples/**/*` that are referenced by those pages

**Never read:**
- `.github/` files of any kind
- `AGENTS.md`, `README.md`
- `docs/.vitepress/config.ts`, `docs/vite.config.ts`
- Source code under `packages/`
- Tests, scripts, repomix outputs, or any generated context files

The audit is invalid if it relies on any non-docs reference.

---

## Rubric

Score each dimension 1–5 for every persona.

| Dimension | Question |
| --- | --- |
| Adoption fit clarity | Can the persona decide whether PikaCSS fits their constraints? |
| First-success path clarity | Can the persona identify the correct first workflow without guesswork? |
| Mental model consistency | Do concepts stay aligned across pages instead of drifting? |
| Example-to-prose alignment | Do examples reinforce the written guidance instead of contradicting it? |
| Information architecture | Can the persona find the next relevant page at the right time? |
| Scaling guidance | Do the docs help the persona move from first success to real usage? |
| Recovery guidance | Can the persona recover from common mistakes using the docs alone? |
| Localization parity | Does the zh-TW version preserve the intended structure, precision, and meaning? (zh-TW rows only) |

**Severity:**
- P0: Blocks adoption, first success, or plugin implementation.
- P1: Creates a wrong mental model that leads to invalid usage.
- P2: Slows reading, creates confusion, or weakens trust.
- P3: Cosmetic wording, translation polish, or redundancy.

**Issue taxonomy** — normalize every finding into one of:
- Comprehension error
- Missing information
- Route or ordering problem
- Example mismatch
- Localization issue

Each issue must include: ID, Persona, Language, Severity, Category, Affected page, Evidence, Reproduction path, Recommended fix direction.

For zh-TW issues also label: `source` / `translation` / `both` / `follow-source`.

---

## Step 1 — English Evaluator

Read all English docs. Simulate a cautious English-speaking evaluator who has not adopted PikaCSS yet.

Answer:
1. What projects fit PikaCSS best?
2. What projects fit it poorly?
3. What does `static` mean here, and why is it decisive?
4. What is the intended adoption route through the docs?
5. Which page is the real decision gate?
6. What hesitation remains after full-site reading?
7. Which concept is easiest to misunderstand?
8. What next step should this persona take?

Produce: overall judgment (3 sentences), rubric scores, answers to all 8 questions, top findings with page references.

---

## Step 2 — English Adopted User

Using the English docs already read, simulate a user who already decided to use PikaCSS and needs a reliable path from setup to daily usage, scaling, and debugging.

Answer:
1. What is the minimum correct first-run workflow?
2. What role do generated files play?
3. How are configuration, integrations, core features, and patterns separated?
4. What rules keep `pika()` usage valid?
5. When should the user use variables, selectors, shortcuts, or patterns?
6. How does the site help recovery from a failed first setup?
7. Which pages are required before scaling across a team?
8. What confusion still remains after successful setup?

Produce: overall judgment (3 sentences), rubric scores, answers to all 8 questions, top findings with page references.

---

## Step 3 — English Plugin Developer

Using the English docs already read, simulate a plugin developer who wants to understand PikaCSS extension points, hook flow, and official plugins as reference implementations.

Answer:
1. What prerequisite understanding should exist before entering the plugin chapter?
2. What does the plugin system extend, and what does it not replace?
3. How are hook ordering and hook purpose explained?
4. Which official plugins work best as references, and why?
5. How do core features differ from installable plugins?
6. Which plugin-authoring idea is easiest to misread?
7. What pages should a lost plugin author revisit?
8. What unresolved question remains after reading the plugin docs?

Produce: overall judgment (3 sentences), rubric scores, answers to all 8 questions, top findings with page references.

---

## Step 4 — zh-TW Evaluator

Read all zh-TW docs. 模擬一位使用繁體中文（台灣）的觀望採用者，驗證 zh-TW 全站文件是否能幫助這個 persona 做出正確的採用判斷，並確認它是否忠實保留英文原始路徑。

回答：
1. 哪一類專案最適合採用 PikaCSS？
2. 哪一類專案最不適合？
3. 這份文件中的 `static` 是什麼意思，為何它是決策關鍵？
4. 文件引導的採用閱讀路徑是什麼？
5. 真正的 decision gate 是哪一頁？
6. 讀完全站後還會保留哪些疑慮？
7. 哪個概念最容易誤解？
8. 這位 persona 下一步該讀什麼？

產出：三句內總評、rubric 評分（含 localization parity）、8 題答案、主要問題含頁面引用（每項標記 source / translation / both / follow-source）。

---

## Step 5 — zh-TW Adopted User

使用已讀過的 zh-TW 文件，模擬一位已決定採用 PikaCSS 的繁體中文（台灣）使用者，驗證文件是否能支撐他從首次成功走到日常使用、擴充與疑難排解。

回答：
1. 最小且正確的 first-run workflow 是什麼？
2. generated files 在日常使用與除錯中的角色是什麼？
3. configuration、integrations、core features、patterns 是怎麼分工的？
4. 哪些規則決定 `pika()` 用法是否有效？
5. 何時該用 variables、selectors、shortcuts、patterns？
6. 第一次 setup 失敗時，文件是否提供足夠恢復路徑？
7. 在團隊擴大使用前，哪些頁面是必要前置？
8. 即使 setup 成功，還會留下哪些混淆？

產出：三句內總評、rubric 評分（含 localization parity）、8 題答案、主要問題含頁面引用（每項標記 source / translation / both / follow-source）。

---

## Step 6 — zh-TW Plugin Developer

使用已讀過的 zh-TW 文件，模擬一位使用繁體中文（台灣）的 plugin 開發者，驗證文件是否能正確建立 extension model、hook 時序理解，以及官方 plugins 的參考價值。

回答：
1. 進入 plugin 章節前需要哪些前置理解？
2. plugin system 擴充的是什麼，又沒有取代什麼？
3. hook ordering 與 hook purpose 是否講得清楚？
4. 哪些官方 plugins 最適合作為參考實作？為什麼？
5. core features 與 installable plugins 在文件中的差異是否清楚？
6. 哪個 plugin authoring 概念最容易被誤讀？
7. 如果讀到卡住，最應該回頭補讀哪些頁面？
8. 讀完 plugin 文件後還會留下什麼未解問題？

產出：三句內總評、rubric 評分（含 localization parity）、8 題答案、主要問題含頁面引用（每項標記 source / translation / both / follow-source）。

---

## Step 7 — Language Synthesis

Compare English and zh-TW results persona by persona.

Answer:
1. Which findings appear in both languages for the same persona?
2. Which findings appear only in one language?
3. Are any misunderstandings caused by translation drift rather than source content?
4. Are any pages structurally equivalent but semantically easier to understand in one language?

Produce: cross-run patterns (not per-run summaries), source-versus-translation separation, prioritized remediation themes (P0 → P3), pages requiring manual review.

---

## Step 8 — Persona Synthesis

Compare evaluator, adopted user, and plugin developer routes across the whole site (both languages).

Answer:
1. Do evaluator, user, and plugin-author routes form a coherent progression?
2. Which concepts arrive too early for one persona and too late for another?
3. Where do the docs assume prerequisite knowledge without making it explicit?
4. Which pages need stronger route framing or next-step guidance?

Produce: cross-persona progression assessment, early/late prerequisite findings, weak route-transition findings, top IA or sequencing priorities, pages requiring manual route redesign review.

---

## Final Report

After completing all 8 steps, save one consolidated report to `.github/prompts/docs-audit/artifacts/` as `audit-YYYY-MM-DD.md`. Use the report template at `.github/prompts/docs-audit/report-template.md` as the base structure. The report must include:

- Run metadata (date, mode: full, personas executed, syntheses executed)
- Score matrix (all 6 persona rows filled)
- Top findings (minimum 5, ordered by severity)
- All issues in normalized taxonomy format
- Language synthesis section
- Persona synthesis section
- Pages requiring manual review

**Validation** — reject and redo any section that is missing:
- a short overall judgment
- rubric scores
- answers to every required question
- concrete friction points with page evidence
- persona-consistent reasoning
