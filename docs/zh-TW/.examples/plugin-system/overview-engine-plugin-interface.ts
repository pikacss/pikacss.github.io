import type { Engine, EngineConfig } from '@pikacss/core'
import { defineEnginePlugin } from '@pikacss/core'

// All hooks are optional — implement only what the plugin needs.
// Hook parameter types are inferred automatically from the EnginePlugin interface.
export default defineEnginePlugin({
	name: 'example-plugin',
	order: 'pre',
	configureRawConfig(config: EngineConfig) { /* shape raw config before defaults settle */ },
	configureResolvedConfig(resolvedConfig) { /* react to final resolved config */ },
	configureEngine(engine: Engine) { /* call public engine APIs */ },
	transformSelectors(selectors) { /* filter or modify the selector list */ },
	transformStyleItems(styleItems) { /* map or filter extracted style items */ },
	transformStyleDefinitions(styleDefinitions) { /* map or filter style definitions */ },
	rawConfigConfigured(config) { /* observe raw config — do not mutate */ },
	preflightUpdated() { /* react to preflight changes */ },
	atomicStyleAdded(atomicStyle) { /* observe registered atomic rules */ },
	autocompleteConfigUpdated() { /* react to autocomplete config changes */ },
})
