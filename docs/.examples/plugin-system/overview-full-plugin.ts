import { defineEnginePlugin } from '@pikacss/core'

export function createMyPlugin(options: { prefix?: string } = {}) {
	const { prefix = 'my' } = options

	return defineEnginePlugin({
		name: `${prefix}-plugin`,
		order: 'pre',

		// --- Async hooks (transform) ---

		configureRawConfig(config) {
			// Modify raw config before resolution
			config.prefix = config.prefix || prefix
			return config
		},

		configureResolvedConfig(resolvedConfig) {
			// Modify resolved config after resolution
			return resolvedConfig
		},

		async configureEngine(engine) {
			// Set up engine features, add preflights, etc.
			engine.addPreflight('/* my-plugin preflight */')
			engine.appendAutocompleteExtraProperties('__myProp')
		},

		transformSelectors(selectors) {
			// Transform selectors during style extraction
			return selectors
		},

		transformStyleItems(styleItems) {
			// Transform style items during engine.use()
			return styleItems
		},

		transformStyleDefinitions(styleDefinitions) {
			// Transform style definitions during style extraction
			return styleDefinitions
		},

		// --- Sync hooks (notification) ---

		rawConfigConfigured(_config) {
			// Read-only access to settled raw config
		},

		preflightUpdated() {
			// React to preflight changes
		},

		atomicStyleAdded(_atomicStyle) {
			// React to new atomic styles
		},

		autocompleteConfigUpdated() {
			// React to autocomplete config changes
		},
	})
}
