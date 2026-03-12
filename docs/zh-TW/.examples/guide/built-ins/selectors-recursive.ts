import { defineEngineConfig } from '@pikacss/core'

export default defineEngineConfig({
	selectors: {
		selectors: [
			['hover', '$:hover'],
			['alias-hover', 'hover'],
			['group-hover', '.group:hover $'],
		],
	},
})
