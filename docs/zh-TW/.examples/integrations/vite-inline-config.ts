import PikaCSS from '@pikacss/unplugin-pikacss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [
		PikaCSS({
			autoCreateConfig: false,
			config: {
				prefix: 'app-',
				defaultSelector: '.%',
				selectors: {
					selectors: [
						['hover', '$:hover'],
					],
				},
				shortcuts: {
					shortcuts: [
						['card-shell', {
							padding: '1rem',
							borderRadius: '0.75rem',
							border: '1px solid var(--border-subtle)',
						}],
					],
				},
			},
		}),
	],
})
