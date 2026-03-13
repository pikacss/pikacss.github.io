import { icons } from '@pikacss/plugin-icons'
import { defineEngineConfig } from '@pikacss/core'

export default defineEngineConfig({
	plugins: [icons()],
	icons: {
		scale: 1.2,
		mode: 'mask',
		prefix: ['i-', 'icon-'],
		cwd: process.cwd(),
		autoInstall: true,
		cdn: 'https://cdn.example/icons/{collection}.json',
		extraProperties: {
			'display': 'inline-block',
			'vertical-align': 'middle',
		},
		unit: 'em',
		processor(styleItem, meta) {
			if (typeof styleItem !== 'string') {
				styleItem.display = 'inline-block'
				styleItem.opacity = meta.source === 'cdn' ? '0.95' : '1'
			}
		},
	},
})
