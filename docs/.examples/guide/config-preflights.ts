import { defineEngineConfig } from '@pikacss/core'

export default defineEngineConfig({
	preflights: [
		// 1. Static CSS string
		':root { --color-brand: #ff007f; }',

		// 2. Preflight definition object (like CSS-in-JS)
		{
			':root': {
				fontSize: '16px',
				lineHeight: '1.5',
			},
			'*, *::before, *::after': {
				boxSizing: 'border-box',
			},
		},

		// 3. Dynamic function — receives the engine instance
		(engine) => {
			const prefix = engine.config.prefix
			return `/* Engine prefix: ${prefix} */`
		},

		// 4. Function returning a preflight definition object
		engine => ({
			body: {
				margin: '0',
				padding: '0',
			},
		}),
	],
})
