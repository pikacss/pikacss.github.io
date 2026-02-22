import { defineEngineConfig } from '@pikacss/core'

export default defineEngineConfig({
	layers: {
		reset: 0,
		base: 1,
		utilities: 10,
	},
	preflights: [
		// WithLayer + CSS string
		{
			layer: 'reset',
			preflight: '*, *::before, *::after { box-sizing: border-box; }',
		},

		// WithLayer + preflight definition object
		{
			layer: 'base',
			preflight: {
				':root': {
					fontSize: '16px',
					lineHeight: '1.5',
				},
			},
		},

		// WithLayer + dynamic function
		{
			layer: 'base',
			preflight: (engine) => {
				const prefix = engine.config.prefix
				return `/* Engine prefix: ${prefix} */`
			},
		},
	],
})
