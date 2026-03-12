// pika.config.ts
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'
import { defineEngineConfig } from '@pikacss/core'
import { icons } from '@pikacss/plugin-icons'

export default defineEngineConfig({
	plugins: [icons()],
	icons: {
		collections: {
			custom: FileSystemIconLoader('./src/assets/icons'),
		},
	},
})
// 用法：pika('i-custom:logo') → ./src/assets/icons/logo.svg
