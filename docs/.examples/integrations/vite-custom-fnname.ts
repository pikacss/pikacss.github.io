// vite.config.ts — custom function name
import PikaCSS from '@pikacss/unplugin-pikacss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [
		PikaCSS({
			// Use css() instead of pika() in your source code
			fnName: 'css',
		}),
	],
})
