import type { PreflightDefinition } from '@pikacss/core'
import { defineEnginePlugin } from '@pikacss/core'

export const plugin = defineEnginePlugin({
	name: 'example',
	configureEngine: async (engine) => {
		// PreflightDefinition — structured object with CSS properties
		const preflight: PreflightDefinition = {
			':root': {
				fontSize: '16px',
				lineHeight: '1.5',
			},
			'body': {
				margin: '0',
				fontFamily: 'system-ui, sans-serif',
			},
		}
		engine.addPreflight(preflight)
	},
})
