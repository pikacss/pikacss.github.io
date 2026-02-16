// esbuild.config.js
import PikaCSS from '@pikacss/unplugin-pikacss/esbuild'
import { build } from 'esbuild'

build({
	plugins: [
		PikaCSS({
			/* PluginOptions */
		}),
	],
})
