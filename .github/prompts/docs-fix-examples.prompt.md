---
mode: agent
description: "Validate docs examples and fix all auto-fixable issues: build prerequisites, missing config modules, missing output tests, and regenerate snapshots."
---

Run the PikaCSS documentation example validation and fix all issues found.

## Hard Boundary

Only read and write files under `docs/.examples/`, `docs/zh-TW/.examples/`, and `docs/**/*.md`. Do not edit source code under `packages/`.

---

## Step 1 — Read Conventions

Before doing anything else, read `.github/instructions/documentation.instructions.md` in full to understand:
- The `*-output.test.ts` test authoring pattern
- Which file types require which test strategy
- The `renderExampleCSS()` / `toMatchFileSnapshot()` API contract
- The `docs:update-examples` regeneration workflow

---

## Step 2 — Build Prerequisites

Build upstream packages so example tests can import them:

```bash
pnpm --filter @pikacss/core build
pnpm --filter @pikacss/integration build
pnpm --filter @pikacss/plugin-typography build
pnpm --filter @pikacss/plugin-icons build
pnpm --filter @pikacss/plugin-reset build
pnpm --filter @pikacss/plugin-fonts build
```

---

## Step 3 — Validate Current State

Run both commands and collect their full output:

```bash
pnpm docs:check-examples
```

```bash
pnpm docs:verify-examples
```

Record:
- Exit code of each command
- Every `❌` line from `check-examples`, grouped by their category header. Only categories whose header ends with **`(must have tests)`** require action — currently:
  - `── CSS output files (must have tests)` — `*-output.css` / `*-generated.css` without a paired test
  - `── Source files with pika() usage (must have tests)` — `.ts`/`.vue` source files without a paired test
  - Categories **without** `(must have tests)` (`Plain CSS files`, `Config / type / helper files`, `Shell scripts`, etc.) are covered by batch tests (`completeness.test.ts`, `shell-scripts.test.ts`) and do **not** need individual output tests.
- Every `Error: Cannot find module` / `Cannot find package` line from `verify-examples` (broken imports)

---

## Step 4 — Fix: Missing Config Modules

`verify-examples` failures that say `Cannot find module './foo-config'` mean a test file imports a config module that does not yet exist.

For each missing config module:

1. Read the test file that imports it to understand what the config must export.
2. Read the corresponding markdown page (`docs/**/*.md`) that references the example to understand the intended engine setup.
3. Create the config file using `defineEngineConfig()` from `@pikacss/core` and the `export default` pattern.

Pattern:
```ts
import { defineEngineConfig } from '@pikacss/core'

export default defineEngineConfig({
  // options inferred from the test and doc page context
})
```

Do not guess options that are not documented on the corresponding page. Use `{}` for a minimal config when the page shows zero-config usage.

---

## Step 5 — Fix: Missing Output Tests

Only fix files that appear under a category header ending with `(must have tests)`. All other categories are handled by existing batch tests.

### 5-A — CSS output files (`*-output.css` / `*-generated.css`)

These are engine-managed snapshots. If one has no test, find its paired source file (same stem without `-output` / `-generated`) and create a `*-output.test.ts` from the templates below. After creating the test, run `pnpm docs:update-examples` to regenerate the snapshot.

### 5-B — Source files with pika() usage

For each `❌ .examples/path/to/file.ts` listed under `Source files with pika() usage (must have tests)`, choose the correct test template based on the file content:

#### Template a — Plain usage, no config, no plugin
```ts
import { it } from 'vitest'
import { readExampleFile, renderExampleCSS } from '../__test-utils__/render-example'

it('<stem> output matches engine', async ({ expect }) => {
  const usage = await readExampleFile(new URL('./<source-file>.ts', import.meta.url))
  const css = await renderExampleCSS({ usageCode: usage })
  await expect(css)
    .toMatchFileSnapshot('./<stem>-output.css')
})
```

#### Template b — Usage requires a config module
```ts
import { it } from 'vitest'
import { readExampleFile, renderExampleCSS } from '../__test-utils__/render-example'
import config from './<stem>-config'

it('<stem> output matches engine', async ({ expect }) => {
  const usage = await readExampleFile(new URL('./<source-file>.ts', import.meta.url))
  const css = await renderExampleCSS({ config, usageCode: usage })
  await expect(css)
    .toMatchFileSnapshot('./<stem>-output.css')
})
```

#### Template c — Plugin-dependent (e.g. typography, icons)
```ts
import { typography } from '@pikacss/plugin-typography'
import { it } from 'vitest'
import { readExampleFile, renderExampleCSS } from '../__test-utils__/render-example'

it('<stem> output matches engine', async ({ expect }) => {
  const usage = await readExampleFile(new URL('./<source-file>.ts', import.meta.url))
  const css = await renderExampleCSS({
    config: { plugins: [typography()] },
    usageCode: usage,
  })
  await expect(css)
    .toMatchFileSnapshot('./<stem>-output.css')
})
```

#### Template d — Anti-pattern / dynamic values (cannot be statically extracted)
```ts
import { it } from 'vitest'
import { readExampleFile, renderExampleCSS } from '../__test-utils__/render-example'

it('<stem> produces no atomic output (dynamic values)', async ({ expect }) => {
  const usage = await readExampleFile(new URL('./<source-file>.ts', import.meta.url))
  const css = await renderExampleCSS({ usageCode: usage })
  expect(css)
    .toBe('')
})
```

Use template d when the example intentionally demonstrates a usage pattern the extractor cannot resolve.

**Read the source file before choosing a template.**

---

## Step 6 — Regenerate Snapshots

After creating all missing test and config files, run:

```bash
pnpm docs:update-examples
```

This generates all `*-output.css` snapshot files. Review the terminal output for any errors — do not proceed if any test still fails.

---

## Step 7 — Sync zh-TW Output Files

For every new `*-output.css` file created under `docs/.examples/`, copy an identical file to the mirrored path under `docs/zh-TW/.examples/`:

```
docs/.examples/getting-started/first-pika-output.css
→ docs/zh-TW/.examples/getting-started/first-pika-output.css
```

Do the same for example source files that have zh-TW counterparts already (check `docs/zh-TW/.examples/` for existing mirrors). Only copy output CSS files — do not create zh-TW source mirrors for files that don't already exist there.

---

## Step 8 — Verify

Run both commands again to confirm zero failures:

```bash
pnpm docs:check-examples
```

```bash
pnpm docs:verify-examples
```

---

## Step 9 — Final Report

Produce a concise fix report:

```
# Docs Examples Fix Report — <YYYY-MM-DD>

## Summary

| Command | Before | After |
| --- | --- | --- |
| docs:check-examples | ❌ N missing tests | ✅ Pass / ❌ N remaining |
| docs:verify-examples | ❌ N failed suites | ✅ Pass / ❌ N remaining |

## Fixed

List every file created or modified:
- `docs/.examples/path/to/file.ts` — created config module / output test

## Could Not Fix

List any remaining failures with reason:
- `docs/.examples/path/to/file.ts` — reason (e.g. requires manual config decisions, upstream build error)
```
