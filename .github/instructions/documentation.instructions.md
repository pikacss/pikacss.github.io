---
applyTo: "docs/**,docs/.examples/**,docs/zh-TW/**,docs/zh-TW/.examples/**"
---

# Documentation Authoring — PikaCSS

All docs live in `docs/` (VitePress). Code examples live in `docs/.examples/` only.

This file covers three scopes:

- **General conventions** — applies to all files under `docs/` and `docs/.examples/`.
- **zh-TW markdown translation** — applies when working on `docs/zh-TW/**/*.md`.
- **zh-TW example localization** — applies when working on `docs/zh-TW/.examples/**/*`.

## Documentation Goals

PikaCSS docs are intentionally opinionated. They should help readers do three things in order:

1. Decide whether PikaCSS fits their constraints.
2. Get one correct build-time workflow running.
3. Scale usage with the right engine model instead of cargo-culting runtime patterns.

Docs should optimize for correct mental models before feature breadth.

## Information Architecture

The docs should follow this audience-first structure:

1. `Discover`: help potential adopters evaluate fit.
2. `Getting Started`: get a first successful setup working.
3. `Framework Integrations`: show bundler or framework-specific setup.
4. `Configuration`: explain config buckets, build plugin options, and shared engine setup.
5. `Core Features`: document built-in engine capabilities as a chapter with an overview page plus feature-specific pages.
6. `Patterns`: show repeatable application architecture and team practices.
7. `Plugins Ecosystem`: document installable official plugins.
8. `Plugin Developer API`: document extension APIs for plugin authors.
9. `Troubleshooting` and `Community`: handle recovery and common questions.

When adding or moving pages, prefer placing them by reader task and adoption stage, not by internal implementation detail.

## Route Placement Rules

- Put fit-evaluation pages under `getting-started/` or `concepts/` only when they help users decide whether to adopt PikaCSS at all.
- Put first-run setup, generated artifacts, and ESLint onboarding in the beginner path, not in advanced reference sections.
- Put engine-native capabilities such as `selectors`, `shortcuts`, `variables`, `keyframes`, and `important` under a dedicated `Core Features` chapter, with one overview page and separate pages for each feature.
- Put runtime-safe composition advice, theming, responsive usage, and component architecture under `patterns/`.
- Put installable modules such as icons, reset, typography, and fonts under `plugins/`.
- Put lifecycle hooks, extension APIs, and authoring custom plugins under `plugin-system/`.

## Reader Routes

Default reading path for new adopters:

1. `What Is PikaCSS?`
2. `Static Constraints`
3. `How PikaCSS Works`
4. `Atomic Order And Cascade`
5. `Installation`
6. `First Pika`
7. `Generated Files`
8. `ESLint`
9. `Configuration`
10. `Core Features Overview`
11. individual core feature pages as needed
12. `Patterns`

Default reading path for plugin authors:

1. `Plugin System Overview`
2. `Create A Plugin`
3. `Hook Execution`
4. Official plugins as reference implementations

Each page should make the next sensible step obvious through intro framing and the final `## Next` links.

## Authoring Workflow

Before writing or editing documentation, fetch VitePress's LLM guide for current syntax:

1. Use a `#runSubagent` with `#fetch_webpage` to fetch `https://vitepress.dev/llms.txt`
2. Cross-reference it with the rules below.
3. Then write or edit the docs.

## Core Rules

- Never write code directly in markdown files. Store examples in `docs/.examples/` and import them with `<<<`.
- Always include `pnpm`, `npm`, and `yarn` variants for package-manager install examples.
- Use absolute docs links such as `/getting-started/installation`, never relative markdown links like `../guide/config`.
- Every page ends with a `## Next` section linking 2-4 related pages.
- Prefer user-facing terminology over internal implementation terminology when the internal term creates avoidable confusion.
- In user-facing docs, prefer `Core Features` over `Built-in Plugins`, except when explicitly clarifying older naming.
- Treat ESLint as part of onboarding, not as an optional late-stage integration.
- Do not collapse all core features into a single reference page. The chapter should contain an overview page plus dedicated pages for feature-specific behavior.

## LLM Output Best Practices

Because this docs site uses `vitepress-plugin-llms`, every markdown page should remain clear when exported as raw markdown, linked from `llms.txt`, or flattened into `llms-full.txt`.

- Add a concise `description` to frontmatter on every user-facing page. Write it as a one-sentence statement of what the page helps the reader do or understand.
- Do not use generic descriptions such as `Overview`, `Introduction`, or repeating the title with no new meaning. The generated `llms.txt` should stay informative when read as a link list.
- Start each page with a short self-contained intro. Do not assume the reader arrived through the sidebar or has surrounding navigation context.
- Use descriptive H2 and H3 headings that still make sense when extracted as section links. Avoid vague headings such as `More`, `Details`, or `Advanced` without a subject.
- Keep critical constraints, caveats, and decision-making guidance in normal page content. Do not rely on screenshots, custom theme UI, or visual layout alone to carry required meaning.
- Prefer explicit wording over deictic references such as `this`, `that`, `above`, and `below` when a noun phrase would make the sentence clearer in standalone exports.
- Use `<llm-only>` only for short LLM-specific steering that improves retrieval or navigation, such as pointing to the most relevant section or clarifying a safe default. Never place canonical product behavior or required user instructions only inside `<llm-only>`.
- Use `<llm-exclude>` only for content that is helpful to human readers but noisy in generated markdown, such as decorative callouts or UI-only affordances. Never hide constraints, warnings, examples, or route guidance that are required for correct usage.
- If a page uses `<llm-only>` or `<llm-exclude>`, keep those blocks minimal and ensure the surrounding page still reads correctly for both humans and LLM exports.
- Prefer text over images for any information that affects setup, API usage, or troubleshooting. If an image is useful, restate the important takeaway in prose.
- When localizing a page under `docs/zh-TW/`, preserve any existing `<llm-only>` and `<llm-exclude>` structure from the English source in the same position unless the English source changes first.

```markdown
<<< @/.examples/getting-started/pika-basic.ts
<<< @/.examples/guide/config-basic.ts{3-5}
```

For multi-option tabs (package managers, frameworks):

```markdown
::: code-group
<<< @/.examples/getting-started/install.sh [pnpm]
<<< @/.examples/getting-started/install-npm.sh [npm]
<<< @/.examples/getting-started/install-yarn.sh [yarn]
:::
```

## Page Structure

Typical flow:
1. Brief intro (1-2 paragraphs)
2. Why this page matters in the adoption path
3. Basic usage or core explanation
4. Scaling guidance, caveats, or common misunderstandings
5. Links to deeper related pages
6. `Next`

Heading levels: H1 (title, once) · H2 (major sections) · H3 (subsections) · H4 (rarely)

Not every page needs installation steps. Do not force the same outline onto pages whose main job is evaluation, concepts, or patterns.

## Writing Style

- Tone: direct, imperative, technical.
- Keep terminology consistent: `engine`, `build-time`, `atomic CSS`, `pika()`, `virtual module`, `generated files`.
- State constraints early when they affect whether a feature or workflow is valid.
- Prefer explaining why a boundary exists before listing exceptions.
- Write for teams, not only solo experimentation; emphasize conventions, repeatability, and failure prevention.
- Wrap identifiers, package names, and file paths in backticks.
- Use VitePress containers only when they add value: `tip`, `warning`, `info`.

## Navigation Principles

- Keep navbar items limited to the highest-value entry points only.
- Use the sidebar for the richer section taxonomy.
- Do not promote secondary reference pages into the navbar unless they are part of the primary reader journey.

## .examples/ File Organization

```plaintext
docs/.examples/
├── community/         # faq examples
├── getting-started/   # install, first-pika, zero-config
├── guide/             # config, core features, built-ins
│   └── built-ins/     # per-feature reference examples
├── home/              # landing page examples
├── integrations/      # vite, nuxt, eslint, etc.
├── patterns/          # dynamic values, theming, component patterns
├── plugin-system/     # plugin authoring examples
├── plugins/           # reset, icons, typography, fonts
└── principles/        # concepts and build-time model examples

docs/zh-TW/.examples/  ← mirrors docs/.examples/ 1:1 with zh-TW comment translations
```

Match the folder name to the docs section. Keep examples that are not yet referenced in any doc page unless the file is clearly misplaced or duplicates an existing referenced example in a different directory.

## Example Correctness Rules

- All TypeScript examples must use only publicly exported APIs from `@pikacss/core`, `@pikacss/unplugin-pikacss`, or the relevant plugin package. Do not import internal types that are not in the package's public `index.ts`.
- Always import `defineEngineConfig` and other engine helpers from `@pikacss/core`, not from `@pikacss/unplugin-pikacss`. The unplugin package re-exports core APIs but teaching users to import from it creates the wrong mental model about dependency boundaries.
- CSS property values in `pika()` calls must always be strings. `fontWeight: '600'` not `fontWeight: 600`. Number values are not valid `PropertyValue` types and will be silently dropped by the extractor.
- Selectors inside `pika()` must use registered named selectors (`hover`, `dark`, `screen-md`), not raw CSS selector strings (`'&:hover'`, `'&:focus'`). Raw CSS pseudo-selectors produce CSS nesting output, not the flat atomic rules expected from the engine.
- CSS at-rules such as `'@media (min-width: 768px)'` may be used directly as keys if no named selector is configured, but named selectors are always preferred for readability and autocomplete.
- CSS output examples (`.css` files) must be consistent with their paired source TypeScript examples. Check that every declaration in the output corresponds to a real engine-emitted rule from the source config and usage files.
- When a config example demonstrates `pruneUnused: false` on a variable, the corresponding output file must include that variable's declaration.
- Paired config + usage + output triples within the same doc section must all reference the same shortcut, variable, or keyframe names. A config file that defines `flex-center` cannot be paired with a usage file that calls `cluster`.

## Example Output Verification

CSS output files (`*-output.css`, `*-generated.css`) that demonstrate engine-generated results are **engine-managed snapshots** verified by Vitest. They must not be hand-edited.

### Architecture

- Each testable output file has a co-located `*-output.test.ts` (or `*-generated.test.ts`) that uses `renderExampleCSS()` from `__test-utils__/render-example.ts`.
- The test helper creates an integration context with the example's `*-config.ts`, transforms the `*-usage.ts` source code, and renders CSS output.
- `toMatchFileSnapshot()` ensures the output file matches the engine's actual CSS output.

### Commands

```bash
pnpm docs:verify-examples      # verify all output files match engine output
pnpm docs:update-examples      # regenerate output files from engine (vitest --update)
```

### Rules

- Every example file in `docs/.examples/` **must** have corresponding test coverage — no exceptions:
  - Files with `pika()` calls: individual `*-output.test.ts` using `renderExampleCSS()` + `toMatchFileSnapshot()`.
  - Files with `pika()` calls that use dynamic/non-static values (anti-patterns): individual `*-output.test.ts` asserting `expect(css).toBe('')`.
  - Files with `pika()` calls referencing local variables (e.g., `pika(varName)`): individual `*-output.test.ts` asserting empty CSS (transform cannot resolve variable references).
  - Plugin-dependent `pika()` examples: individual `*-output.test.ts` with plugin config (e.g., `{ plugins: [typography()] }` or `{ plugins: [icons()], icons: { collections: { ... } } }`).
  - Shell scripts (`.sh`): covered by `__test-utils__/shell-scripts.test.ts` batch test.
  - All other files (configs, types, HTML, `.gitignore`, `.txt`, `.css`, `.mjs`): covered by `__test-utils__/completeness.test.ts` (non-empty content check + pika() file coverage check).
- Never hand-edit output CSS files. Run `pnpm docs:update-examples` to regenerate them.
- Manually maintained CSS illustrations (e.g., `selectors-nesting-antipattern-output.css`, `order-class-order-problem.css`, `icons-mask-output.css`, `icons-bg-output.css`) are verified for non-empty content by the completeness test. If the corresponding source file also has `pika()` calls, a separate engine-generated snapshot (e.g., `*-generated.css`) must be created alongside the manual illustration.
- When creating a new example:
  1. Write the source file(s) in the appropriate `docs/.examples/` subdirectory.
  2. Create a corresponding test file following the conventions above.
  3. Run `pnpm docs:update-examples` to generate snapshots.
  4. Review the generated output for correctness.
  5. Copy any new `*-output.css` or `*-generated.css` to `docs/zh-TW/.examples/` counterparts.
- When modifying engine behavior, run `pnpm docs:verify-examples` to detect affected outputs, then `pnpm docs:update-examples` to regenerate.
- zh-TW output CSS files must be identical to their English counterparts. The `zh-tw-sync.test.ts` verifies this automatically.

---

# Traditional Chinese (Taiwan) Translation Conventions

> Applies when working on `docs/zh-TW/**/*.md`.

## Source Of Truth

- English docs under `docs/` are the only source of truth.
- Every translated page under `docs/zh-TW/` must stay structurally identical to its English source.
- Keep the same file name, heading order, paragraph order, callout order, list order, table structure, `## Next` links, and snippet imports.
- Preserve the same information-architecture role as the English page, including whether the page is framing evaluation, onboarding, patterns, plugin usage, or plugin authoring.
- When English docs split a chapter into overview and feature-specific pages, the zh-TW docs must keep the same chapter split and page boundaries.
- Do not add, remove, or reorder content unless the English source changes first.

## Translation Workflow

1. Read the English source page.
2. Translate it into Traditional Chinese for Taiwan.
3. Keep code, identifiers, package names, file names, and snippet semantics unchanged.
4. Rewrite internal docs links to `/zh-TW/...` when the translated counterpart exists; otherwise keep the English route.
5. Point snippet imports to `@/zh-TW/.examples/...` when the mirrored localized example exists.
6. Compare the zh-TW page against the English source to confirm 1:1 structure.

## Language Rules

- Target audience: developers in Taiwan.
- Prefer Taiwan technical usage over mainland wording.
- Use direct, technical prose, but make it read like native Taiwanese technical writing rather than sentence-by-sentence English.
- Keep mixed-language phrasing when the English technical term is clearer and more natural.
- When a term is obviously technical and translation would reduce clarity, keep the English term.
- If a technical term is ambiguous and not listed in the glossary below, stop and ask before standardizing it.
- Prefer smooth, readable Chinese sentence flow over rigid English word order.
- Avoid obvious translation calques such as `這代表`, `這也是`, `本來就是`, `會長這樣` when a simpler native phrasing works better.
- Preserve emphasis in tone, not by copying English sentence shape.
- Rewrite any sentence that still sounds translated.

## Terminology Glossary

### Keep In English

- engine
- build-time
- atomic CSS
- virtual module
- generated files
- plugin / plugins
- hook / hooks
- selector / selectors
- config / configuration
- runtime
- autocomplete
- bundler
- class names

### Translate To Traditional Chinese (Taiwan)

- theme -> 主題
- theming -> 主題化
- docs -> 文件
- example -> 範例
- generated CSS output file -> 產生的 CSS 輸出檔

## Taiwan Wording Baseline

- Prefer Taiwan wording such as `設定`, `檔案`, `模組`, `原始碼`, `程式碼`, `匯入`, `匯出`, `全域`, `變數`, `函式`, `巢狀`, `物件`, `用戶端`, `伺服器`, `連結`, and `搜尋`.
- Use the cn2tw4programmer mapping provided by the repository owner as the default wording reference for general terms.
- Do not force translation for product names, APIs, package names, or established English technical vocabulary.

## Links And Snippets

- zh-TW markdown pages should import localized example copies from `@/zh-TW/.examples/...` when that mirrored file exists.
- Keep all code blocks, inline identifiers, package names, and file paths unchanged.
- Internal links in zh-TW pages must point to the zh-TW route when the translated counterpart exists.
- If the translated counterpart does not exist yet, temporarily link back to the English route to avoid dead links during progressive rollout.

---

# Traditional Chinese (Taiwan) Example Localization Conventions

> Applies when working on `docs/zh-TW/.examples/**/*`.

## Source Of Truth

- English examples under `docs/.examples/` are the only source of truth.
- Every localized example under `docs/.examples/zh-TW/` must mirror the English source 1:1.
- Keep the same relative path, file name, file type, code order, and snippet shape as the English source.
- Do not add, remove, or reorder code, comments, or output blocks unless the English source changes first.

## Localization Workflow

1. Read the English source example under `docs/.examples/`.
2. Create or update the mirrored file under `docs/zh-TW/.examples/` with the same relative path.
3. Translate comments and clearly human-readable explanatory text only.
4. Preserve executable code, identifiers, imports, package names, APIs, file paths, and output semantics.
5. Compare the localized file against the English source to confirm structure and behavior still match.

## Translate Only

- Line comments such as `// ...`
- Block comments such as `/* ... */`
- HTML comments such as `<!-- ... -->`
- Explanatory output comments inside CSS or generated-output examples
- Human-readable descriptive labels embedded in comments

## Keep In English

- Identifiers, variable names, function names, type names, API names, package names
- File names and file paths
- Executable strings whose value is part of program behavior
- Established technical vocabulary when translation would reduce clarity, such as `engine`, `plugin`, `hook`, `selector`, `runtime`, `build-time`, `atomic CSS`, `autocomplete`, and `class names`

## Style Rules

- Write comments in natural Traditional Chinese for Taiwan.
- Prefer concise, engineering-oriented phrasing over literal English sentence order.
- Keep the comment tone aligned with the surrounding example: short, direct, explanatory.
- Avoid mixed-language phrasing when the Chinese wording is already clear and idiomatic.
- If a comment reads like a translation artifact rather than something a Taiwanese engineer would write, rewrite it.
