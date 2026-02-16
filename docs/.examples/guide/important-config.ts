// pika.config.ts
import { defineEngineConfig } from '@pikacss/unplugin-pikacss'

export default defineEngineConfig({
	important: {
		// When true, all CSS values get `!important` by default
		default: true,
	},
})
