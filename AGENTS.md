# AGENTS.md — PikaCSS

## Project Overview

PikaCSS is an **instant on-demand Atomic CSS-in-JS engine**. Developers write styles using CSS-in-JS APIs with full TypeScript autocomplete, and the engine outputs optimized atomic CSS classes at build time — zero runtime, zero learning curve.

- **Monorepo**: pnpm workspace (pnpm 10.24.0)
- **Language**: TypeScript (strict mode, ES modules)
- **Build**: tsdown (ESM + CJS + DTS)
- **Test**: Vitest with `@vitest/coverage-v8`, typecheck enabled
- **Lint**: ESLint via `@deviltea/eslint-config`
- **Docs**: VitePress (in `docs/`)
- **Node**: LTS (check `engines` if present)

## Repository Layout

```
pikacss/
├── packages/
│   ├── core/              # Core engine: createEngine, plugins, extractors, resolvers
│   ├── integration/       # Build integration: config loading, transform, codegen
│   ├── unplugin/          # Universal build plugin (Vite/Rollup/Webpack/esbuild/Rspack/Rolldown)
│   ├── nuxt/              # Nuxt module wrapper
│   ├── plugin-icons/      # Icon plugin (@iconify integration)
│   ├── plugin-reset/      # CSS reset plugin (5 presets)
│   └── plugin-typography/ # Typography/prose plugin
├── demo/                  # Vue demo app
├── docs/                  # VitePress documentation site
├── scripts/               # Scaffolding scripts (newpkg, newplugin)
├── openspec/              # OpenSpec workflow configuration
└── coverage/              # Coverage reports (gitignored)
```

Each package follows the same structure:
- `src/index.ts` — main entry point
- `src/internal/` — internal modules (if any)
- `tsconfig.json` — references `tsconfig.package.json` and `tsconfig.tests.json`
- `tsdown.config.ts` — build configuration
- `vitest.config.ts` — test configuration (uses `defineProject`)
- `package.json` — package metadata and scripts

## Setup Commands

```bash
# Install all dependencies (required before any other command)
pnpm install

# Build all packages
pnpm build

# Run all tests
pnpm test

# Run tests in watch mode
pnpm vitest

# Lint and auto-fix
pnpm lint

# Type-check all packages
pnpm typecheck

# Run a single package's tests
pnpm vitest run --project core
pnpm vitest run --project integration

# Docs
pnpm docs:dev      # dev server
pnpm docs:build    # production build
```

## Testing Conventions

- **Framework**: Vitest (v4+)
- **Test files**: Co-located with source files — `src/foo.ts` → `src/foo.test.ts`
- **Coverage**: `@vitest/coverage-v8`, configured in root `vitest.config.ts`
- **Coverage excludes**: config files, index files, docs, scripts, dist, coverage, bench files
- **Typecheck**: Enabled globally — tests are type-checked
- **Environment**: `happy-dom` available for DOM-related tests
- Always run `pnpm test` before committing to verify all tests pass
- After making changes, run `pnpm vitest run --project <package-name>` to verify the affected package

## Code Style

- **ES Modules** (`import`/`export`), never CommonJS (`require`)
- **TypeScript strict mode** — no `any` unless absolutely necessary
- **All files must be written in English** — code, comments, documentation, commit messages
- Markdown indentation: 2 spaces
- Follow existing patterns in the codebase
- Use `defineConfig`/`defineProject` helpers for config files
- Prefer named exports over default exports

## Build System

- **tsdown** compiles each package to ESM + CJS with `.d.ts` generation
- DTS uses `tsconfig.package.json` (composite, `src/` only)
- Each package has `build` and `typecheck` scripts
- Root `pnpm build` builds all packages in dependency order
- **publint** validates package publishing correctness

## Git Workflow

- **Pre-commit hook**: `lint-staged` runs ESLint on staged files via `simple-git-hooks`
- Always run `pnpm lint` and `pnpm test` before committing
- Commit messages should be descriptive and in English

## Package Dependencies (Internal)

```
core (no internal deps)
  └── integration (depends on core)
       └── unplugin (depends on integration)
            └── nuxt (depends on unplugin)

plugin-icons, plugin-reset, plugin-typography (depend on core)
```

When modifying `core`, always verify downstream packages still build and pass tests.

## Key Conventions

- **Plugin system**: Use `defineEnginePlugin()` to create engine plugins
- **Config**: Use `defineEngineConfig()` for engine configuration
- **Style definitions**: Use `defineStyleDefinition()` for type-safe style objects
- **Integration context**: Use `createCtx()` to create build integration contexts
- **Unplugin factory**: Use `unpluginFactory` for build tool plugins
- Config files are auto-detected as `pika.config.{js,ts,mjs,mts,cjs,cts}`

## Common Pitfalls

- Do NOT edit files inside `dist/` or `coverage/` — they are generated
- Do NOT run `pnpm build` during iterative development — use tests and typecheck instead
- The root `vitest.config.ts` uses `projects: ['packages/*']` — each package is a separate Vitest project
- Coverage reports in the repo may be stale — always regenerate with `pnpm test`
- Some packages have `@types/*` as dev dependencies — check `package.json` before adding new type packages

## Scaffolding New Packages

```bash
pnpm newpkg       # Interactive: create a new package in packages/
pnpm newplugin    # Interactive: create a new plugin package
```
