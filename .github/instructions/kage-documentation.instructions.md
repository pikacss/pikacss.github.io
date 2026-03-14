---
name: kage-documentation-rules
description: Docs-site and demo update rules, including translation boundaries and docs artifacts.
applyTo: '{docs,demo}/**/*'
---

# Documentation Rules

## Scope

Use these rules when updating docs content, docs configuration, docs examples, or demo-facing user guidance.

## Docs Update Rules

- Treat docs changes as first-class work when public behavior, API shape, setup, or workflow guidance changes.
- Keep user-facing guidance aligned with actual package scripts and behavior.
- Prefer updating existing docs structure instead of creating parallel explanation paths.

## Docs And Demo Synchronization

- If a behavior change is visible in docs examples or the demo, update both sides when needed.
- Validate docs with `pnpm --filter @pikacss/docs typecheck`.
- Validate demo with `pnpm --dir demo build` or `pnpm --dir demo type-check` when user-facing behavior changes there.

## Docs Artifact Contract

When docs-facing work is part of the task, update or produce a `docs-checklist.md` artifact that states:

- which docs pages changed
- whether demo changes were required
- whether translation impact exists
- whether any user-facing debt remains intentionally deferred

## Translation Boundaries

- Keep generic docs authoring separate from zh-TW page translation and localized example translation.
- Preserve the existing split between generic documentation rules, page translation rules, and localized example rules.
- Do not create localized example copies when the established docs workflow expects shared snippet sources.

## LLM Markdown Rules

- Keep page descriptions concise and standalone-friendly.
- Preserve `llm-only` and `llm-exclude` semantics when updating docs content that already uses them.
- Do not hide canonical behavior or warnings behind LLM-only markup.

## Example Docs Handoff

```md
## Docs Handoff

- pages_updated: `docs/index.md`, `docs/getting-started/installation.md`
- demo_updated: no
- translation_impact: yes, zh-TW page mirror needed later
- validation_run: `pnpm --filter @pikacss/docs typecheck`
- remaining_docs_debt: add translated counterpart after English copy is approved
```
