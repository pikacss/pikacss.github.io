---
name: kage-impact-routing
description: Authoritative monorepo dependency fan-out and downstream validation routing.
---

# Impact Routing Rules

## Scope

This file is the only authoritative dependency fan-out reference for implementation, testing, review, and docs updates.

## Dependency Graph

```plaintext
core
  -> integration
    -> unplugin
      -> nuxt

plugin-* -> core
docs -> unplugin, plugin-icons, plugin-reset
demo -> unplugin, plugin-icons, plugin-reset
```

## Change-Type Routing

### Core Changes

- Rebuild `@pikacss/core` before validating downstream consumers that rely on fresh public output.
- Validate `@pikacss/integration` and `@pikacss/unplugin-pikacss`.
- Validate `@pikacss/nuxt` when the changed surface can affect framework integration.
- Validate affected `plugin-*` packages when plugin hooks, plugin types, or shared core behavior changed.
- Check docs or demo updates when the change affects public behavior, generated output, or setup guidance.

### Integration Changes

- Validate `@pikacss/integration`.
- Validate `@pikacss/unplugin-pikacss`.
- Validate `@pikacss/nuxt` when the changed behavior can propagate through framework integration.
- Check docs or demo when generated output or integration-facing behavior changed.

### Unplugin Changes

- Validate `@pikacss/unplugin-pikacss`.
- Validate docs and demo flows that consume the plugin.
- Validate downstream framework-specific behavior when the changed surface affects Nuxt integration.

### Nuxt Changes

- Validate `@pikacss/nuxt`.
- Validate any docs guidance that describes Nuxt setup or usage.

### Plugin Changes

- Validate the changed `plugin-*` package.
- Validate `@pikacss/core` compatibility assumptions when the plugin depends on new hooks or changed core behavior.
- Update docs or demo if the plugin has user-facing setup or output changes.

### Docs Or Demo Changes

- Keep docs-only or demo-only work isolated unless the change reveals product behavior drift.
- If docs or demo updates expose incorrect package behavior, route back to the owning package instead of patching around it.

## Exceptions

- If a downstream check is intentionally skipped, state why the skip is safe.
- If a change stays entirely internal and cannot affect a downstream consumer, say so explicitly instead of silently omitting checks.

## Example Impact Matrix Entry

```md
## Impact Matrix

- changed_area: `packages/core`
- directly_impacted_packages:
  - `@pikacss/core`
  - `@pikacss/integration`
- required_downstream_checks:
  - `pnpm --filter @pikacss/core test`
  - `pnpm --filter @pikacss/core typecheck`
  - `pnpm --filter @pikacss/core build`
  - `pnpm --filter @pikacss/integration test`
- docs_impact: check if setup or generated output behavior changed
- demo_impact: check if the visible output changed
- notes: add unplugin validation when the changed surface reaches generated integration output
```
