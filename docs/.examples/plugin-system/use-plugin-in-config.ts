import { defineEngineConfig } from '@pikacss/core'
import { icons } from '@pikacss/plugin-icons'
import { reset } from '@pikacss/plugin-reset'
import { typography } from '@pikacss/plugin-typography'

export default defineEngineConfig({
	plugins: [
		reset(),
		icons(),
		typography(),
	],
	// Plugin config options are type-safe via module augmentation
	reset: 'modern-normalize',
	icons: { prefix: 'i-', scale: 1.2 },
	typography: {},
})
