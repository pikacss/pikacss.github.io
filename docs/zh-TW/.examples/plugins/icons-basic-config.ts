import { defineEngineConfig } from '@pikacss/core'
import { icons } from '@pikacss/plugin-icons'

export default defineEngineConfig({
	plugins: [icons()],
	icons: {
		autoInstall: true,
	},
})
