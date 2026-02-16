// pika.config.ts
import { icons } from '@pikacss/plugin-icons'
import { defineEngineConfig } from '@pikacss/unplugin-pikacss'

export default defineEngineConfig({
	plugins: [icons()],
	icons: {
		// Custom processor to modify icon CSS before output
		processor: (styleItem, meta) => {
			// Add display: inline-block to all icons
			styleItem.display = 'inline-block'
			styleItem['vertical-align'] = 'middle'

			// Access icon metadata
			console.log(`Processing icon: ${meta.collection}:${meta.name}, mode: ${meta.mode}`)
		},
	},
})
