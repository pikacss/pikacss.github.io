import { defineEngineConfig } from '@pikacss/core'

export default defineEngineConfig({
	layers: {
		reset: 0,
		base: 1,
		utilities: 10,
	},
	preflights: [
		{
			layer: 'reset',
			preflight: '*, *::before, *::after { box-sizing: border-box; }',
		},
		{
			layer: 'base',
			preflight: {
				html: {
					fontFamily: 'system-ui, sans-serif',
					lineHeight: '1.5',
				},
			},
		},
		{
			layer: 'base',
			preflight: (engine) => {
				const prefix = engine.config.prefix
				return `:root { --engine-prefix: "${prefix}"; }`
			},
		},
	],
})
