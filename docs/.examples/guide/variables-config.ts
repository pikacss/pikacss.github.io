import { defineEngineConfig } from '@pikacss/core'

export default defineEngineConfig({
	variables: {
		variables: {
			'--surface-bg': '#ffffff',
			'--surface-fg': '#0f172a',
			'--brand-ring': '#0ea5e9',
			'--card-padding': '1.5rem',
			'[data-theme="dark"]': {
				'--surface-bg': '#020617',
				'--surface-fg': '#e2e8f0',
				'--brand-ring': '#38bdf8',
			},
			'--space-unit': {
				value: '0.25rem',
				autocomplete: {
					asValueOf: ['margin', 'padding', 'gap'],
					asProperty: true,
				},
				pruneUnused: false,
			},
		},
		pruneUnused: true,
		safeList: ['--surface-bg', '--surface-fg'],
	},
})