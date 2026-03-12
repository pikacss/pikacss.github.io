import { defineEngineConfig } from '@pikacss/core'

export default defineEngineConfig({
	variables: {
		variables: {
			'--accent-500': '#0ea5e9',
		},
	},
	selectors: {
		selectors: [
			['hover', '$:hover'],
		],
	},
})
