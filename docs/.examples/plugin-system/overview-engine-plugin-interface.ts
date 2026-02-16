import type { AtomicStyle, Engine, EngineConfig, ResolvedEngineConfig, ResolvedStyleDefinition, ResolvedStyleItem } from '@pikacss/core'

// This is a simplified view of the EnginePlugin interface.
// See packages/core/src/internal/plugin.ts for the full definition.
export interface EnginePlugin {
	/** Unique plugin name (required) */
	name: string

	/** Execution order: 'pre' (0) → default (1) → 'post' (2) */
	order?: 'pre' | 'post'

	// --- Async hooks (can return modified payload) ---

	/** Modify the raw config before it is resolved */
	configureRawConfig?: (config: EngineConfig) => EngineConfig | void | Promise<EngineConfig | void>
	/** Modify the resolved config */
	configureResolvedConfig?: (resolvedConfig: ResolvedEngineConfig) => ResolvedEngineConfig | void | Promise<ResolvedEngineConfig | void>
	/** Modify the engine instance after creation */
	configureEngine?: (engine: Engine) => Engine | void | Promise<Engine | void>
	/** Transform selectors during style extraction */
	transformSelectors?: (selectors: string[]) => string[] | void | Promise<string[] | void>
	/** Transform style items during engine.use() */
	transformStyleItems?: (styleItems: ResolvedStyleItem[]) => ResolvedStyleItem[] | void | Promise<ResolvedStyleItem[] | void>
	/** Transform style definitions during style extraction */
	transformStyleDefinitions?: (styleDefinitions: ResolvedStyleDefinition[]) => ResolvedStyleDefinition[] | void | Promise<ResolvedStyleDefinition[] | void>

	// --- Sync hooks (notification only) ---

	/** Called after the raw config is settled */
	rawConfigConfigured?: (config: EngineConfig) => void
	/** Called when preflight CSS changes */
	preflightUpdated?: () => void
	/** Called when a new atomic style is generated */
	atomicStyleAdded?: (atomicStyle: AtomicStyle) => void
	/** Called when autocomplete configuration changes */
	autocompleteConfigUpdated?: () => void
}
