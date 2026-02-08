# Domain Pitfalls

**Domain:** Shared ESLint Configuration (Flat Config)
**Researched:** Sun Feb 08 2026

## Critical Pitfalls

Mistakes that cause rewrites or major issues.

### Pitfall 1: The "Implicit Peer Dependency" Trap
**What goes wrong:** In Flat Config, plugins are imported as JavaScript objects. If the shared config lists plugins as `peerDependencies` (like in the old `.eslintrc` days), the consumer *must* install them manually. If they don't, the shared config throws a runtime error (`Module not found`) when imported.
**Why it happens:** Developers apply legacy `.eslintrc` patterns (where ESLint resolved plugins by string name) to Flat Config (where Node.js resolves imports).
**Consequences:** broken linting, frustrating setup experience ("peer dependency hell").
**Prevention:** 
- **Bundle Plugins:** Add plugins as `dependencies` in `package.json`. Re-export them or use them directly in the shared config. This provides a "batteries-included" experience.
- **Explicit Factories:** If you *must* use peers (for extreme modularity), export a factory function that accepts plugin instances as arguments, making the dependency explicit.
**Detection:** `Error: Cannot find module 'eslint-plugin-foo'` when running ESLint in a consuming project.

### Pitfall 2: Duplicate Plugin Instances
**What goes wrong:** The shared config bundles `eslint-plugin-react` (v1), but the consumer project installs `eslint-plugin-react` (v2) for its own local overrides.
**Why it happens:** Flat Config allows multiple instances of a plugin. If the shared config uses one instance and the consumer uses another, they might have different rule definitions or internal state, leading to confusing behavior or type conflicts.
**Consequences:** Inconsistent rule application, TypeScript type errors in the config file.
**Prevention:**
- **Expose Plugins:** The shared config should export the plugin instances it uses (e.g., `export { pluginReact } from ...`). Consumers should use these exported instances for their overrides instead of importing their own.
- **Namespace Consistency:** Ensure the plugin namespace (the key in `plugins: {}`) is consistent.

### Pitfall 3: Monorepo Resolution & Hoisting (pnpm)
**What goes wrong:** In a pnpm monorepo, a package attempts to use the shared config, but fails to find dependencies that are nested within the shared config's `node_modules`.
**Why it happens:** pnpm's strict dependency isolation. If `eslint-plugin-foo` is a dependency of `@pikacss/eslint-config`, it is not automatically accessible to the consuming package unless hoisted or re-exported.
**Consequences:** `Module not found` errors, especially for plugins that rely on seeing the user's project structure (like `eslint-plugin-import`).
**Prevention:**
- **Public Hoist Pattern:** Use `.npmrc` with `public-hoist-pattern[]=*eslint*` (broad) or specific patterns.
- **Explicit Re-exports:** Re-export the config parts clearly.
- **Alias Resolution:** Ensure `eslint-plugin-import` / `import-x` resolvers are configured with correct `project` paths relative to the root, not the package.

## Moderate Pitfalls

Mistakes that cause delays or technical debt.

### Pitfall 1: "Global Ignores" Leakage
**What goes wrong:** The shared config includes a global `ignores: ['**/dist']`. When a consumer extends this, they might accidentally override it or be surprised that it applies globally to their *entire* ESLint run, not just the files covered by the shared config.
**Prevention:** 
- Be very careful with global ignores in shared configs.
- Prefer scoping ignores to specific file patterns if possible, or document them clearly.
- Remember: In Flat Config, an object with *only* `ignores` key is global. An object with `files` AND `ignores` is scoped.

### Pitfall 2: TypeScript Config Complexity
**What goes wrong:** `typescript-eslint` v8+ uses `tseslint.config(...)` which returns an array. If a shared config wraps this but returns a single object (or vice versa), composition becomes messy.
**Prevention:** 
- Standardize on exporting an **array** of config objects (the Flat Config standard).
- If using `tseslint.config`, ensure the return value is flattened or spread correctly before exporting.

### Pitfall 3: Missing Type Definitions
**What goes wrong:** Consumers using `eslint.config.ts` (via `tsx` or native support) import the shared config but get `any` or loose types.
**Prevention:**
- Write the shared config in TypeScript or use JSDoc + `d.ts` generation.
- Export specific types for any options objects passed to factory functions.

## Minor Pitfalls

Mistakes that cause annoyance but are fixable.

### Pitfall 1: Editor Integration Lag
**What goes wrong:** VS Code ESLint extension doesn't pick up the new config format or custom plugin rules immediately.
**Prevention:** Restart ESLint server frequently during dev. Ensure `eslint.config.js` is in the root or `eslint.workingDirectories` is set.

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| **Setup** | Dependency vs PeerDependency choice | Decide on "Batteries Included" (deps) vs "Minimal" (peers). Default to "Batteries Included" for internal monorepo configs. |
| **Implementation** | Plugin wrapping | Re-export plugin instances to avoid version conflicts. |
| **Consumption** | Overriding rules | Use the inspector (`npx @eslint/config-inspector`) to verify what actually applies. |

## Sources

- [ESLint: Shareable Configs](https://eslint.org/docs/latest/extend/shareable-configs) (Official)
- [Antfu ESLint Config](https://github.com/antfu/eslint-config) (Reference implementation)
- [Flat Config: Dependencies vs PeerDependencies](https://github.com/eslint/eslint/discussions/17369) (Community discussion)
