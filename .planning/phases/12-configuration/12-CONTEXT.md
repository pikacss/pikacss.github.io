# Phase 12: Configuration - Context

**Gathered:** 2026-02-09
**Status:** Ready for planning

<domain>
## Phase Boundary

Create a consumable ESLint configuration package (`@pikacss/eslint-config`) that exports a Flat Config compatible preset. This package includes the `pika-build-time` rule implementation (from Phase 11) directly, without requiring a separate plugin package. It is an **additive** configuration meant to be used alongside existing JS/TS configs.

</domain>

<decisions>
## Implementation Decisions

### Configuration Scope
- **Additive**: The config only enables PikaCSS-specific rules. It does NOT include standard JS/TS rules or stylistic opinions.
- **Zero-dependency**: The package acts as both the plugin and the config. It does not depend on a separate `@pikacss/eslint-plugin` package.
- **Single Preset**: Only one `recommended` preset is exported. No complex tiers (strict/loose) for now.
- **TS Parser Agnostic**: The config does *not* configure `languageOptions.parser`. It assumes the user's environment (or other configs) has already set up a parser that can read the files.

### Consumption Pattern
- **Static Object**: The default export is a plugin object with a `configs.recommended` property (or similar static structure).
- **Usage**: Users import it and add it to their `eslint.config.js` array: `import pika from '@pikacss/eslint-config'; export default [ ...pika.configs.recommended ]`.
- **Single Entry Point**: All exports come from the package root. No subpaths like `/vue` or `/react`.

### Rule Severity
- **Error by Default**: `pika-build-time` violations are treated as **errors**, not warnings. This is because dynamic arguments cause build failures or missing CSS in PikaCSS.
- **Escape Hatches**: Users can use standard `// eslint-disable-next-line` comments if they absolutely need to bypass the rule (e.g., for legacy code or runtime hacks), though it's not recommended.

### Framework Support
- **Agnostic**: The rules operate on the AST provided by the parser. They work in `.js`, `.ts`, `.vue`, `.jsx`, etc., as long as the user has configured the appropriate parser for those files.
- **No Framework-Specific Presets**: We do not ship separate configs for Vue/React. The core rule logic is universal for `pika()` calls.

### Claude's Discretion
- **Internal Directory Structure**: How to organize the `src` folder (e.g. `src/configs/recommended.ts` vs `src/index.ts`).
- **Test Setup**: How to verify the config works (likely integration tests with a mock ESLint instance).

</decisions>

<specifics>
## Specific Ideas

- **Flat Config Native**: The output must be ready for ESLint 9+ Flat Config.
- **Keep it lightweight**: Since it's additive, minimize dependencies.

</specifics>

<deferred>
## Deferred Ideas

- **Strict/Stylistic Rules**: Future phases might add rules for enforcing PikaCSS best practices beyond just build-time correctness (e.g. sorting classes, grouping variants).
- **Runtime Engine Support**: If PikaCSS ever adds a runtime engine, we might need a separate config that allows dynamic arguments.

</deferred>

---

*Phase: 12-configuration*
*Context gathered: 2026-02-09*
