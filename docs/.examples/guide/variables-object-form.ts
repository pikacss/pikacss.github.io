// pika.config.ts
import { defineEngineConfig } from '@pikacss/unplugin-pikacss'

export default defineEngineConfig({
	variables: {
		variables: {
			// Object form with autocomplete and pruning options
			'--color-primary': {
				value: '#0ea5e9',
				autocomplete: {
					// Suggest var(--color-primary) for these CSS properties
					// Use '*' for all properties, '-' to disable
					asValueOf: ['color', 'backgroundColor'],
					// Whether to register --color-primary as a CSS property (default: true)
					asProperty: true,
				},
				// Override per-variable pruning (default: inherits from config)
				pruneUnused: false,
			},

			// A variable with value null provides autocomplete only — no CSS output
			'--external-font-size': {
				value: null,
				autocomplete: {
					asValueOf: ['fontSize'],
				},
			},
		},
	},
})
