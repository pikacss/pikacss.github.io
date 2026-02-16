import { defineEngineConfig } from '@pikacss/core'

export default defineEngineConfig({
	important: {
		// When true, all generated atomic styles will have `!important` appended.
		// Can be overridden per style with `__important: false`.
		default: true,
	},
})
