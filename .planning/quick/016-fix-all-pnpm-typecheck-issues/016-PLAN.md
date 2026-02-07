---
phase: quick
plan: 016
type: auto
objective: Fix all TypeScript type checking errors in the monorepo
---

# Plan: Fix all pnpm typecheck issues

The goal is to ensure `pnpm typecheck` passes cleanly across the entire monorepo.

## Tasks

<task>
<type>auto</type>
<name>Run initial typecheck</name>
<description>Run `pnpm typecheck` to capture the current state of errors.</description>
</task>

<task>
<type>auto</type>
<name>Fix type errors in core package</name>
<description>Fix any type errors identified in @pikacss/core.</description>
</task>

<task>
<type>auto</type>
<name>Fix type errors in integration package</name>
<description>Fix any type errors identified in @pikacss/integration.</description>
</task>

<task>
<type>auto</type>
<name>Fix type errors in unplugin package</name>
<description>Fix any type errors identified in @pikacss/unplugin-pikacss.</description>
</task>

<task>
<type>auto</type>
<name>Fix type errors in plugins</name>
<description>Fix any type errors identified in official plugins.</description>
</task>

<task>
<type>auto</type>
<name>Fix type errors in other packages</name>
<description>Fix any remaining type errors in other packages (docs, dev tools, etc).</description>
</task>

<task>
<type>auto</type>
<name>Verify clean typecheck</name>
<description>Run `pnpm typecheck` one last time to ensure everything is clean.</description>
</task>

## Verification
- `pnpm typecheck` returns exit code 0
