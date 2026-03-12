import type { PluginOptions } from '@pikacss/unplugin-pikacss'

const options: PluginOptions = {
	scan: {
		include: ['src/**/*.{ts,tsx,vue}', 'components/**/*.{ts,tsx,vue}'],
		exclude: ['node_modules/**', 'dist/**', 'coverage/**'],
	},
	config: './pika.config.ts',
	autoCreateConfig: false,
	fnName: 'pika',
	transformedFormat: 'string',
	tsCodegen: 'types/pika.gen.ts',
	cssCodegen: 'styles/pika.gen.css',
}
