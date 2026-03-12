import { defineEngineConfig } from '@pikacss/core'

export default defineEngineConfig({
	layers: {
		primitives: 0,
		components: 5,
		utilities: 10,
	},
	defaultPreflightsLayer: 'primitives',
	defaultUtilitiesLayer: 'utilities',
})
