// pika.config.ts
import { icons } from '@pikacss/plugin-icons'
import { defineEngineConfig } from '@pikacss/unplugin-pikacss'

export default defineEngineConfig({
	plugins: [icons()],
	icons: {
		collections: {
			// Inline SVG collection
			custom: {
				logo: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="currentColor"/></svg>',
			},
		},
	},
})
// Usage: pika('i-custom:logo')
