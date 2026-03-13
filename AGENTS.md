# AGENTS.md — PikaCSS

PikaCSS is an instant on-demand Atomic CSS-in-JS engine. Monorepo managed with pnpm workspaces.

| | |
|---|---|
| Language | TypeScript (strict, ES modules) |
| Package manager | pnpm 10.x |
| Build | tsdown (ESM + CJS + DTS) |
| Test | Vitest v4+ with `@vitest/coverage-v8` |
| Lint | ESLint via `@deviltea/eslint-config` |
| Docs | VitePress (`docs/`) |

## Commands

```bash
pnpm install                           # install all dependencies
pnpm vitest run --project <name>       # test a single package (preferred)
pnpm test                              # run all tests
pnpm typecheck                         # type-check all packages
pnpm lint                              # ESLint auto-fix
pnpm newpkg                            # scaffold a new package
pnpm newplugin                         # scaffold a new plugin
pnpm docs:dev                          # VitePress dev server
```

## Development Workflow

**IMPORTANT: Never run workspace-wide `pnpm build` during iterative development.** Use `pnpm vitest run --project <name>` and `pnpm typecheck` instead.

**IMPORTANT: If a task touches an upstream package (for example, changing `core` while working on a plugin), immediately run a scoped build for that upstream package so tests and downstream packages consume the latest types and public interfaces.**

```bash
pnpm --filter <upstream-package> build
# example: pnpm --filter @pikacss/core build
```

**IMPORTANT: After modifying `core`, ALWAYS verify ALL downstream packages:**

```bash
pnpm vitest run --project integration
pnpm vitest run --project unplugin
# also run plugin packages if they are affected
```

Pre-commit: `lint-staged` auto-runs ESLint on staged files via `simple-git-hooks`. Always run `pnpm lint` and `pnpm test` before committing.

## Package Dependency Graph

```plaintext
core  (no internal deps)
  └── integration
        └── unplugin
              └── nuxt

plugin-*  →  depend on core
```

Each package: `src/index.ts` entry · co-located tests (`src/foo.ts` → `src/foo.test.ts`) · `tsconfig.json` + `tsdown.config.ts` + `vitest.config.ts`.

## Code Conventions

- ES modules only — never `require()`
- TypeScript strict — no `any` unless unavoidable
- Named exports preferred over default exports
- Use `defineConfig` / `defineProject` helpers for config files
- No comments or docstrings added to unchanged code
- All content (code, comments, default docs, commits) in **English**
- Conversation language should remain consistent with the user's choice, including specific variants (e.g. Simplified Chinese vs. Traditional Chinese (Taiwan))
- When in doubt or anything feels unclear, ask questions instead of guessing; use the ask‑questions mechanism to get my input.
- In `tests`, `docs`, and `src` directories, do **not** reference absolute file system paths.

## Forbidden Actions

- Do NOT edit files in `dist/` or `coverage/` — generated, never edited manually
- Do NOT run `pnpm build` during development — use `vitest run` + `typecheck`
