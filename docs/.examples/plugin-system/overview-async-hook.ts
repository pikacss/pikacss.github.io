import { defineEnginePlugin } from '@pikacss/core'

export const asyncHookPlugin = defineEnginePlugin({
	name: 'async-hook-example',

	// Async hook: modify the raw config before it is resolved.
	// Return the modified config to pass it to the next plugin,
	// or return void/undefined to keep the current value.
	configureRawConfig(config) {
		config.prefix = 'pk-'
		return config
	},

	// Async hook: transform selectors during style extraction.
	// The returned array replaces the input for the next plugin.
	transformSelectors(selectors) {
		return selectors.map(s => s.replace('$hover', '&:hover'))
	},
})
