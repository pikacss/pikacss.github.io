// pika.config.ts
import { icons } from '@pikacss/plugin-icons'
import { reset } from '@pikacss/plugin-reset'
import { defineEngineConfig } from '@pikacss/unplugin-pikacss'

export default defineEngineConfig({
	plugins: [
		reset(), // Apply a CSS reset (default: 'modern-normalize')
		icons(), // Enable icon support via @iconify
	],
})
