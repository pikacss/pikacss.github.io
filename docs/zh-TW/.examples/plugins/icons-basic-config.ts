import { icons } from '@pikacss/plugin-icons'
import { defineEngineConfig } from '@pikacss/core'

export default defineEngineConfig({
	plugins: [icons()],
	icons: {
		autoInstall: true,
	},
})
