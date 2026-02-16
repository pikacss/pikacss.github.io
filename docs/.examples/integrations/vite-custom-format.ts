// vite.config.ts — array output format (useful with clsx, classnames, etc.)
import PikaCSS from '@pikacss/unplugin-pikacss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [
		PikaCSS({
			// pika() calls will return string[] instead of string
			transformedFormat: 'array',
		}),
	],
})
