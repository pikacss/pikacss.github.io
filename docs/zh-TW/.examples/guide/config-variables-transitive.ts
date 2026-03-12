import { defineEngineConfig } from '@pikacss/core'

export default defineEngineConfig({
	variables: {
		variables: {
			'--space-base': '0.25rem',
			'--space-stack': 'calc(var(--space-base) * 6)',
			'--card-padding': 'var(--space-stack)',
		},
		pruneUnused: true,
	},
})
