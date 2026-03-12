import type { PreflightDefinition } from '@pikacss/core'
import { defineEnginePlugin } from '@pikacss/core'

export const plugin = defineEnginePlugin({
	name: 'example',
	configureEngine: async (engine) => {
		// PreflightDefinition — 含有 CSS 屬性的結構化物件
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
