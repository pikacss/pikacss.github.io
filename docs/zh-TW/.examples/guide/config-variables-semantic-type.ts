import { defineEngineConfig } from '@pikacss/core'

export default defineEngineConfig({
	variables: {
		variables: {
			'--accent-color': {
				value: '#0ea5e9',
				semanticType: 'color',
			},
			'--sidebar-width': {
				value: '18rem',
				semanticType: 'length',
			},
			'--motion-fast': {
				value: '140ms',
				semanticType: 'time',
			},
			'--elevation-popover': {
				value: '40',
				semanticType: 'number',
			},
			'--ease-emphasized': {
				value: 'cubic-bezier(0.2, 0, 0, 1)',
				semanticType: 'easing',
			},
			'--font-display': {
				value: '"Space Grotesk", sans-serif',
				semanticType: 'font-family',
			},
			'--brand-accent': {
				value: '#38bdf8',
				semanticType: 'color',
				autocomplete: {
					asValueOf: 'scrollbar-color',
					asProperty: false,
				},
			},
		},
		pruneUnused: false,
	},
})
