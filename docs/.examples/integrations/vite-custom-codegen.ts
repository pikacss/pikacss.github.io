// vite.config.ts — custom codegen file paths
import PikaCSS from '@pikacss/unplugin-pikacss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [
		PikaCSS({
			// Output TS codegen to a custom path
			tsCodegen: 'src/generated/pika.gen.ts',
			// Output CSS codegen to a custom path
			cssCodegen: 'src/generated/pika.gen.css',
		}),
	],
})
