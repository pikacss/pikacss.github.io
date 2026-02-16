import PikaCSS from '@pikacss/unplugin-pikacss/esbuild'
// build.ts
import { build } from 'esbuild'

await build({
	entryPoints: ['src/main.ts'],
	bundle: true,
	outdir: 'dist',
	plugins: [
		PikaCSS(),
	],
})
