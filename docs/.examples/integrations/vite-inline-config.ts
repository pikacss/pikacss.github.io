// vite.config.ts — inline engine configuration (no separate config file)
import PikaCSS from '@pikacss/unplugin-pikacss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [
		PikaCSS({
			// Pass engine config directly — autoCreateConfig is ignored when using inline config
			config: {
				prefix: 'pk-',
				shortcuts: {
					btn: { padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' },
				},
			},
			autoCreateConfig: false,
		}),
	],
})
