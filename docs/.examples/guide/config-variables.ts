import { defineEngineConfig } from '@pikacss/core'

export default defineEngineConfig({
	variables: {
		variables: {
			// Simple variable (rendered under :root by default)
			'--color-bg': '#ffffff',
			'--color-text': '#1a1a1a',

			// Variable with null value (autocomplete only, no CSS output)
			'--external-var': null,

			// Scoped variables under a selector
			'[data-theme="dark"]': {
				'--color-bg': '#1a1a1a',
				'--color-text': '#ffffff',
			},

			// Variable with advanced options
			'--spacing-unit': {
				value: '4px',
				autocomplete: {
					asValueOf: ['margin', 'padding', 'gap'],
					asProperty: true,
				},
				pruneUnused: false, // Always include in output
			},
		},

		// Whether to remove unused variables from the final CSS
		pruneUnused: true,

		// Variables that are always included regardless of usage
		safeList: ['--color-bg', '--color-text'],
	},
})
