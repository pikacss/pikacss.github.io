import { icons } from '@pikacss/plugin-icons'
import { defineEngineConfig } from '@pikacss/core'

export default defineEngineConfig({
	plugins: [icons()],
	icons: {
		scale: 1.2,
		mode: 'mask',
		prefix: 'i-',
		cwd: process.cwd(),
		autoInstall: true,
		extraProperties: {
			'display': 'inline-block',
			'vertical-align': 'middle',
		},
		unit: 'em',
	},
})
