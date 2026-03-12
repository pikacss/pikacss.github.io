import PikaCSS from '@pikacss/unplugin-pikacss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [
		PikaCSS({
			autoCreateConfig: true,
			fnName: 'pika',
			transformedFormat: 'string',
			tsCodegen: 'types/pika.gen.ts',
			cssCodegen: 'styles/pika.gen.css',
			scan: {
				include: ['src/**/*.{ts,tsx,vue}', 'components/**/*.{ts,tsx,vue}'],
				exclude: ['node_modules/**', 'dist/**', 'coverage/**'],
			},
			config: './configs/pika.config.ts',
		}),
	],
})
