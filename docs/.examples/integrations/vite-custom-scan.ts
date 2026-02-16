// vite.config.ts — custom file scanning patterns
import PikaCSS from '@pikacss/unplugin-pikacss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [
		PikaCSS({
			scan: {
				// Only scan files under src/
				include: ['src/**/*.{ts,tsx,vue}'],
				// Exclude test files and stories
				exclude: ['node_modules/**', 'dist/**', '**/*.test.ts', '**/*.stories.tsx'],
			},
		}),
	],
})
