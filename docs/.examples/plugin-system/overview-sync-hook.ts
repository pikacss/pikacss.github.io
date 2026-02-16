import { defineEnginePlugin } from '@pikacss/core'

export const syncHookPlugin = defineEnginePlugin({
	name: 'sync-hook-example',

	// Sync notification hook: called after the raw config is settled.
	// Use it to read the config — do NOT return a value.
	rawConfigConfigured(config) {
		console.log('Config settled with prefix:', config.prefix)
	},

	// Sync notification hook: called when a new atomic style is added.
	// Useful for tracking, logging, or collecting generated styles.
	atomicStyleAdded(atomicStyle) {
		console.log('New atomic style:', atomicStyle.id)
	},

	// Sync notification hook: called when preflight CSS changes.
	preflightUpdated() {
		console.log('Preflight updated')
	},

	// Sync notification hook: called when autocomplete config changes.
	autocompleteConfigUpdated() {
		console.log('Autocomplete config updated')
	},
})
