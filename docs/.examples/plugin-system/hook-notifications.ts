import { defineEnginePlugin } from '@pikacss/core'

export const plugin = defineEnginePlugin({
	name: 'example',

	// Sync — called when a new atomic style is generated
	atomicStyleAdded(atomicStyle) {
		console.log(`New atomic style: ${atomicStyle.id}`)
	},

	// Sync — called when preflights are updated
	preflightUpdated() {
		console.log('Preflights updated')
	},

	// Sync — called when autocomplete config changes
	autocompleteConfigUpdated() {
		console.log('Autocomplete config updated')
	},
})
