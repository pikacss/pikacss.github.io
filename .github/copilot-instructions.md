# Copilot Instructions — PikaCSS

This file exists as the VS Code Copilot always-on compatibility path for the repository.

The source of truth for repository-wide rules remains [AGENTS.md](../AGENTS.md). Task-specific behavior lives in [.github/instructions](./instructions), task entry points live in [.github/prompts](./prompts), and durable task artifacts live in [.ai/tasks](../.ai/tasks).

## Core Expectations

- Keep all repository content in English.
- Keep the conversation language aligned with the user's chosen locale.
- Prefer minimal, targeted changes over unrelated refactors.
- Ask clarifying questions before planning or implementation when ambiguity affects scope, architecture, safety, or validation.
- Use package-scoped validation during iterative development.
- Rebuild upstream packages before validating downstream consumers when public output changes.
- Update tests and docs when behavior or public API changes, or explicitly justify why no update is required.

## Important Constraints

- Do not edit generated outputs in `dist/` or `coverage/`.
- Do not manually edit generated `pika.gen.*` files.
- Do not run workspace-wide `pnpm build` during iterative development.
- Do not reference absolute file system paths inside `tests`, `docs`, or `src`.

## Workflow Routing

- Use the `kage-*` prompts and agents as the namespaced reusable workflow layer for staged or task-oriented work.
- Use `/kage-doctor` when an existing repository needs Kage adoption, workflow auditing, or foundation gap analysis.
- Use [global engineering rules](./instructions/kage-global-engineering.instructions.md) for shared engineering behavior.
- Use [planning rules](./instructions/kage-planning.instructions.md) and [impact routing rules](./instructions/kage-impact-routing.instructions.md) when defining scope or execution plans.
- Use [implementation rules](./instructions/kage-implementation.instructions.md), [testing rules](./instructions/kage-testing.instructions.md), and [review rules](./instructions/kage-review.instructions.md) for delivery and verification.
- Use [documentation rules](./instructions/kage-documentation.instructions.md) when docs or demo surfaces are affected.
