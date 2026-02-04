# API Verification Baseline

**Generated:** 2026-02-04
**Phase:** 3 - API Verification System
**Purpose:** Document current state of API documentation accuracy

This baseline captures all API mismatches, undocumented APIs, and contradictions
found in the documentation as of Phase 3 completion. Future phases (4-6) will
address these issues systematically.

**Note:** This is the INITIAL baseline. Zero tolerance policy takes effect after
Phase 7 completion. Until then, this baseline serves as improvement tracker.

**Packages verified:** 9 @pikacss/* packages

---

# API Verification Report

**Generated:** 2026-02-04T12:39:27.572Z

## Summary

| Metric | Value |
|--------|-------|
| Total APIs | 875 |
| Documented APIs | 48 |
| Coverage | 5.49% |
| Signature Mismatches | 96 ❌ |
| Contradictions | 10 ❌ |

## Package Coverage

### @pikacss/api-verifier ❌

- **Coverage:** 0.00% (0/25 APIs)
- **Mismatches:** 0

**Undocumented APIs:**

- `APIExtractionResult`
- `ComparisonResult`
- `Contradiction`
- `DocumentationType`
- `DocumentedAPI`
- `ExtractedAPI`
- `PackageCoverage`
- `PackageInfo`
- `SignatureMismatch`
- `VerificationReport`
- `calculateCoverage`
- `compareAPIs`
- `compareSignatures`
- `detectContradictions`
- `extractPackageAPIs`
- `generateJSONReport`
- `generateMarkdownReport`
- `generateReports`
- `getDocumentationType`
- `getMonorepoPackages`
- `getPackageEntryPoints`
- `normalizeSignature`
- `parseDocumentedAPIs`
- `verifyAllPackages`
- `verifyPackage`

### @pikacss/core ❌

- **Coverage:** 6.35% (4/63 APIs)
- **Mismatches:** 8

**Undocumented APIs:**

- `Arrayable`
- `Awaitable`
- `CSSProperty`
- `CSSSelector`
- `CSSStyleBlockBody`
- `CSSStyleBlocks`
- `DefineAutocomplete`
- `EngineConfig$1`
- `FromKebab`
- `GetValue`
- `IsEqual`
- `IsNever`
- `Keyframes`
- `KeyframesConfig`
- `KeyframesProgress`
- `Nullish`
- `PikaAugment`
- `Properties`
- `ResolveFrom`
- `Selector`
- `SelectorsConfig`
- `Shortcut`
- `ShortcutsConfig`
- `Simplify`
- `ToKebab`
- `UnionNumber`
- `UnionString`
- `UnionToIntersection`
- `Variable`
- `VariableAutocomplete`
- `VariableObject`
- `VariablesConfig`
- `VariablesDefinition`
- `appendAutocompleteCssPropertyValues`
- `appendAutocompleteExtraCssProperties`
- `appendAutocompleteExtraProperties`
- `appendAutocompletePropertyValues`
- `appendAutocompleteSelectors`
- `appendAutocompleteStyleItemStrings`
- `createEngine`
- `createLogger`
- `defineEngineConfig`
- `defineEnginePlugin`
- `defineKeyframes`
- `definePreflight`
- `defineSelector`
- `defineShortcut`
- `defineStyleDefinition`
- `defineVariables`
- `extractUsedVarNames`
- `important`
- `keyframes`
- `log`
- `normalizeVariableName`
- `renderCSSStyleBlocks`
- `resolveSelectorConfig`
- `selectors`
- `shortcuts`
- `variables`

### @pikacss/integration ❌

- **Coverage:** 5.88% (4/68 APIs)
- **Mismatches:** 8

**Undocumented APIs:**

- `FnUtils`
- `IntegrationContext`
- `IntegrationContextOptions`
- `UsageRecord`
- `createCtx`
- `Arrayable`
- `Awaitable`
- `CSSProperty`
- `CSSSelector`
- `CSSStyleBlockBody`
- `CSSStyleBlocks`
- `DefineAutocomplete`
- `EngineConfig$1`
- `FromKebab`
- `GetValue`
- `IsEqual`
- `IsNever`
- `Keyframes`
- `KeyframesConfig`
- `KeyframesProgress`
- `Nullish`
- `PikaAugment`
- `Properties`
- `ResolveFrom`
- `Selector`
- `SelectorsConfig`
- `Shortcut`
- `ShortcutsConfig`
- `Simplify`
- `ToKebab`
- `UnionNumber`
- `UnionString`
- `UnionToIntersection`
- `Variable`
- `VariableAutocomplete`
- `VariableObject`
- `VariablesConfig`
- `VariablesDefinition`
- `appendAutocompleteCssPropertyValues`
- `appendAutocompleteExtraCssProperties`
- `appendAutocompleteExtraProperties`
- `appendAutocompletePropertyValues`
- `appendAutocompleteSelectors`
- `appendAutocompleteStyleItemStrings`
- `createEngine`
- `createLogger`
- `defineEngineConfig`
- `defineEnginePlugin`
- `defineKeyframes`
- `definePreflight`
- `defineSelector`
- `defineShortcut`
- `defineStyleDefinition`
- `defineVariables`
- `extractUsedVarNames`
- `important`
- `keyframes`
- `log`
- `normalizeVariableName`
- `renderCSSStyleBlocks`
- `resolveSelectorConfig`
- `selectors`
- `shortcuts`
- `variables`

### @pikacss/nuxt-pikacss ❌

- **Coverage:** 5.56% (4/72 APIs)
- **Mismatches:** 8

**Undocumented APIs:**

- `ModuleOptions`
- `default`
- `PluginOptions`
- `ResolvedPluginOptions`
- `FnUtils`
- `IntegrationContext`
- `IntegrationContextOptions`
- `UsageRecord`
- `createCtx`
- `Arrayable`
- `Awaitable`
- `CSSProperty`
- `CSSSelector`
- `CSSStyleBlockBody`
- `CSSStyleBlocks`
- `DefineAutocomplete`
- `EngineConfig$1`
- `FromKebab`
- `GetValue`
- `IsEqual`
- `IsNever`
- `Keyframes`
- `KeyframesConfig`
- `KeyframesProgress`
- `Nullish`
- `PikaAugment`
- `Properties`
- `ResolveFrom`
- `Selector`
- `SelectorsConfig`
- `Shortcut`
- `ShortcutsConfig`
- `Simplify`
- `ToKebab`
- `UnionNumber`
- `UnionString`
- `UnionToIntersection`
- `Variable`
- `VariableAutocomplete`
- `VariableObject`
- `VariablesConfig`
- `VariablesDefinition`
- `appendAutocompleteCssPropertyValues`
- `appendAutocompleteExtraCssProperties`
- `appendAutocompleteExtraProperties`
- `appendAutocompletePropertyValues`
- `appendAutocompleteSelectors`
- `appendAutocompleteStyleItemStrings`
- `createEngine`
- `createLogger`
- `defineEngineConfig`
- `defineEnginePlugin`
- `defineKeyframes`
- `definePreflight`
- `defineSelector`
- `defineShortcut`
- `defineStyleDefinition`
- `defineVariables`
- `extractUsedVarNames`
- `important`
- `keyframes`
- `log`
- `normalizeVariableName`
- `renderCSSStyleBlocks`
- `resolveSelectorConfig`
- `selectors`
- `shortcuts`
- `variables`

### @pikacss/plugin-icons ❌

- **Coverage:** 0.00% (0/2 APIs)
- **Mismatches:** 0

**Undocumented APIs:**

- `IconsConfig`
- `icons`

### @pikacss/plugin-reset ❌

- **Coverage:** 0.00% (0/2 APIs)
- **Mismatches:** 0

**Undocumented APIs:**

- `ResetStyle`
- `reset`

### @pikacss/plugin-typography ❌

- **Coverage:** 0.00% (0/2 APIs)
- **Mismatches:** 0

**Undocumented APIs:**

- `TypographyPluginOptions`
- `typography`

### @pikacss/unplugin-pikacss ❌

- **Coverage:** 5.61% (32/570 APIs)
- **Mismatches:** 64

**Undocumented APIs:**

- `PluginOptions`
- `ResolvedPluginOptions`
- `default`
- `unplugin`
- `unpluginFactory`
- `FnUtils`
- `IntegrationContext`
- `IntegrationContextOptions`
- `UsageRecord`
- `createCtx`
- `Arrayable`
- `Awaitable`
- `CSSProperty`
- `CSSSelector`
- `CSSStyleBlockBody`
- `CSSStyleBlocks`
- `DefineAutocomplete`
- `EngineConfig$1`
- `FromKebab`
- `GetValue`
- `IsEqual`
- `IsNever`
- `Keyframes`
- `KeyframesConfig`
- `KeyframesProgress`
- `Nullish`
- `PikaAugment`
- `Properties`
- `ResolveFrom`
- `Selector`
- `SelectorsConfig`
- `Shortcut`
- `ShortcutsConfig`
- `Simplify`
- `ToKebab`
- `UnionNumber`
- `UnionString`
- `UnionToIntersection`
- `Variable`
- `VariableAutocomplete`
- `VariableObject`
- `VariablesConfig`
- `VariablesDefinition`
- `appendAutocompleteCssPropertyValues`
- `appendAutocompleteExtraCssProperties`
- `appendAutocompleteExtraProperties`
- `appendAutocompletePropertyValues`
- `appendAutocompleteSelectors`
- `appendAutocompleteStyleItemStrings`
- `createEngine`
- `createLogger`
- `defineEngineConfig`
- `defineEnginePlugin`
- `defineKeyframes`
- `definePreflight`
- `defineSelector`
- `defineShortcut`
- `defineStyleDefinition`
- `defineVariables`
- `extractUsedVarNames`
- `important`
- `keyframes`
- `log`
- `normalizeVariableName`
- `renderCSSStyleBlocks`
- `resolveSelectorConfig`
- `selectors`
- `shortcuts`
- `variables`
- `PluginOptions`
- `ResolvedPluginOptions`
- `default`
- `FnUtils`
- `IntegrationContext`
- `IntegrationContextOptions`
- `UsageRecord`
- `createCtx`
- `Arrayable`
- `Awaitable`
- `CSSProperty`
- `CSSSelector`
- `CSSStyleBlockBody`
- `CSSStyleBlocks`
- `DefineAutocomplete`
- `EngineConfig$1`
- `FromKebab`
- `GetValue`
- `IsEqual`
- `IsNever`
- `Keyframes`
- `KeyframesConfig`
- `KeyframesProgress`
- `Nullish`
- `PikaAugment`
- `Properties`
- `ResolveFrom`
- `Selector`
- `SelectorsConfig`
- `Shortcut`
- `ShortcutsConfig`
- `Simplify`
- `ToKebab`
- `UnionNumber`
- `UnionString`
- `UnionToIntersection`
- `Variable`
- `VariableAutocomplete`
- `VariableObject`
- `VariablesConfig`
- `VariablesDefinition`
- `appendAutocompleteCssPropertyValues`
- `appendAutocompleteExtraCssProperties`
- `appendAutocompleteExtraProperties`
- `appendAutocompletePropertyValues`
- `appendAutocompleteSelectors`
- `appendAutocompleteStyleItemStrings`
- `createEngine`
- `createLogger`
- `defineEngineConfig`
- `defineEnginePlugin`
- `defineKeyframes`
- `definePreflight`
- `defineSelector`
- `defineShortcut`
- `defineStyleDefinition`
- `defineVariables`
- `extractUsedVarNames`
- `important`
- `keyframes`
- `log`
- `normalizeVariableName`
- `renderCSSStyleBlocks`
- `resolveSelectorConfig`
- `selectors`
- `shortcuts`
- `variables`
- `PluginOptions`
- `ResolvedPluginOptions`
- `default`
- `FnUtils`
- `IntegrationContext`
- `IntegrationContextOptions`
- `UsageRecord`
- `createCtx`
- `Arrayable`
- `Awaitable`
- `CSSProperty`
- `CSSSelector`
- `CSSStyleBlockBody`
- `CSSStyleBlocks`
- `DefineAutocomplete`
- `EngineConfig$1`
- `FromKebab`
- `GetValue`
- `IsEqual`
- `IsNever`
- `Keyframes`
- `KeyframesConfig`
- `KeyframesProgress`
- `Nullish`
- `PikaAugment`
- `Properties`
- `ResolveFrom`
- `Selector`
- `SelectorsConfig`
- `Shortcut`
- `ShortcutsConfig`
- `Simplify`
- `ToKebab`
- `UnionNumber`
- `UnionString`
- `UnionToIntersection`
- `Variable`
- `VariableAutocomplete`
- `VariableObject`
- `VariablesConfig`
- `VariablesDefinition`
- `appendAutocompleteCssPropertyValues`
- `appendAutocompleteExtraCssProperties`
- `appendAutocompleteExtraProperties`
- `appendAutocompletePropertyValues`
- `appendAutocompleteSelectors`
- `appendAutocompleteStyleItemStrings`
- `createEngine`
- `createLogger`
- `defineEngineConfig`
- `defineEnginePlugin`
- `defineKeyframes`
- `definePreflight`
- `defineSelector`
- `defineShortcut`
- `defineStyleDefinition`
- `defineVariables`
- `extractUsedVarNames`
- `important`
- `keyframes`
- `log`
- `normalizeVariableName`
- `renderCSSStyleBlocks`
- `resolveSelectorConfig`
- `selectors`
- `shortcuts`
- `variables`
- `PluginOptions`
- `ResolvedPluginOptions`
- `default`
- `FnUtils`
- `IntegrationContext`
- `IntegrationContextOptions`
- `UsageRecord`
- `createCtx`
- `Arrayable`
- `Awaitable`
- `CSSProperty`
- `CSSSelector`
- `CSSStyleBlockBody`
- `CSSStyleBlocks`
- `DefineAutocomplete`
- `EngineConfig$1`
- `FromKebab`
- `GetValue`
- `IsEqual`
- `IsNever`
- `Keyframes`
- `KeyframesConfig`
- `KeyframesProgress`
- `Nullish`
- `PikaAugment`
- `Properties`
- `ResolveFrom`
- `Selector`
- `SelectorsConfig`
- `Shortcut`
- `ShortcutsConfig`
- `Simplify`
- `ToKebab`
- `UnionNumber`
- `UnionString`
- `UnionToIntersection`
- `Variable`
- `VariableAutocomplete`
- `VariableObject`
- `VariablesConfig`
- `VariablesDefinition`
- `appendAutocompleteCssPropertyValues`
- `appendAutocompleteExtraCssProperties`
- `appendAutocompleteExtraProperties`
- `appendAutocompletePropertyValues`
- `appendAutocompleteSelectors`
- `appendAutocompleteStyleItemStrings`
- `createEngine`
- `createLogger`
- `defineEngineConfig`
- `defineEnginePlugin`
- `defineKeyframes`
- `definePreflight`
- `defineSelector`
- `defineShortcut`
- `defineStyleDefinition`
- `defineVariables`
- `extractUsedVarNames`
- `important`
- `keyframes`
- `log`
- `normalizeVariableName`
- `renderCSSStyleBlocks`
- `resolveSelectorConfig`
- `selectors`
- `shortcuts`
- `variables`
- `PluginOptions`
- `ResolvedPluginOptions`
- `default`
- `FnUtils`
- `IntegrationContext`
- `IntegrationContextOptions`
- `UsageRecord`
- `createCtx`
- `Arrayable`
- `Awaitable`
- `CSSProperty`
- `CSSSelector`
- `CSSStyleBlockBody`
- `CSSStyleBlocks`
- `DefineAutocomplete`
- `EngineConfig$1`
- `FromKebab`
- `GetValue`
- `IsEqual`
- `IsNever`
- `Keyframes`
- `KeyframesConfig`
- `KeyframesProgress`
- `Nullish`
- `PikaAugment`
- `Properties`
- `ResolveFrom`
- `Selector`
- `SelectorsConfig`
- `Shortcut`
- `ShortcutsConfig`
- `Simplify`
- `ToKebab`
- `UnionNumber`
- `UnionString`
- `UnionToIntersection`
- `Variable`
- `VariableAutocomplete`
- `VariableObject`
- `VariablesConfig`
- `VariablesDefinition`
- `appendAutocompleteCssPropertyValues`
- `appendAutocompleteExtraCssProperties`
- `appendAutocompleteExtraProperties`
- `appendAutocompletePropertyValues`
- `appendAutocompleteSelectors`
- `appendAutocompleteStyleItemStrings`
- `createEngine`
- `createLogger`
- `defineEngineConfig`
- `defineEnginePlugin`
- `defineKeyframes`
- `definePreflight`
- `defineSelector`
- `defineShortcut`
- `defineStyleDefinition`
- `defineVariables`
- `extractUsedVarNames`
- `important`
- `keyframes`
- `log`
- `normalizeVariableName`
- `renderCSSStyleBlocks`
- `resolveSelectorConfig`
- `selectors`
- `shortcuts`
- `variables`
- `PluginOptions`
- `ResolvedPluginOptions`
- `default`
- `FnUtils`
- `IntegrationContext`
- `IntegrationContextOptions`
- `UsageRecord`
- `createCtx`
- `Arrayable`
- `Awaitable`
- `CSSProperty`
- `CSSSelector`
- `CSSStyleBlockBody`
- `CSSStyleBlocks`
- `DefineAutocomplete`
- `EngineConfig$1`
- `FromKebab`
- `GetValue`
- `IsEqual`
- `IsNever`
- `Keyframes`
- `KeyframesConfig`
- `KeyframesProgress`
- `Nullish`
- `PikaAugment`
- `Properties`
- `ResolveFrom`
- `Selector`
- `SelectorsConfig`
- `Shortcut`
- `ShortcutsConfig`
- `Simplify`
- `ToKebab`
- `UnionNumber`
- `UnionString`
- `UnionToIntersection`
- `Variable`
- `VariableAutocomplete`
- `VariableObject`
- `VariablesConfig`
- `VariablesDefinition`
- `appendAutocompleteCssPropertyValues`
- `appendAutocompleteExtraCssProperties`
- `appendAutocompleteExtraProperties`
- `appendAutocompletePropertyValues`
- `appendAutocompleteSelectors`
- `appendAutocompleteStyleItemStrings`
- `createEngine`
- `createLogger`
- `defineEngineConfig`
- `defineEnginePlugin`
- `defineKeyframes`
- `definePreflight`
- `defineSelector`
- `defineShortcut`
- `defineStyleDefinition`
- `defineVariables`
- `extractUsedVarNames`
- `important`
- `keyframes`
- `log`
- `normalizeVariableName`
- `renderCSSStyleBlocks`
- `resolveSelectorConfig`
- `selectors`
- `shortcuts`
- `variables`
- `PluginOptions`
- `ResolvedPluginOptions`
- `default`
- `FnUtils`
- `IntegrationContext`
- `IntegrationContextOptions`
- `UsageRecord`
- `createCtx`
- `Arrayable`
- `Awaitable`
- `CSSProperty`
- `CSSSelector`
- `CSSStyleBlockBody`
- `CSSStyleBlocks`
- `DefineAutocomplete`
- `EngineConfig$1`
- `FromKebab`
- `GetValue`
- `IsEqual`
- `IsNever`
- `Keyframes`
- `KeyframesConfig`
- `KeyframesProgress`
- `Nullish`
- `PikaAugment`
- `Properties`
- `ResolveFrom`
- `Selector`
- `SelectorsConfig`
- `Shortcut`
- `ShortcutsConfig`
- `Simplify`
- `ToKebab`
- `UnionNumber`
- `UnionString`
- `UnionToIntersection`
- `Variable`
- `VariableAutocomplete`
- `VariableObject`
- `VariablesConfig`
- `VariablesDefinition`
- `appendAutocompleteCssPropertyValues`
- `appendAutocompleteExtraCssProperties`
- `appendAutocompleteExtraProperties`
- `appendAutocompletePropertyValues`
- `appendAutocompleteSelectors`
- `appendAutocompleteStyleItemStrings`
- `createEngine`
- `createLogger`
- `defineEngineConfig`
- `defineEnginePlugin`
- `defineKeyframes`
- `definePreflight`
- `defineSelector`
- `defineShortcut`
- `defineStyleDefinition`
- `defineVariables`
- `extractUsedVarNames`
- `important`
- `keyframes`
- `log`
- `normalizeVariableName`
- `renderCSSStyleBlocks`
- `resolveSelectorConfig`
- `selectors`
- `shortcuts`
- `variables`
- `PluginOptions`
- `ResolvedPluginOptions`
- `default`
- `FnUtils`
- `IntegrationContext`
- `IntegrationContextOptions`
- `UsageRecord`
- `createCtx`
- `Arrayable`
- `Awaitable`
- `CSSProperty`
- `CSSSelector`
- `CSSStyleBlockBody`
- `CSSStyleBlocks`
- `DefineAutocomplete`
- `EngineConfig$1`
- `FromKebab`
- `GetValue`
- `IsEqual`
- `IsNever`
- `Keyframes`
- `KeyframesConfig`
- `KeyframesProgress`
- `Nullish`
- `PikaAugment`
- `Properties`
- `ResolveFrom`
- `Selector`
- `SelectorsConfig`
- `Shortcut`
- `ShortcutsConfig`
- `Simplify`
- `ToKebab`
- `UnionNumber`
- `UnionString`
- `UnionToIntersection`
- `Variable`
- `VariableAutocomplete`
- `VariableObject`
- `VariablesConfig`
- `VariablesDefinition`
- `appendAutocompleteCssPropertyValues`
- `appendAutocompleteExtraCssProperties`
- `appendAutocompleteExtraProperties`
- `appendAutocompletePropertyValues`
- `appendAutocompleteSelectors`
- `appendAutocompleteStyleItemStrings`
- `createEngine`
- `createLogger`
- `defineEngineConfig`
- `defineEnginePlugin`
- `defineKeyframes`
- `definePreflight`
- `defineSelector`
- `defineShortcut`
- `defineStyleDefinition`
- `defineVariables`
- `extractUsedVarNames`
- `important`
- `keyframes`
- `log`
- `normalizeVariableName`
- `renderCSSStyleBlocks`
- `resolveSelectorConfig`
- `selectors`
- `shortcuts`
- `variables`

### @pikacss/vite-plugin-pikacss ❌

- **Coverage:** 5.63% (4/71 APIs)
- **Mismatches:** 8

**Undocumented APIs:**

- `default`
- `PluginOptions`
- `ResolvedPluginOptions`
- `FnUtils`
- `IntegrationContext`
- `IntegrationContextOptions`
- `UsageRecord`
- `createCtx`
- `Arrayable`
- `Awaitable`
- `CSSProperty`
- `CSSSelector`
- `CSSStyleBlockBody`
- `CSSStyleBlocks`
- `DefineAutocomplete`
- `EngineConfig$1`
- `FromKebab`
- `GetValue`
- `IsEqual`
- `IsNever`
- `Keyframes`
- `KeyframesConfig`
- `KeyframesProgress`
- `Nullish`
- `PikaAugment`
- `Properties`
- `ResolveFrom`
- `Selector`
- `SelectorsConfig`
- `Shortcut`
- `ShortcutsConfig`
- `Simplify`
- `ToKebab`
- `UnionNumber`
- `UnionString`
- `UnionToIntersection`
- `Variable`
- `VariableAutocomplete`
- `VariableObject`
- `VariablesConfig`
- `VariablesDefinition`
- `appendAutocompleteCssPropertyValues`
- `appendAutocompleteExtraCssProperties`
- `appendAutocompleteExtraProperties`
- `appendAutocompletePropertyValues`
- `appendAutocompleteSelectors`
- `appendAutocompleteStyleItemStrings`
- `createEngine`
- `createLogger`
- `defineEngineConfig`
- `defineEnginePlugin`
- `defineKeyframes`
- `definePreflight`
- `defineSelector`
- `defineShortcut`
- `defineStyleDefinition`
- `defineVariables`
- `extractUsedVarNames`
- `important`
- `keyframes`
- `log`
- `normalizeVariableName`
- `renderCSSStyleBlocks`
- `resolveSelectorConfig`
- `selectors`
- `shortcuts`
- `variables`

## Signature Mismatches

### @pikacss/core

#### `Engine` (docs/llm/plugins.md:192)

**Expected (from source):**
```typescript
typeof Engine
```

**Documented:**
```typescript
interface Engine { myCustomMethod(): void }
```

**Differences:**
- API name differs: extracted(typeof) vs documented(interface)

#### `EnginePlugin` (docs/advanced/api-reference.md:369)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
interface EnginePlugin { name: string order?: 'pre' | 'post' configureRawConfig?: (config: EngineConfig) => Awaitable<EngineConfig | void> rawConfigConfigured?: (config: EngineConfig) => void configureResolvedConfig?: (config: ResolvedEngineConfig) => Awaitable<ResolvedEngineConfig | void> configureEngine?: (engine: Engine) => Awaitable<void> transformSelectors?: (selectors: string[]) => Awaitable<string[]> transformStyleItems?: (items: ResolvedStyleItem[]) => Awaitable<ResolvedStyleItem[]> transformStyleDefinitions?: (defs: ResolvedStyleDefinition[]) => Awaitable<ResolvedStyleDefinition[]> preflightUpdated?: () => void atomicStyleAdded?: (style: AtomicStyle) => void autocompleteConfigUpdated?: () => void }
```

**Differences:**
- Parameters differ: extracted(none) vs documented(config: EngineConfig)
- Return type differs: extracted(unknown) vs documented(Awaitable<EngineConfig | void> rawConfigConfigured?: (config: EngineConfig) => void configureResolvedConfig?: (config: ResolvedEngineConfig) => Awaitable<ResolvedEngineConfig | void> configureEngine?: (engine: Engine) => Awaitable<void> transformSelectors?: (selectors: string[]) => Awaitable<string[]> transformStyleItems?: (items: ResolvedStyleItem[]) => Awaitable<ResolvedStyleItem[]> transformStyleDefinitions?: (defs: ResolvedStyleDefinition[]) => Awaitable<ResolvedStyleDefinition[]> preflightUpdated?: () => void atomicStyleAdded?: (style: AtomicStyle) => void autocompleteConfigUpdated?: () => void })

#### `EnginePlugin` (docs/llm/api-reference.md:292)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
interface EnginePlugin { name: string order?: 'pre' | 'post' configureRawConfig?: (config: EngineConfig) => Awaitable<EngineConfig | void> rawConfigConfigured?: (config: EngineConfig) => void configureResolvedConfig?: (config: ResolvedEngineConfig) => Awaitable<ResolvedEngineConfig | void> configureEngine?: (engine: Engine) => Awaitable<void> transformSelectors?: (selectors: string[]) => Awaitable<string[]> transformStyleItems?: (items: ResolvedStyleItem[]) => Awaitable<ResolvedStyleItem[]> transformStyleDefinitions?: (defs: ResolvedStyleDefinition[]) => Awaitable<ResolvedStyleDefinition[]> preflightUpdated?: () => void atomicStyleAdded?: (style: AtomicStyle) => void autocompleteConfigUpdated?: () => void }
```

**Differences:**
- API name differs: extracted(any) vs documented(interface)

#### `StyleDefinition` (docs/advanced/api-reference.md:323)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
interface StyleDefinition { [key: string]: string | number | StyleDefinition __important?: boolean __shortcut?: string | string[] }
```

**Differences:**
- Signature format or structure differs

#### `StyleDefinition` (docs/llm/api-reference.md:249)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
interface StyleDefinition { [key: string]: string | number | StyleDefinition __important?: boolean __shortcut?: string | string[] }
```

**Differences:**
- API name differs: extracted(any) vs documented(interface)

#### `StyleDefinition` (docs/llm/architecture.md:70)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
interface StyleDefinition { [key: string]: string | number | StyleDefinition }
```

**Differences:**
- API name differs: extracted(any) vs documented(interface)

#### `StyleItem` (docs/advanced/api-reference.md:315)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
type StyleItem = string | StyleDefinition | StyleItem[]
```

**Differences:**
- Signature format or structure differs

#### `StyleItem` (docs/llm/api-reference.md:242)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
type StyleItem = string | StyleDefinition | StyleItem[]
```

**Differences:**
- API name differs: extracted(any) vs documented(type)

### @pikacss/integration

#### `Engine` (docs/llm/plugins.md:192)

**Expected (from source):**
```typescript
typeof Engine
```

**Documented:**
```typescript
interface Engine { myCustomMethod(): void }
```

**Differences:**
- API name differs: extracted(typeof) vs documented(interface)

#### `EnginePlugin` (docs/advanced/api-reference.md:369)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
interface EnginePlugin { name: string order?: 'pre' | 'post' configureRawConfig?: (config: EngineConfig) => Awaitable<EngineConfig | void> rawConfigConfigured?: (config: EngineConfig) => void configureResolvedConfig?: (config: ResolvedEngineConfig) => Awaitable<ResolvedEngineConfig | void> configureEngine?: (engine: Engine) => Awaitable<void> transformSelectors?: (selectors: string[]) => Awaitable<string[]> transformStyleItems?: (items: ResolvedStyleItem[]) => Awaitable<ResolvedStyleItem[]> transformStyleDefinitions?: (defs: ResolvedStyleDefinition[]) => Awaitable<ResolvedStyleDefinition[]> preflightUpdated?: () => void atomicStyleAdded?: (style: AtomicStyle) => void autocompleteConfigUpdated?: () => void }
```

**Differences:**
- Parameters differ: extracted(none) vs documented(config: EngineConfig)
- Return type differs: extracted(unknown) vs documented(Awaitable<EngineConfig | void> rawConfigConfigured?: (config: EngineConfig) => void configureResolvedConfig?: (config: ResolvedEngineConfig) => Awaitable<ResolvedEngineConfig | void> configureEngine?: (engine: Engine) => Awaitable<void> transformSelectors?: (selectors: string[]) => Awaitable<string[]> transformStyleItems?: (items: ResolvedStyleItem[]) => Awaitable<ResolvedStyleItem[]> transformStyleDefinitions?: (defs: ResolvedStyleDefinition[]) => Awaitable<ResolvedStyleDefinition[]> preflightUpdated?: () => void atomicStyleAdded?: (style: AtomicStyle) => void autocompleteConfigUpdated?: () => void })

#### `EnginePlugin` (docs/llm/api-reference.md:292)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
interface EnginePlugin { name: string order?: 'pre' | 'post' configureRawConfig?: (config: EngineConfig) => Awaitable<EngineConfig | void> rawConfigConfigured?: (config: EngineConfig) => void configureResolvedConfig?: (config: ResolvedEngineConfig) => Awaitable<ResolvedEngineConfig | void> configureEngine?: (engine: Engine) => Awaitable<void> transformSelectors?: (selectors: string[]) => Awaitable<string[]> transformStyleItems?: (items: ResolvedStyleItem[]) => Awaitable<ResolvedStyleItem[]> transformStyleDefinitions?: (defs: ResolvedStyleDefinition[]) => Awaitable<ResolvedStyleDefinition[]> preflightUpdated?: () => void atomicStyleAdded?: (style: AtomicStyle) => void autocompleteConfigUpdated?: () => void }
```

**Differences:**
- API name differs: extracted(any) vs documented(interface)

#### `StyleDefinition` (docs/advanced/api-reference.md:323)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
interface StyleDefinition { [key: string]: string | number | StyleDefinition __important?: boolean __shortcut?: string | string[] }
```

**Differences:**
- Signature format or structure differs

#### `StyleDefinition` (docs/llm/api-reference.md:249)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
interface StyleDefinition { [key: string]: string | number | StyleDefinition __important?: boolean __shortcut?: string | string[] }
```

**Differences:**
- API name differs: extracted(any) vs documented(interface)

#### `StyleDefinition` (docs/llm/architecture.md:70)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
interface StyleDefinition { [key: string]: string | number | StyleDefinition }
```

**Differences:**
- API name differs: extracted(any) vs documented(interface)

#### `StyleItem` (docs/advanced/api-reference.md:315)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
type StyleItem = string | StyleDefinition | StyleItem[]
```

**Differences:**
- Signature format or structure differs

#### `StyleItem` (docs/llm/api-reference.md:242)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
type StyleItem = string | StyleDefinition | StyleItem[]
```

**Differences:**
- API name differs: extracted(any) vs documented(type)

### @pikacss/nuxt-pikacss

#### `Engine` (docs/llm/plugins.md:192)

**Expected (from source):**
```typescript
typeof Engine
```

**Documented:**
```typescript
interface Engine { myCustomMethod(): void }
```

**Differences:**
- API name differs: extracted(typeof) vs documented(interface)

#### `EnginePlugin` (docs/advanced/api-reference.md:369)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
interface EnginePlugin { name: string order?: 'pre' | 'post' configureRawConfig?: (config: EngineConfig) => Awaitable<EngineConfig | void> rawConfigConfigured?: (config: EngineConfig) => void configureResolvedConfig?: (config: ResolvedEngineConfig) => Awaitable<ResolvedEngineConfig | void> configureEngine?: (engine: Engine) => Awaitable<void> transformSelectors?: (selectors: string[]) => Awaitable<string[]> transformStyleItems?: (items: ResolvedStyleItem[]) => Awaitable<ResolvedStyleItem[]> transformStyleDefinitions?: (defs: ResolvedStyleDefinition[]) => Awaitable<ResolvedStyleDefinition[]> preflightUpdated?: () => void atomicStyleAdded?: (style: AtomicStyle) => void autocompleteConfigUpdated?: () => void }
```

**Differences:**
- Parameters differ: extracted(none) vs documented(config: EngineConfig)
- Return type differs: extracted(unknown) vs documented(Awaitable<EngineConfig | void> rawConfigConfigured?: (config: EngineConfig) => void configureResolvedConfig?: (config: ResolvedEngineConfig) => Awaitable<ResolvedEngineConfig | void> configureEngine?: (engine: Engine) => Awaitable<void> transformSelectors?: (selectors: string[]) => Awaitable<string[]> transformStyleItems?: (items: ResolvedStyleItem[]) => Awaitable<ResolvedStyleItem[]> transformStyleDefinitions?: (defs: ResolvedStyleDefinition[]) => Awaitable<ResolvedStyleDefinition[]> preflightUpdated?: () => void atomicStyleAdded?: (style: AtomicStyle) => void autocompleteConfigUpdated?: () => void })

#### `EnginePlugin` (docs/llm/api-reference.md:292)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
interface EnginePlugin { name: string order?: 'pre' | 'post' configureRawConfig?: (config: EngineConfig) => Awaitable<EngineConfig | void> rawConfigConfigured?: (config: EngineConfig) => void configureResolvedConfig?: (config: ResolvedEngineConfig) => Awaitable<ResolvedEngineConfig | void> configureEngine?: (engine: Engine) => Awaitable<void> transformSelectors?: (selectors: string[]) => Awaitable<string[]> transformStyleItems?: (items: ResolvedStyleItem[]) => Awaitable<ResolvedStyleItem[]> transformStyleDefinitions?: (defs: ResolvedStyleDefinition[]) => Awaitable<ResolvedStyleDefinition[]> preflightUpdated?: () => void atomicStyleAdded?: (style: AtomicStyle) => void autocompleteConfigUpdated?: () => void }
```

**Differences:**
- API name differs: extracted(any) vs documented(interface)

#### `StyleDefinition` (docs/advanced/api-reference.md:323)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
interface StyleDefinition { [key: string]: string | number | StyleDefinition __important?: boolean __shortcut?: string | string[] }
```

**Differences:**
- Signature format or structure differs

#### `StyleDefinition` (docs/llm/api-reference.md:249)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
interface StyleDefinition { [key: string]: string | number | StyleDefinition __important?: boolean __shortcut?: string | string[] }
```

**Differences:**
- API name differs: extracted(any) vs documented(interface)

#### `StyleDefinition` (docs/llm/architecture.md:70)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
interface StyleDefinition { [key: string]: string | number | StyleDefinition }
```

**Differences:**
- API name differs: extracted(any) vs documented(interface)

#### `StyleItem` (docs/advanced/api-reference.md:315)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
type StyleItem = string | StyleDefinition | StyleItem[]
```

**Differences:**
- Signature format or structure differs

#### `StyleItem` (docs/llm/api-reference.md:242)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
type StyleItem = string | StyleDefinition | StyleItem[]
```

**Differences:**
- API name differs: extracted(any) vs documented(type)

### @pikacss/unplugin-pikacss

#### `Engine` (docs/llm/plugins.md:192)

**Expected (from source):**
```typescript
typeof Engine
```

**Documented:**
```typescript
interface Engine { myCustomMethod(): void }
```

**Differences:**
- API name differs: extracted(typeof) vs documented(interface)

#### `EnginePlugin` (docs/advanced/api-reference.md:369)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
interface EnginePlugin { name: string order?: 'pre' | 'post' configureRawConfig?: (config: EngineConfig) => Awaitable<EngineConfig | void> rawConfigConfigured?: (config: EngineConfig) => void configureResolvedConfig?: (config: ResolvedEngineConfig) => Awaitable<ResolvedEngineConfig | void> configureEngine?: (engine: Engine) => Awaitable<void> transformSelectors?: (selectors: string[]) => Awaitable<string[]> transformStyleItems?: (items: ResolvedStyleItem[]) => Awaitable<ResolvedStyleItem[]> transformStyleDefinitions?: (defs: ResolvedStyleDefinition[]) => Awaitable<ResolvedStyleDefinition[]> preflightUpdated?: () => void atomicStyleAdded?: (style: AtomicStyle) => void autocompleteConfigUpdated?: () => void }
```

**Differences:**
- Parameters differ: extracted(none) vs documented(config: EngineConfig)
- Return type differs: extracted(unknown) vs documented(Awaitable<EngineConfig | void> rawConfigConfigured?: (config: EngineConfig) => void configureResolvedConfig?: (config: ResolvedEngineConfig) => Awaitable<ResolvedEngineConfig | void> configureEngine?: (engine: Engine) => Awaitable<void> transformSelectors?: (selectors: string[]) => Awaitable<string[]> transformStyleItems?: (items: ResolvedStyleItem[]) => Awaitable<ResolvedStyleItem[]> transformStyleDefinitions?: (defs: ResolvedStyleDefinition[]) => Awaitable<ResolvedStyleDefinition[]> preflightUpdated?: () => void atomicStyleAdded?: (style: AtomicStyle) => void autocompleteConfigUpdated?: () => void })

#### `EnginePlugin` (docs/llm/api-reference.md:292)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
interface EnginePlugin { name: string order?: 'pre' | 'post' configureRawConfig?: (config: EngineConfig) => Awaitable<EngineConfig | void> rawConfigConfigured?: (config: EngineConfig) => void configureResolvedConfig?: (config: ResolvedEngineConfig) => Awaitable<ResolvedEngineConfig | void> configureEngine?: (engine: Engine) => Awaitable<void> transformSelectors?: (selectors: string[]) => Awaitable<string[]> transformStyleItems?: (items: ResolvedStyleItem[]) => Awaitable<ResolvedStyleItem[]> transformStyleDefinitions?: (defs: ResolvedStyleDefinition[]) => Awaitable<ResolvedStyleDefinition[]> preflightUpdated?: () => void atomicStyleAdded?: (style: AtomicStyle) => void autocompleteConfigUpdated?: () => void }
```

**Differences:**
- API name differs: extracted(any) vs documented(interface)

#### `StyleDefinition` (docs/advanced/api-reference.md:323)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
interface StyleDefinition { [key: string]: string | number | StyleDefinition __important?: boolean __shortcut?: string | string[] }
```

**Differences:**
- Signature format or structure differs

#### `StyleDefinition` (docs/llm/api-reference.md:249)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
interface StyleDefinition { [key: string]: string | number | StyleDefinition __important?: boolean __shortcut?: string | string[] }
```

**Differences:**
- API name differs: extracted(any) vs documented(interface)

#### `StyleDefinition` (docs/llm/architecture.md:70)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
interface StyleDefinition { [key: string]: string | number | StyleDefinition }
```

**Differences:**
- API name differs: extracted(any) vs documented(interface)

#### `StyleItem` (docs/advanced/api-reference.md:315)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
type StyleItem = string | StyleDefinition | StyleItem[]
```

**Differences:**
- Signature format or structure differs

#### `StyleItem` (docs/llm/api-reference.md:242)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
type StyleItem = string | StyleDefinition | StyleItem[]
```

**Differences:**
- API name differs: extracted(any) vs documented(type)

#### `Engine` (docs/llm/plugins.md:192)

**Expected (from source):**
```typescript
typeof Engine
```

**Documented:**
```typescript
interface Engine { myCustomMethod(): void }
```

**Differences:**
- API name differs: extracted(typeof) vs documented(interface)

#### `EnginePlugin` (docs/advanced/api-reference.md:369)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
interface EnginePlugin { name: string order?: 'pre' | 'post' configureRawConfig?: (config: EngineConfig) => Awaitable<EngineConfig | void> rawConfigConfigured?: (config: EngineConfig) => void configureResolvedConfig?: (config: ResolvedEngineConfig) => Awaitable<ResolvedEngineConfig | void> configureEngine?: (engine: Engine) => Awaitable<void> transformSelectors?: (selectors: string[]) => Awaitable<string[]> transformStyleItems?: (items: ResolvedStyleItem[]) => Awaitable<ResolvedStyleItem[]> transformStyleDefinitions?: (defs: ResolvedStyleDefinition[]) => Awaitable<ResolvedStyleDefinition[]> preflightUpdated?: () => void atomicStyleAdded?: (style: AtomicStyle) => void autocompleteConfigUpdated?: () => void }
```

**Differences:**
- Parameters differ: extracted(none) vs documented(config: EngineConfig)
- Return type differs: extracted(unknown) vs documented(Awaitable<EngineConfig | void> rawConfigConfigured?: (config: EngineConfig) => void configureResolvedConfig?: (config: ResolvedEngineConfig) => Awaitable<ResolvedEngineConfig | void> configureEngine?: (engine: Engine) => Awaitable<void> transformSelectors?: (selectors: string[]) => Awaitable<string[]> transformStyleItems?: (items: ResolvedStyleItem[]) => Awaitable<ResolvedStyleItem[]> transformStyleDefinitions?: (defs: ResolvedStyleDefinition[]) => Awaitable<ResolvedStyleDefinition[]> preflightUpdated?: () => void atomicStyleAdded?: (style: AtomicStyle) => void autocompleteConfigUpdated?: () => void })

#### `EnginePlugin` (docs/llm/api-reference.md:292)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
interface EnginePlugin { name: string order?: 'pre' | 'post' configureRawConfig?: (config: EngineConfig) => Awaitable<EngineConfig | void> rawConfigConfigured?: (config: EngineConfig) => void configureResolvedConfig?: (config: ResolvedEngineConfig) => Awaitable<ResolvedEngineConfig | void> configureEngine?: (engine: Engine) => Awaitable<void> transformSelectors?: (selectors: string[]) => Awaitable<string[]> transformStyleItems?: (items: ResolvedStyleItem[]) => Awaitable<ResolvedStyleItem[]> transformStyleDefinitions?: (defs: ResolvedStyleDefinition[]) => Awaitable<ResolvedStyleDefinition[]> preflightUpdated?: () => void atomicStyleAdded?: (style: AtomicStyle) => void autocompleteConfigUpdated?: () => void }
```

**Differences:**
- API name differs: extracted(any) vs documented(interface)

#### `StyleDefinition` (docs/advanced/api-reference.md:323)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
interface StyleDefinition { [key: string]: string | number | StyleDefinition __important?: boolean __shortcut?: string | string[] }
```

**Differences:**
- Signature format or structure differs

#### `StyleDefinition` (docs/llm/api-reference.md:249)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
interface StyleDefinition { [key: string]: string | number | StyleDefinition __important?: boolean __shortcut?: string | string[] }
```

**Differences:**
- API name differs: extracted(any) vs documented(interface)

#### `StyleDefinition` (docs/llm/architecture.md:70)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
interface StyleDefinition { [key: string]: string | number | StyleDefinition }
```

**Differences:**
- API name differs: extracted(any) vs documented(interface)

#### `StyleItem` (docs/advanced/api-reference.md:315)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
type StyleItem = string | StyleDefinition | StyleItem[]
```

**Differences:**
- Signature format or structure differs

#### `StyleItem` (docs/llm/api-reference.md:242)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
type StyleItem = string | StyleDefinition | StyleItem[]
```

**Differences:**
- API name differs: extracted(any) vs documented(type)

#### `Engine` (docs/llm/plugins.md:192)

**Expected (from source):**
```typescript
typeof Engine
```

**Documented:**
```typescript
interface Engine { myCustomMethod(): void }
```

**Differences:**
- API name differs: extracted(typeof) vs documented(interface)

#### `EnginePlugin` (docs/advanced/api-reference.md:369)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
interface EnginePlugin { name: string order?: 'pre' | 'post' configureRawConfig?: (config: EngineConfig) => Awaitable<EngineConfig | void> rawConfigConfigured?: (config: EngineConfig) => void configureResolvedConfig?: (config: ResolvedEngineConfig) => Awaitable<ResolvedEngineConfig | void> configureEngine?: (engine: Engine) => Awaitable<void> transformSelectors?: (selectors: string[]) => Awaitable<string[]> transformStyleItems?: (items: ResolvedStyleItem[]) => Awaitable<ResolvedStyleItem[]> transformStyleDefinitions?: (defs: ResolvedStyleDefinition[]) => Awaitable<ResolvedStyleDefinition[]> preflightUpdated?: () => void atomicStyleAdded?: (style: AtomicStyle) => void autocompleteConfigUpdated?: () => void }
```

**Differences:**
- Parameters differ: extracted(none) vs documented(config: EngineConfig)
- Return type differs: extracted(unknown) vs documented(Awaitable<EngineConfig | void> rawConfigConfigured?: (config: EngineConfig) => void configureResolvedConfig?: (config: ResolvedEngineConfig) => Awaitable<ResolvedEngineConfig | void> configureEngine?: (engine: Engine) => Awaitable<void> transformSelectors?: (selectors: string[]) => Awaitable<string[]> transformStyleItems?: (items: ResolvedStyleItem[]) => Awaitable<ResolvedStyleItem[]> transformStyleDefinitions?: (defs: ResolvedStyleDefinition[]) => Awaitable<ResolvedStyleDefinition[]> preflightUpdated?: () => void atomicStyleAdded?: (style: AtomicStyle) => void autocompleteConfigUpdated?: () => void })

#### `EnginePlugin` (docs/llm/api-reference.md:292)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
interface EnginePlugin { name: string order?: 'pre' | 'post' configureRawConfig?: (config: EngineConfig) => Awaitable<EngineConfig | void> rawConfigConfigured?: (config: EngineConfig) => void configureResolvedConfig?: (config: ResolvedEngineConfig) => Awaitable<ResolvedEngineConfig | void> configureEngine?: (engine: Engine) => Awaitable<void> transformSelectors?: (selectors: string[]) => Awaitable<string[]> transformStyleItems?: (items: ResolvedStyleItem[]) => Awaitable<ResolvedStyleItem[]> transformStyleDefinitions?: (defs: ResolvedStyleDefinition[]) => Awaitable<ResolvedStyleDefinition[]> preflightUpdated?: () => void atomicStyleAdded?: (style: AtomicStyle) => void autocompleteConfigUpdated?: () => void }
```

**Differences:**
- API name differs: extracted(any) vs documented(interface)

#### `StyleDefinition` (docs/advanced/api-reference.md:323)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
interface StyleDefinition { [key: string]: string | number | StyleDefinition __important?: boolean __shortcut?: string | string[] }
```

**Differences:**
- Signature format or structure differs

#### `StyleDefinition` (docs/llm/api-reference.md:249)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
interface StyleDefinition { [key: string]: string | number | StyleDefinition __important?: boolean __shortcut?: string | string[] }
```

**Differences:**
- API name differs: extracted(any) vs documented(interface)

#### `StyleDefinition` (docs/llm/architecture.md:70)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
interface StyleDefinition { [key: string]: string | number | StyleDefinition }
```

**Differences:**
- API name differs: extracted(any) vs documented(interface)

#### `StyleItem` (docs/advanced/api-reference.md:315)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
type StyleItem = string | StyleDefinition | StyleItem[]
```

**Differences:**
- Signature format or structure differs

#### `StyleItem` (docs/llm/api-reference.md:242)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
type StyleItem = string | StyleDefinition | StyleItem[]
```

**Differences:**
- API name differs: extracted(any) vs documented(type)

#### `Engine` (docs/llm/plugins.md:192)

**Expected (from source):**
```typescript
typeof Engine
```

**Documented:**
```typescript
interface Engine { myCustomMethod(): void }
```

**Differences:**
- API name differs: extracted(typeof) vs documented(interface)

#### `EnginePlugin` (docs/advanced/api-reference.md:369)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
interface EnginePlugin { name: string order?: 'pre' | 'post' configureRawConfig?: (config: EngineConfig) => Awaitable<EngineConfig | void> rawConfigConfigured?: (config: EngineConfig) => void configureResolvedConfig?: (config: ResolvedEngineConfig) => Awaitable<ResolvedEngineConfig | void> configureEngine?: (engine: Engine) => Awaitable<void> transformSelectors?: (selectors: string[]) => Awaitable<string[]> transformStyleItems?: (items: ResolvedStyleItem[]) => Awaitable<ResolvedStyleItem[]> transformStyleDefinitions?: (defs: ResolvedStyleDefinition[]) => Awaitable<ResolvedStyleDefinition[]> preflightUpdated?: () => void atomicStyleAdded?: (style: AtomicStyle) => void autocompleteConfigUpdated?: () => void }
```

**Differences:**
- Parameters differ: extracted(none) vs documented(config: EngineConfig)
- Return type differs: extracted(unknown) vs documented(Awaitable<EngineConfig | void> rawConfigConfigured?: (config: EngineConfig) => void configureResolvedConfig?: (config: ResolvedEngineConfig) => Awaitable<ResolvedEngineConfig | void> configureEngine?: (engine: Engine) => Awaitable<void> transformSelectors?: (selectors: string[]) => Awaitable<string[]> transformStyleItems?: (items: ResolvedStyleItem[]) => Awaitable<ResolvedStyleItem[]> transformStyleDefinitions?: (defs: ResolvedStyleDefinition[]) => Awaitable<ResolvedStyleDefinition[]> preflightUpdated?: () => void atomicStyleAdded?: (style: AtomicStyle) => void autocompleteConfigUpdated?: () => void })

#### `EnginePlugin` (docs/llm/api-reference.md:292)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
interface EnginePlugin { name: string order?: 'pre' | 'post' configureRawConfig?: (config: EngineConfig) => Awaitable<EngineConfig | void> rawConfigConfigured?: (config: EngineConfig) => void configureResolvedConfig?: (config: ResolvedEngineConfig) => Awaitable<ResolvedEngineConfig | void> configureEngine?: (engine: Engine) => Awaitable<void> transformSelectors?: (selectors: string[]) => Awaitable<string[]> transformStyleItems?: (items: ResolvedStyleItem[]) => Awaitable<ResolvedStyleItem[]> transformStyleDefinitions?: (defs: ResolvedStyleDefinition[]) => Awaitable<ResolvedStyleDefinition[]> preflightUpdated?: () => void atomicStyleAdded?: (style: AtomicStyle) => void autocompleteConfigUpdated?: () => void }
```

**Differences:**
- API name differs: extracted(any) vs documented(interface)

#### `StyleDefinition` (docs/advanced/api-reference.md:323)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
interface StyleDefinition { [key: string]: string | number | StyleDefinition __important?: boolean __shortcut?: string | string[] }
```

**Differences:**
- Signature format or structure differs

#### `StyleDefinition` (docs/llm/api-reference.md:249)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
interface StyleDefinition { [key: string]: string | number | StyleDefinition __important?: boolean __shortcut?: string | string[] }
```

**Differences:**
- API name differs: extracted(any) vs documented(interface)

#### `StyleDefinition` (docs/llm/architecture.md:70)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
interface StyleDefinition { [key: string]: string | number | StyleDefinition }
```

**Differences:**
- API name differs: extracted(any) vs documented(interface)

#### `StyleItem` (docs/advanced/api-reference.md:315)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
type StyleItem = string | StyleDefinition | StyleItem[]
```

**Differences:**
- Signature format or structure differs

#### `StyleItem` (docs/llm/api-reference.md:242)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
type StyleItem = string | StyleDefinition | StyleItem[]
```

**Differences:**
- API name differs: extracted(any) vs documented(type)

#### `Engine` (docs/llm/plugins.md:192)

**Expected (from source):**
```typescript
typeof Engine
```

**Documented:**
```typescript
interface Engine { myCustomMethod(): void }
```

**Differences:**
- API name differs: extracted(typeof) vs documented(interface)

#### `EnginePlugin` (docs/advanced/api-reference.md:369)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
interface EnginePlugin { name: string order?: 'pre' | 'post' configureRawConfig?: (config: EngineConfig) => Awaitable<EngineConfig | void> rawConfigConfigured?: (config: EngineConfig) => void configureResolvedConfig?: (config: ResolvedEngineConfig) => Awaitable<ResolvedEngineConfig | void> configureEngine?: (engine: Engine) => Awaitable<void> transformSelectors?: (selectors: string[]) => Awaitable<string[]> transformStyleItems?: (items: ResolvedStyleItem[]) => Awaitable<ResolvedStyleItem[]> transformStyleDefinitions?: (defs: ResolvedStyleDefinition[]) => Awaitable<ResolvedStyleDefinition[]> preflightUpdated?: () => void atomicStyleAdded?: (style: AtomicStyle) => void autocompleteConfigUpdated?: () => void }
```

**Differences:**
- Parameters differ: extracted(none) vs documented(config: EngineConfig)
- Return type differs: extracted(unknown) vs documented(Awaitable<EngineConfig | void> rawConfigConfigured?: (config: EngineConfig) => void configureResolvedConfig?: (config: ResolvedEngineConfig) => Awaitable<ResolvedEngineConfig | void> configureEngine?: (engine: Engine) => Awaitable<void> transformSelectors?: (selectors: string[]) => Awaitable<string[]> transformStyleItems?: (items: ResolvedStyleItem[]) => Awaitable<ResolvedStyleItem[]> transformStyleDefinitions?: (defs: ResolvedStyleDefinition[]) => Awaitable<ResolvedStyleDefinition[]> preflightUpdated?: () => void atomicStyleAdded?: (style: AtomicStyle) => void autocompleteConfigUpdated?: () => void })

#### `EnginePlugin` (docs/llm/api-reference.md:292)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
interface EnginePlugin { name: string order?: 'pre' | 'post' configureRawConfig?: (config: EngineConfig) => Awaitable<EngineConfig | void> rawConfigConfigured?: (config: EngineConfig) => void configureResolvedConfig?: (config: ResolvedEngineConfig) => Awaitable<ResolvedEngineConfig | void> configureEngine?: (engine: Engine) => Awaitable<void> transformSelectors?: (selectors: string[]) => Awaitable<string[]> transformStyleItems?: (items: ResolvedStyleItem[]) => Awaitable<ResolvedStyleItem[]> transformStyleDefinitions?: (defs: ResolvedStyleDefinition[]) => Awaitable<ResolvedStyleDefinition[]> preflightUpdated?: () => void atomicStyleAdded?: (style: AtomicStyle) => void autocompleteConfigUpdated?: () => void }
```

**Differences:**
- API name differs: extracted(any) vs documented(interface)

#### `StyleDefinition` (docs/advanced/api-reference.md:323)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
interface StyleDefinition { [key: string]: string | number | StyleDefinition __important?: boolean __shortcut?: string | string[] }
```

**Differences:**
- Signature format or structure differs

#### `StyleDefinition` (docs/llm/api-reference.md:249)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
interface StyleDefinition { [key: string]: string | number | StyleDefinition __important?: boolean __shortcut?: string | string[] }
```

**Differences:**
- API name differs: extracted(any) vs documented(interface)

#### `StyleDefinition` (docs/llm/architecture.md:70)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
interface StyleDefinition { [key: string]: string | number | StyleDefinition }
```

**Differences:**
- API name differs: extracted(any) vs documented(interface)

#### `StyleItem` (docs/advanced/api-reference.md:315)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
type StyleItem = string | StyleDefinition | StyleItem[]
```

**Differences:**
- Signature format or structure differs

#### `StyleItem` (docs/llm/api-reference.md:242)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
type StyleItem = string | StyleDefinition | StyleItem[]
```

**Differences:**
- API name differs: extracted(any) vs documented(type)

#### `Engine` (docs/llm/plugins.md:192)

**Expected (from source):**
```typescript
typeof Engine
```

**Documented:**
```typescript
interface Engine { myCustomMethod(): void }
```

**Differences:**
- API name differs: extracted(typeof) vs documented(interface)

#### `EnginePlugin` (docs/advanced/api-reference.md:369)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
interface EnginePlugin { name: string order?: 'pre' | 'post' configureRawConfig?: (config: EngineConfig) => Awaitable<EngineConfig | void> rawConfigConfigured?: (config: EngineConfig) => void configureResolvedConfig?: (config: ResolvedEngineConfig) => Awaitable<ResolvedEngineConfig | void> configureEngine?: (engine: Engine) => Awaitable<void> transformSelectors?: (selectors: string[]) => Awaitable<string[]> transformStyleItems?: (items: ResolvedStyleItem[]) => Awaitable<ResolvedStyleItem[]> transformStyleDefinitions?: (defs: ResolvedStyleDefinition[]) => Awaitable<ResolvedStyleDefinition[]> preflightUpdated?: () => void atomicStyleAdded?: (style: AtomicStyle) => void autocompleteConfigUpdated?: () => void }
```

**Differences:**
- Parameters differ: extracted(none) vs documented(config: EngineConfig)
- Return type differs: extracted(unknown) vs documented(Awaitable<EngineConfig | void> rawConfigConfigured?: (config: EngineConfig) => void configureResolvedConfig?: (config: ResolvedEngineConfig) => Awaitable<ResolvedEngineConfig | void> configureEngine?: (engine: Engine) => Awaitable<void> transformSelectors?: (selectors: string[]) => Awaitable<string[]> transformStyleItems?: (items: ResolvedStyleItem[]) => Awaitable<ResolvedStyleItem[]> transformStyleDefinitions?: (defs: ResolvedStyleDefinition[]) => Awaitable<ResolvedStyleDefinition[]> preflightUpdated?: () => void atomicStyleAdded?: (style: AtomicStyle) => void autocompleteConfigUpdated?: () => void })

#### `EnginePlugin` (docs/llm/api-reference.md:292)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
interface EnginePlugin { name: string order?: 'pre' | 'post' configureRawConfig?: (config: EngineConfig) => Awaitable<EngineConfig | void> rawConfigConfigured?: (config: EngineConfig) => void configureResolvedConfig?: (config: ResolvedEngineConfig) => Awaitable<ResolvedEngineConfig | void> configureEngine?: (engine: Engine) => Awaitable<void> transformSelectors?: (selectors: string[]) => Awaitable<string[]> transformStyleItems?: (items: ResolvedStyleItem[]) => Awaitable<ResolvedStyleItem[]> transformStyleDefinitions?: (defs: ResolvedStyleDefinition[]) => Awaitable<ResolvedStyleDefinition[]> preflightUpdated?: () => void atomicStyleAdded?: (style: AtomicStyle) => void autocompleteConfigUpdated?: () => void }
```

**Differences:**
- API name differs: extracted(any) vs documented(interface)

#### `StyleDefinition` (docs/advanced/api-reference.md:323)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
interface StyleDefinition { [key: string]: string | number | StyleDefinition __important?: boolean __shortcut?: string | string[] }
```

**Differences:**
- Signature format or structure differs

#### `StyleDefinition` (docs/llm/api-reference.md:249)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
interface StyleDefinition { [key: string]: string | number | StyleDefinition __important?: boolean __shortcut?: string | string[] }
```

**Differences:**
- API name differs: extracted(any) vs documented(interface)

#### `StyleDefinition` (docs/llm/architecture.md:70)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
interface StyleDefinition { [key: string]: string | number | StyleDefinition }
```

**Differences:**
- API name differs: extracted(any) vs documented(interface)

#### `StyleItem` (docs/advanced/api-reference.md:315)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
type StyleItem = string | StyleDefinition | StyleItem[]
```

**Differences:**
- Signature format or structure differs

#### `StyleItem` (docs/llm/api-reference.md:242)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
type StyleItem = string | StyleDefinition | StyleItem[]
```

**Differences:**
- API name differs: extracted(any) vs documented(type)

#### `Engine` (docs/llm/plugins.md:192)

**Expected (from source):**
```typescript
typeof Engine
```

**Documented:**
```typescript
interface Engine { myCustomMethod(): void }
```

**Differences:**
- API name differs: extracted(typeof) vs documented(interface)

#### `EnginePlugin` (docs/advanced/api-reference.md:369)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
interface EnginePlugin { name: string order?: 'pre' | 'post' configureRawConfig?: (config: EngineConfig) => Awaitable<EngineConfig | void> rawConfigConfigured?: (config: EngineConfig) => void configureResolvedConfig?: (config: ResolvedEngineConfig) => Awaitable<ResolvedEngineConfig | void> configureEngine?: (engine: Engine) => Awaitable<void> transformSelectors?: (selectors: string[]) => Awaitable<string[]> transformStyleItems?: (items: ResolvedStyleItem[]) => Awaitable<ResolvedStyleItem[]> transformStyleDefinitions?: (defs: ResolvedStyleDefinition[]) => Awaitable<ResolvedStyleDefinition[]> preflightUpdated?: () => void atomicStyleAdded?: (style: AtomicStyle) => void autocompleteConfigUpdated?: () => void }
```

**Differences:**
- Parameters differ: extracted(none) vs documented(config: EngineConfig)
- Return type differs: extracted(unknown) vs documented(Awaitable<EngineConfig | void> rawConfigConfigured?: (config: EngineConfig) => void configureResolvedConfig?: (config: ResolvedEngineConfig) => Awaitable<ResolvedEngineConfig | void> configureEngine?: (engine: Engine) => Awaitable<void> transformSelectors?: (selectors: string[]) => Awaitable<string[]> transformStyleItems?: (items: ResolvedStyleItem[]) => Awaitable<ResolvedStyleItem[]> transformStyleDefinitions?: (defs: ResolvedStyleDefinition[]) => Awaitable<ResolvedStyleDefinition[]> preflightUpdated?: () => void atomicStyleAdded?: (style: AtomicStyle) => void autocompleteConfigUpdated?: () => void })

#### `EnginePlugin` (docs/llm/api-reference.md:292)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
interface EnginePlugin { name: string order?: 'pre' | 'post' configureRawConfig?: (config: EngineConfig) => Awaitable<EngineConfig | void> rawConfigConfigured?: (config: EngineConfig) => void configureResolvedConfig?: (config: ResolvedEngineConfig) => Awaitable<ResolvedEngineConfig | void> configureEngine?: (engine: Engine) => Awaitable<void> transformSelectors?: (selectors: string[]) => Awaitable<string[]> transformStyleItems?: (items: ResolvedStyleItem[]) => Awaitable<ResolvedStyleItem[]> transformStyleDefinitions?: (defs: ResolvedStyleDefinition[]) => Awaitable<ResolvedStyleDefinition[]> preflightUpdated?: () => void atomicStyleAdded?: (style: AtomicStyle) => void autocompleteConfigUpdated?: () => void }
```

**Differences:**
- API name differs: extracted(any) vs documented(interface)

#### `StyleDefinition` (docs/advanced/api-reference.md:323)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
interface StyleDefinition { [key: string]: string | number | StyleDefinition __important?: boolean __shortcut?: string | string[] }
```

**Differences:**
- Signature format or structure differs

#### `StyleDefinition` (docs/llm/api-reference.md:249)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
interface StyleDefinition { [key: string]: string | number | StyleDefinition __important?: boolean __shortcut?: string | string[] }
```

**Differences:**
- API name differs: extracted(any) vs documented(interface)

#### `StyleDefinition` (docs/llm/architecture.md:70)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
interface StyleDefinition { [key: string]: string | number | StyleDefinition }
```

**Differences:**
- API name differs: extracted(any) vs documented(interface)

#### `StyleItem` (docs/advanced/api-reference.md:315)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
type StyleItem = string | StyleDefinition | StyleItem[]
```

**Differences:**
- Signature format or structure differs

#### `StyleItem` (docs/llm/api-reference.md:242)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
type StyleItem = string | StyleDefinition | StyleItem[]
```

**Differences:**
- API name differs: extracted(any) vs documented(type)

#### `Engine` (docs/llm/plugins.md:192)

**Expected (from source):**
```typescript
typeof Engine
```

**Documented:**
```typescript
interface Engine { myCustomMethod(): void }
```

**Differences:**
- API name differs: extracted(typeof) vs documented(interface)

#### `EnginePlugin` (docs/advanced/api-reference.md:369)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
interface EnginePlugin { name: string order?: 'pre' | 'post' configureRawConfig?: (config: EngineConfig) => Awaitable<EngineConfig | void> rawConfigConfigured?: (config: EngineConfig) => void configureResolvedConfig?: (config: ResolvedEngineConfig) => Awaitable<ResolvedEngineConfig | void> configureEngine?: (engine: Engine) => Awaitable<void> transformSelectors?: (selectors: string[]) => Awaitable<string[]> transformStyleItems?: (items: ResolvedStyleItem[]) => Awaitable<ResolvedStyleItem[]> transformStyleDefinitions?: (defs: ResolvedStyleDefinition[]) => Awaitable<ResolvedStyleDefinition[]> preflightUpdated?: () => void atomicStyleAdded?: (style: AtomicStyle) => void autocompleteConfigUpdated?: () => void }
```

**Differences:**
- Parameters differ: extracted(none) vs documented(config: EngineConfig)
- Return type differs: extracted(unknown) vs documented(Awaitable<EngineConfig | void> rawConfigConfigured?: (config: EngineConfig) => void configureResolvedConfig?: (config: ResolvedEngineConfig) => Awaitable<ResolvedEngineConfig | void> configureEngine?: (engine: Engine) => Awaitable<void> transformSelectors?: (selectors: string[]) => Awaitable<string[]> transformStyleItems?: (items: ResolvedStyleItem[]) => Awaitable<ResolvedStyleItem[]> transformStyleDefinitions?: (defs: ResolvedStyleDefinition[]) => Awaitable<ResolvedStyleDefinition[]> preflightUpdated?: () => void atomicStyleAdded?: (style: AtomicStyle) => void autocompleteConfigUpdated?: () => void })

#### `EnginePlugin` (docs/llm/api-reference.md:292)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
interface EnginePlugin { name: string order?: 'pre' | 'post' configureRawConfig?: (config: EngineConfig) => Awaitable<EngineConfig | void> rawConfigConfigured?: (config: EngineConfig) => void configureResolvedConfig?: (config: ResolvedEngineConfig) => Awaitable<ResolvedEngineConfig | void> configureEngine?: (engine: Engine) => Awaitable<void> transformSelectors?: (selectors: string[]) => Awaitable<string[]> transformStyleItems?: (items: ResolvedStyleItem[]) => Awaitable<ResolvedStyleItem[]> transformStyleDefinitions?: (defs: ResolvedStyleDefinition[]) => Awaitable<ResolvedStyleDefinition[]> preflightUpdated?: () => void atomicStyleAdded?: (style: AtomicStyle) => void autocompleteConfigUpdated?: () => void }
```

**Differences:**
- API name differs: extracted(any) vs documented(interface)

#### `StyleDefinition` (docs/advanced/api-reference.md:323)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
interface StyleDefinition { [key: string]: string | number | StyleDefinition __important?: boolean __shortcut?: string | string[] }
```

**Differences:**
- Signature format or structure differs

#### `StyleDefinition` (docs/llm/api-reference.md:249)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
interface StyleDefinition { [key: string]: string | number | StyleDefinition __important?: boolean __shortcut?: string | string[] }
```

**Differences:**
- API name differs: extracted(any) vs documented(interface)

#### `StyleDefinition` (docs/llm/architecture.md:70)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
interface StyleDefinition { [key: string]: string | number | StyleDefinition }
```

**Differences:**
- API name differs: extracted(any) vs documented(interface)

#### `StyleItem` (docs/advanced/api-reference.md:315)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
type StyleItem = string | StyleDefinition | StyleItem[]
```

**Differences:**
- Signature format or structure differs

#### `StyleItem` (docs/llm/api-reference.md:242)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
type StyleItem = string | StyleDefinition | StyleItem[]
```

**Differences:**
- API name differs: extracted(any) vs documented(type)

### @pikacss/vite-plugin-pikacss

#### `Engine` (docs/llm/plugins.md:192)

**Expected (from source):**
```typescript
typeof Engine
```

**Documented:**
```typescript
interface Engine { myCustomMethod(): void }
```

**Differences:**
- API name differs: extracted(typeof) vs documented(interface)

#### `EnginePlugin` (docs/advanced/api-reference.md:369)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
interface EnginePlugin { name: string order?: 'pre' | 'post' configureRawConfig?: (config: EngineConfig) => Awaitable<EngineConfig | void> rawConfigConfigured?: (config: EngineConfig) => void configureResolvedConfig?: (config: ResolvedEngineConfig) => Awaitable<ResolvedEngineConfig | void> configureEngine?: (engine: Engine) => Awaitable<void> transformSelectors?: (selectors: string[]) => Awaitable<string[]> transformStyleItems?: (items: ResolvedStyleItem[]) => Awaitable<ResolvedStyleItem[]> transformStyleDefinitions?: (defs: ResolvedStyleDefinition[]) => Awaitable<ResolvedStyleDefinition[]> preflightUpdated?: () => void atomicStyleAdded?: (style: AtomicStyle) => void autocompleteConfigUpdated?: () => void }
```

**Differences:**
- Parameters differ: extracted(none) vs documented(config: EngineConfig)
- Return type differs: extracted(unknown) vs documented(Awaitable<EngineConfig | void> rawConfigConfigured?: (config: EngineConfig) => void configureResolvedConfig?: (config: ResolvedEngineConfig) => Awaitable<ResolvedEngineConfig | void> configureEngine?: (engine: Engine) => Awaitable<void> transformSelectors?: (selectors: string[]) => Awaitable<string[]> transformStyleItems?: (items: ResolvedStyleItem[]) => Awaitable<ResolvedStyleItem[]> transformStyleDefinitions?: (defs: ResolvedStyleDefinition[]) => Awaitable<ResolvedStyleDefinition[]> preflightUpdated?: () => void atomicStyleAdded?: (style: AtomicStyle) => void autocompleteConfigUpdated?: () => void })

#### `EnginePlugin` (docs/llm/api-reference.md:292)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
interface EnginePlugin { name: string order?: 'pre' | 'post' configureRawConfig?: (config: EngineConfig) => Awaitable<EngineConfig | void> rawConfigConfigured?: (config: EngineConfig) => void configureResolvedConfig?: (config: ResolvedEngineConfig) => Awaitable<ResolvedEngineConfig | void> configureEngine?: (engine: Engine) => Awaitable<void> transformSelectors?: (selectors: string[]) => Awaitable<string[]> transformStyleItems?: (items: ResolvedStyleItem[]) => Awaitable<ResolvedStyleItem[]> transformStyleDefinitions?: (defs: ResolvedStyleDefinition[]) => Awaitable<ResolvedStyleDefinition[]> preflightUpdated?: () => void atomicStyleAdded?: (style: AtomicStyle) => void autocompleteConfigUpdated?: () => void }
```

**Differences:**
- API name differs: extracted(any) vs documented(interface)

#### `StyleDefinition` (docs/advanced/api-reference.md:323)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
interface StyleDefinition { [key: string]: string | number | StyleDefinition __important?: boolean __shortcut?: string | string[] }
```

**Differences:**
- Signature format or structure differs

#### `StyleDefinition` (docs/llm/api-reference.md:249)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
interface StyleDefinition { [key: string]: string | number | StyleDefinition __important?: boolean __shortcut?: string | string[] }
```

**Differences:**
- API name differs: extracted(any) vs documented(interface)

#### `StyleDefinition` (docs/llm/architecture.md:70)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
interface StyleDefinition { [key: string]: string | number | StyleDefinition }
```

**Differences:**
- API name differs: extracted(any) vs documented(interface)

#### `StyleItem` (docs/advanced/api-reference.md:315)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
type StyleItem = string | StyleDefinition | StyleItem[]
```

**Differences:**
- Signature format or structure differs

#### `StyleItem` (docs/llm/api-reference.md:242)

**Expected (from source):**
```typescript
any
```

**Documented:**
```typescript
type StyleItem = string | StyleDefinition | StyleItem[]
```

**Differences:**
- API name differs: extracted(any) vs documented(type)

## Documentation Contradictions

### `myPlugin`

**Issue:** API documented inconsistently across 11 locations

**Conflicting locations:**

- **docs/advanced/api-reference.md:51**
  ```typescript
  export function myPlugin() { return defineEnginePlugin({ name: 'my-plugin', // Plugin hooks }) }
  ```
- **docs/advanced/module-augmentation.md:35**
  ```typescript
  export function myPlugin() { return defineEnginePlugin({ name: 'my-plugin', configureEngine(engine) { // Access typed config const options = engine.config.myPlugin if (options?.option1) { console.log(options.option1) } } }) }
  ```
- **docs/advanced/module-augmentation.md:124**
  ```typescript
  export function myPlugin() { return defineEnginePlugin({ name: 'my-plugin', async configureEngine(engine) { // Initialize the property engine.myPlugin = { store: new Map(), add(...items) { items.forEach((item) => { engine.myPlugin.store.set(item.id, item.data) }) }, get(key) { return engine.myPlugin.store.get(key) } } } }) }
  ```
- **docs/advanced/plugin-development.md:19**
  ```typescript
  export function myPlugin(): EnginePlugin { return defineEnginePlugin({ name: 'my-plugin', // Optional: Set plugin execution order order: 'post', // 'pre' | 'post' | undefined // Hooks... }) }
  ```
- **docs/advanced/plugin-development.md:134**
  ```typescript
  export function myPlugin(options: MyPluginOptions = {}) { const { prefix = 'my-', enabled = true } = options return defineEnginePlugin({ name: 'my-plugin', async configureEngine(engine) { if (!enabled) return engine.shortcuts.add([`${prefix}button`, { padding: '10px 20px' }]) } }) }
  ```
- **docs/advanced/plugin-development.md:228**
  ```typescript
  export function myPlugin() { return defineEnginePlugin({ name: 'my-plugin', configureRawConfig: (config) => { const value = config.myCustomOption // Now typed! // ... } }) }
  ```
- **docs/advanced/plugin-development.md:250**
  ```typescript
  export function myPlugin() { return defineEnginePlugin({ name: 'my-plugin', configureEngine: async (engine) => { engine.myCustomMethod = () => { console.log('Custom method called') } } }) }
  ```
- **docs/llm/api-reference.md:44**
  ```typescript
  export function myPlugin() { return defineEnginePlugin({ name: 'my-plugin', // Plugin hooks }) }
  ```
- **docs/llm/plugins.md:57**
  ```typescript
  export function myPlugin() { return defineEnginePlugin({ name: 'my-plugin', // Plugin execution order: 'pre' | 'post' | undefined (default) // 'pre' runs before default plugins, 'post' runs after order: 'post', // Hook: Configure the raw config before resolution configureRawConfig(config) { // Modify config before it's processed return config }, // Hook: Called after raw config is configured (sync) rawConfigConfigured(config) { // Read-only access to config }, // Hook: Configure the resolved config configureResolvedConfig(resolvedConfig) { return resolvedConfig }, // Hook: Configure the engine (add shortcuts, etc.) configureEngine(engine) { engine.shortcuts.add({ shortcut: 'text-brand', value: { color: 'blue' } }) }, // Hook: Transform selector strings async transformSelectors(selectors) { return selectors }, // Hook: Transform style items before resolution async transformStyleItems(styleItems) { return styleItems }, // Hook: Transform resolved style definitions async transformStyleDefinitions(defs) { return defs.map((def) => { if ('size' in def) { const { size, ...rest } = def return { ...rest, width: size, height: size } } return def }) }, // Hook: Called when preflight is updated (sync) preflightUpdated() { // React to preflight changes }, // Hook: Called when an atomic style is added (sync) atomicStyleAdded(atomicStyle) { // React to new atomic style }, // Hook: Called when autocomplete config is updated (sync) autocompleteConfigUpdated() { // React to autocomplete changes } }) }
  ```
- **docs/llm/plugins.md:177**
  ```typescript
  export function myPlugin() { return defineEnginePlugin({ name: 'my-plugin', configureEngine(engine) { const options = engine.config.myPlugin // Use options... } }) }
  ```
- **docs/llm/plugins.md:197**
  ```typescript
  export function myPlugin() { return defineEnginePlugin({ name: 'my-plugin', configureEngine: async (engine) => { engine.myCustomMethod = () => { // ... } } }) }
  ```

### `StyleDefinition`

**Issue:** API documented inconsistently across 5 locations

**Conflicting locations:**

- **docs/advanced/api-reference.md:323**
  ```typescript
  interface StyleDefinition { [key: string]: string | number | StyleDefinition __important?: boolean __shortcut?: string | string[] }
  ```
- **docs/advanced/architecture.md:142**
  ```typescript
  interface StyleDefinition { [key: string]: string | number | StyleDefinition }
  ```
- **docs/advanced/typescript.md:37**
  ```typescript
  type StyleDefinition = { // All valid CSS properties with proper types color?: string fontSize?: string | number display?: 'flex' | 'grid' | 'block' | /* ... */ // Nested selectors '$: hover'?: StyleDefinition '$.active'?: StyleDefinition '@media (min-width: 768px)'?: StyleDefinition // Special properties __important?: boolean __shortcut?: string | string[] }
  ```
- **docs/llm/api-reference.md:249**
  ```typescript
  interface StyleDefinition { [key: string]: string | number | StyleDefinition __important?: boolean __shortcut?: string | string[] }
  ```
- **docs/llm/architecture.md:70**
  ```typescript
  interface StyleDefinition { [key: string]: string | number | StyleDefinition }
  ```

### `StyleContent`

**Issue:** API documented inconsistently across 4 locations

**Conflicting locations:**

- **docs/advanced/api-reference.md:335**
  ```typescript
  interface StyleContent { selector: string[] property: string value: string[] }
  ```
- **docs/advanced/architecture.md:152**
  ```typescript
  interface StyleContent { selector: string[] // e.g., [".%: hover"] where % is replaced by the ID property: string // e.g., "color" value: string[] // e.g., ["red"] }
  ```
- **docs/llm/api-reference.md:260**
  ```typescript
  interface StyleContent { selector: string[] property: string value: string[] }
  ```
- **docs/llm/architecture.md:78**
  ```typescript
  interface StyleContent { selector: string[] // e.g., [".%: hover"] where % is replaced by the ID property: string // e.g., "color" value: string[] // e.g., ["red"] }
  ```

### `AtomicStyle`

**Issue:** API documented inconsistently across 4 locations

**Conflicting locations:**

- **docs/advanced/api-reference.md:341**
  ```typescript
  interface AtomicStyle { id: string content: StyleContent }
  ```
- **docs/advanced/architecture.md:158**
  ```typescript
  interface AtomicStyle { id: string // e.g., "a" content: StyleContent }
  ```
- **docs/llm/api-reference.md:266**
  ```typescript
  interface AtomicStyle { id: string content: StyleContent }
  ```
- **docs/llm/architecture.md:84**
  ```typescript
  interface AtomicStyle { id: string // e.g., "a" content: StyleContent }
  ```

### `EngineConfig`

**Issue:** API documented inconsistently across 5 locations

**Conflicting locations:**

- **docs/advanced/module-augmentation.md:26**
  ```typescript
  interface EngineConfig { myPlugin?: { option1?: string option2?: boolean } }
  ```
- **docs/advanced/module-augmentation.md:56**
  ```typescript
  interface EngineConfig { /** * Configuration for my custom plugin */ myPlugin?: { /** * Prefix for generated classes * @default 'my-' */ prefix?: string /** * Enable debug mode * @default false */ debug?: boolean /** * Custom theme colors */ colors?: Record<string, string> } }
  ```
- **docs/advanced/module-augmentation.md:158**
  ```typescript
  interface EngineConfig { /** * Theme plugin configuration */ theme?: ThemePluginConfig }
  ```
- **docs/advanced/plugin-development.md:219**
  ```typescript
  interface EngineConfig { /** * Description of your custom option. * @default 'option-a' */ myCustomOption?: MyPluginOptions }
  ```
- **docs/llm/plugins.md:169**
  ```typescript
  interface EngineConfig { myPlugin?: { option1?: string option2?: boolean } }
  ```

### `Engine`

**Issue:** API documented inconsistently across 4 locations

**Conflicting locations:**

- **docs/advanced/module-augmentation.md:105**
  ```typescript
  interface Engine { myPlugin: { store: Map<string, CustomData> add: (...items: CustomItem[]) => void get: (key: string) => CustomData | undefined } }
  ```
- **docs/advanced/module-augmentation.md:165**
  ```typescript
  interface Engine { theme: ThemePluginAPI }
  ```
- **docs/advanced/plugin-development.md:245**
  ```typescript
  interface Engine { myCustomMethod(): void }
  ```
- **docs/llm/plugins.md:192**
  ```typescript
  interface Engine { myCustomMethod(): void }
  ```

### `themePlugin`

**Issue:** API documented inconsistently across 2 locations

**Conflicting locations:**

- **docs/advanced/module-augmentation.md:195**
  ```typescript
  export function themePlugin(): EnginePlugin { return defineEnginePlugin({ name: 'theme-plugin', async configureEngine(engine) { const config = engine.config.theme |  | {} const defaultTheme = config.defaultTheme |  | 'light' const themeColors = config.colors?.[defaultTheme] |  | {} // Initialize API const colors = new Map<string, string>() // Load initial colors Object.entries(themeColors) .forEach(([name, value]) => { colors.set(name, value) }) // Set up property engine.theme = { colors, setColor(name, value) { colors.set(name, value) // Update CSS variable engine.addPreflight({ ': root': { [`--color-${name}`]: value } }) engine.notifyPreflightUpdated() }, getColor(name) { return colors.get(name) } } // Add selectors for theme switching engine.selectors.add(['@light', 'html: not(.dark) $'], ['@dark', 'html.dark $']) // Register for autocomplete engine.appendAutocompleteSelectors('@light', '@dark') } }) }
  ```
- **docs/advanced/plugin-development.md:350**
  ```typescript
  export function themePlugin(theme: Theme) { return defineEnginePlugin({ name: 'theme-plugin', async configureEngine(engine) { // Add CSS variables as preflight const cssVars = Object.entries(theme.colors) .map(([name, value]) => `--color-${name}: ${value};`) .join('\n ') engine.addPreflight(`: root {\n ${cssVars}\n}`) // Add color shortcuts Object.keys(theme.colors) .forEach((colorName) => { engine.shortcuts.add([`text-${colorName}`, { color: `var(--color-${colorName})` }], [`bg-${colorName}`, { backgroundColor: `var(--color-${colorName})` }]) }) // Add spacing shortcuts Object.entries(theme.spacing) .forEach(([name, value]) => { engine.shortcuts.add([`p-${name}`, { padding: value }], [`m-${name}`, { margin: value }]) }) // Register for autocomplete const shortcuts = [ ...Object.keys(theme.colors) .flatMap(c => [`text-${c}`, `bg-${c}`]), ...Object.keys(theme.spacing) .flatMap(s => [`p-${s}`, `m-${s}`]) ] engine.appendAutocompleteStyleItemStrings(...shortcuts) } }) }
  ```

### `MyPluginOptions`

**Issue:** API documented inconsistently across 2 locations

**Conflicting locations:**

- **docs/advanced/plugin-development.md:129**
  ```typescript
  interface MyPluginOptions { prefix?: string enabled?: boolean }
  ```
- **docs/advanced/plugin-development.md:216**
  ```typescript
  export type MyPluginOptions = 'option-a' | 'option-b'
  ```

### `Button`

**Issue:** API documented inconsistently across 7 locations

**Conflicting locations:**

- **docs/advanced/testing.md:56**
  ```typescript
  export function Button({ variant = 'primary' }) { return (<button className={pika(`btn-${variant}`)}> Click </button>) }
  ```
- **docs/advanced/troubleshooting.md:242**
  ```typescript
  function Button({ variant }) { // variant is only known at runtime pika({ backgroundColor: variant === 'primary' ? 'blue': 'gray' }) }
  ```
- **docs/advanced/troubleshooting.md:257**
  ```typescript
  function Button({ variant }) { const color = variant === 'primary' ? 'blue': 'gray' return (<button className={buttonClass} style={{ '--btn-color': color }} > Click me </button>) }
  ```
- **docs/advanced/troubleshooting.md:273**
  ```typescript
  function Button({ variant }) { const classes = variant === 'primary' ? pika('btn-primary'): pika('btn-secondary') return <button className={classes}>Click me</button> }
  ```
- **docs/llm/troubleshooting.md:230**
  ```typescript
  function Button({ variant }) { // variant is only known at runtime pika({ backgroundColor: variant === 'primary' ? 'blue': 'gray' }) }
  ```
- **docs/llm/troubleshooting.md:244**
  ```typescript
  function Button({ variant }) { const color = variant === 'primary' ? 'blue': 'gray' return (<button className={buttonClass} style={{ '--btn-color': color }} > Click me </button>) }
  ```
- **docs/llm/troubleshooting.md:259**
  ```typescript
  function Button({ variant }) { const classes = variant === 'primary' ? pika('btn-primary'): pika('btn-secondary') return <button className={classes}>Click me</button> }
  ```

### `pika`

**Issue:** API documented inconsistently across 2 locations

**Conflicting locations:**

- **docs/advanced/typescript.md:31**
  ```typescript
  export function pika(styles: StyleDefinition): string
  ```
- **docs/advanced/typescript.md:32**
  ```typescript
  export function pika(shortcut: string | string[], styles?: StyleDefinition): string
  ```
