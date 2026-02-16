// pika.config.ts
import { icons } from '@pikacss/plugin-icons'
import { defineEngineConfig } from '@pikacss/unplugin-pikacss'

export default defineEngineConfig({
	plugins: [icons()],
	icons: {
		// Add custom entries to IDE autocomplete suggestions
		autocomplete: [
			'mdi:home',
			'mdi:account',
			'mdi:settings',
			'lucide:check',
			'lucide:x',
		],
	},
})
