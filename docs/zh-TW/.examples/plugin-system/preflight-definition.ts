import type { PreflightDefinition } from '@pikacss/core'
import { defineEnginePlugin, definePreflight } from '@pikacss/core'

export const plugin = defineEnginePlugin({
	name: 'example',
	configureEngine: async (engine) => {
		// definePreflight keeps shared payloads typed without changing runtime behavior
		const preflight: PreflightDefinition = definePreflight({
			':root': {
				fontSize: '16px',
				lineHeight: '1.5',
			},
			'body': {
				margin: '0',
				fontFamily: 'system-ui, sans-serif',
			},
		})
		engine.addPreflight(preflight)
	},
})
