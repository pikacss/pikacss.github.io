export default defineNuxtConfig({
	modules: ['@pikacss/nuxt-pikacss'],
	pikacss: {
		scan: {
			include: [
				'app/**/*.{js,ts,vue}',
				'components/**/*.{js,ts,vue}',
				'features/**/*.{ts,tsx,vue}',
			],
			exclude: ['node_modules/**', '.nuxt/**'],
		},
	},
})
