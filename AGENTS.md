# AGENTS.md — PikaCSS

PikaCSS is an instant on-demand atomic CSS-in-JS engine. This file is the global contract for agents working in the repository.

Detailed workflow rules live in `.github/instructions/`. Task entry prompts live in `.github/prompts/`. Durable task outputs live in `.ai/tasks/`.

## Repo Facts

| | |
|---|---|
| Language | TypeScript (strict, ES modules) |
| Package manager | pnpm 10.x |
| Build | tsdown (ESM + CJS + DTS) |
| Test | Vitest v4+ with `@vitest/coverage-v8` |
| Lint | ESLint via `@deviltea/eslint-config` |
| Docs | VitePress (`docs/`) |

## Common Commands

```bash
pnpm install
pnpm test
pnpm typecheck
pnpm lint
pnpm --filter @pikacss/<package> test
pnpm --filter @pikacss/<package> typecheck
pnpm --filter @pikacss/<package> build
pnpm --filter @pikacss/docs typecheck
pnpm docs:dev
```

Use package-scoped commands during iterative development. Root-level `vitest --project` filtering is not the canonical package validation path in this repo.

## Package Graph

```plaintext
core  (no internal deps)
  └── integration
        └── unplugin
              └── nuxt

plugin-*  →  depend on core
```

Each package uses `src/index.ts` as the entry point, keeps tests co-located with source files, and carries local `tsconfig`, `tsdown`, and `vitest` config files.

## Global Rules

- Prefer minimal, targeted changes over broad refactors.
- Use package-scoped validation during development. Do not default to workspace-wide commands unless the task requires repo-wide verification.
- If a task changes an upstream package, rebuild that upstream package before validating downstream consumers.
- Keep all code, comments, default docs content, prompts, and templates in English.
- Keep the conversation language aligned with the user's chosen language and locale.
- Ask clarifying questions instead of guessing when ambiguity affects architecture, scope, safety, or acceptance criteria.
- In `tests`, `docs`, and `src` directories, do not reference absolute file system paths.
- Store durable task artifacts under `.ai/tasks/<task-id>/` rather than expanding this file with task-specific history.

## Quality Gates

- Run the smallest credible validation for the changed area before handoff.
- Run downstream validation when a change affects upstream packages or public behavior.
- Update tests and docs when behavior, public API, or user-facing guidance changes, or explicitly justify why no update was needed.
- Run `pnpm lint` and `pnpm test` before commit-time handoff unless the user asked for a narrower checkpoint.

## Clarification Policy

- Clarify before planning when the request leaves multiple reasonable interpretations.
- Clarify before implementation when the ambiguity could create rework, regressions, or incorrect public behavior.
- Clarify before skipping tests, docs updates, or downstream verification.

## Forbidden Actions

- Do not edit generated outputs in `dist/` or `coverage/`.
- Do not manually edit generated `pika.gen.*` files.
- Do not run workspace-wide `pnpm build` during iterative development.
- Do not guess through unclear requirements when a short clarification would remove risk.
