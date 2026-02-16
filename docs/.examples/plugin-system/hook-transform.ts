import { defineEnginePlugin } from '@pikacss/core'

export const plugin = defineEnginePlugin({
	name: 'example',

	// Transform selectors before they are resolved
	async transformSelectors(selectors) {
		return selectors.map(s =>
			s === 'dark' ? '[data-theme="dark"]' : s,
		)
	},

	// Transform style items before extraction
	async transformStyleItems(styleItems) {
		// Insert additional style items or modify existing ones
		return styleItems
	},

	// Transform style definitions before extraction
	async transformStyleDefinitions(styleDefinitions) {
		return styleDefinitions
	},
})
