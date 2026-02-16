// pika.config.ts
import { defineEngineConfig } from '@pikacss/unplugin-pikacss'

export default defineEngineConfig({
	variables: {
		variables: {
			// Top-level variables are placed under :root
			'--color-primary': '#0ea5e9',
			'--color-bg': '#ffffff',
			'--color-text': '#1e293b',

			// Nest under a selector to scope variables
			'[data-theme="dark"]': {
				'--color-bg': '#0f172a',
				'--color-text': '#e2e8f0',
			},
		},
		// Prune variables not referenced in any atomic style (default: true)
		pruneUnused: true,
		// Always keep these variables even if unused
		safeList: ['--color-primary'],
	},
})
