import { defineEngineConfig } from '@pikacss/core'
import { fonts } from '@pikacss/plugin-fonts'
import { icons } from '@pikacss/plugin-icons'
import { reset } from '@pikacss/plugin-reset'
import { typography } from '@pikacss/plugin-typography'

export default defineEngineConfig({
	plugins: [
		reset(),
		fonts(),
		icons(),
		typography(),
	],
	// Plugin config 選項透過模組擴充確保型別安全
	reset: 'modern-normalize',
	fonts: {
		fonts: {
			sans: 'Roboto:400,700',
		},
	},
	icons: { prefix: 'i-', scale: 1.2 },
	typography: {},
})
