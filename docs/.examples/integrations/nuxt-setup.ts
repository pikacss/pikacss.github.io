// nuxt.config.ts
export default defineNuxtConfig({
	modules: [
		'@pikacss/nuxt-pikacss',
	],
	pikacss: {
		// PluginOptions (except currentPackageName)
		scan: {
			include: ['**/*.vue', '**/*.tsx', '**/*.jsx'],
		},
	},
})
