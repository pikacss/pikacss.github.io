import { defineEnginePlugin } from '@pikacss/core'

export const plugin = defineEnginePlugin({
	name: 'example',

	// Async — modify raw config before resolution
	configureRawConfig(config) {
		// Add default preflights
		config.preflights ??= []
		config.preflights.push('/* injected by example plugin */')
		return config
	},

	// Sync — read finalized raw config (cannot modify)
	rawConfigConfigured(config) {
		console.log('Final prefix:', config.prefix)
	},
})
