// vite.config.ts — point to a specific config file
import PikaCSS from '@pikacss/unplugin-pikacss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [
		PikaCSS({
			// Use a custom config file path
			config: './config/pika.config.ts',
		}),
	],
})
