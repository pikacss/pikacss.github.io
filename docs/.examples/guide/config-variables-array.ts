import { defineEngineConfig } from '@pikacss/core'

export default defineEngineConfig({
	variables: {
		// Pass an array of variable definitions (merged in order)
		variables: [
			{
				'--color-primary': '#3b82f6',
				'--color-secondary': '#8b5cf6',
			},
			{
				'@media (prefers-color-scheme: dark)': {
					'--color-primary': '#60a5fa',
					'--color-secondary': '#a78bfa',
				},
			},
		],
	},
})
