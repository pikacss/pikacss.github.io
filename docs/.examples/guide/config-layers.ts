import { defineEngineConfig } from '@pikacss/core'

export default defineEngineConfig({
	// Add a 'components' layer between preflights and utilities
	layers: {
		base: 0,
		components: 5,
		utilities: 10,
	},
	// Unlayered preflights go into 'base' instead of the default 'preflights'
	defaultPreflightsLayer: 'base',
	// Unlayered atomic styles go into 'utilities' (this is the default)
	defaultUtilitiesLayer: 'utilities',
})
