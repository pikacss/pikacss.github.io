// vite.config.ts — disable TypeScript codegen
import PikaCSS from '@pikacss/unplugin-pikacss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [
		PikaCSS({
			// Disable TypeScript code generation file
			tsCodegen: false,
		}),
	],
})
