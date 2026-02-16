import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import { groupIconMdPlugin as MarkdownItGroupIcon } from 'vitepress-plugin-group-icons'
import { withMermaid } from 'vitepress-plugin-mermaid'

// https://vitepress.dev/reference/site-config
export default withMermaid({
	base: '/pikacss/',

	title: 'PikaCSS',
	description: 'PikaCSS Documents',
	head: [
		['link', { rel: 'icon', href: '/pikacss/favicon.svg' }],
	],
	themeConfig: {
		logo: {
			light: '/logo-black.svg',
			dark: '/logo-white.svg',
		},

		// https://vitepress.dev/reference/default-theme-config
		nav: [
			{ text: 'Getting Started', link: '/getting-started/what-is-pikacss' },
			{ text: 'FAQ', link: '/community/faq' },
		],

		sidebar: {
			'/': [
				{
					text: 'Getting Started',
					items: [
						{ text: 'What is PikaCSS?', link: '/getting-started/what-is-pikacss' },
						{ text: 'Installation', link: '/getting-started/installation' },
						{ text: 'Zero Config', link: '/getting-started/zero-config' },
						{ text: 'First Pika', link: '/getting-started/first-pika' },
					],
				},
				{
					text: 'Core Principles',
					items: [
						{ text: 'Build-time Compile', link: '/principles/build-time-compile' },
						{ text: 'Zero Sideeffect', link: '/principles/zero-sideeffect' },
					],
				},
				{
					text: 'Integrations',
					items: [
						{ text: 'Overview', link: '/integrations/overview' },
						{ text: 'Vite', link: '/integrations/vite' },
						{ text: 'Rollup', link: '/integrations/rollup' },
						{ text: 'Nuxt', link: '/integrations/nuxt' },
						{ text: 'Webpack', link: '/integrations/webpack' },
						{ text: 'Rspack', link: '/integrations/rspack' },
						{ text: 'Esbuild', link: '/integrations/esbuild' },
						{ text: 'Rolldown', link: '/integrations/rolldown' },
					],
				},
				{
					text: 'Config & Built-ins',
					items: [
						{ text: 'Configuration', link: '/guide/configuration' },
						{ text: 'Built-in Plugins', link: '/guide/built-in-plugins' },
						{ text: 'Important', link: '/guide/built-ins/important' },
						{ text: 'Variables', link: '/guide/built-ins/variables' },
						{ text: 'Keyframes', link: '/guide/built-ins/keyframes' },
						{ text: 'Selectors', link: '/guide/built-ins/selectors' },
						{ text: 'Shortcuts', link: '/guide/built-ins/shortcuts' },
					],
				},
				{
					text: 'Plugin System',
					items: [
						{ text: 'Overview', link: '/plugin-system/overview' },
						{ text: 'Create Plugin', link: '/plugin-system/create-plugin' },
					],
				},
				{
					text: 'Official Plugins',
					items: [
						{ text: 'Icons', link: '/plugins/icons' },
						{ text: 'Reset', link: '/plugins/reset' },
						{ text: 'Typography', link: '/plugins/typography' },
					],
				},
				{
					text: 'FAQ',
					items: [{ text: 'FAQ', link: '/community/faq' }],
				},
			],
		},

		socialLinks: [
			{ icon: 'github', link: 'https://github.com/pikacss/pikacss' },
		],
	},

	markdown: {
		config: (md) => {
			md.use(MarkdownItGroupIcon)
		},
		codeTransformers: [
			transformerTwoslash({
				// twoslashOptions: {
				// 	extraFiles: {
				// 		'pika.d.ts': '/// <reference types="./.vitepress/pika.d.ts" />\n',
				// 	},
				// },
			}),
		],
		languages: ['js', 'jsx', 'ts', 'tsx'],
	},
})
