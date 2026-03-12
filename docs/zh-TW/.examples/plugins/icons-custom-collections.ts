import { defineEngineConfig } from '@pikacss/core'
// pika.config.ts
import { icons } from '@pikacss/plugin-icons'

export default defineEngineConfig({
	plugins: [icons()],
	icons: {
		collections: {
			// 行內 SVG 集合
			custom: {
				logo: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="currentColor"/></svg>',
			},
		},
	},
})
// 用法：pika('i-custom:logo')
