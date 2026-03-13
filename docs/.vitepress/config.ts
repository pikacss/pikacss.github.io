import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import { groupIconMdPlugin as MarkdownItGroupIcon } from 'vitepress-plugin-group-icons'
import { withMermaid } from 'vitepress-plugin-mermaid'

const englishNav = [] as any[]

const englishSidebar = [] as any[]

const zhTwNav = [] as any[]

const zhTwSidebar = [] as any[]

export default withMermaid({
	base: '/',
	title: 'PikaCSS',
	description: '',
	locales: {
		'root': {
			label: 'English',
			lang: 'en',
		},
		'zh-TW': {
			label: '繁體中文',
			lang: 'zh-TW',
			link: '/zh-TW/',
			title: 'PikaCSS',
			description: '',
			themeConfig: {
				nav: zhTwNav,
				sidebar: {
					'/zh-TW/': zhTwSidebar,
				},
			},
		},
	},
	head: [
		['link', { rel: 'icon', href: '/favicon.svg' }],
	],
	themeConfig: {
		logo: {
			light: '/logo-black.svg',
			dark: '/logo-white.svg',
		},
		nav: englishNav,
		sidebar: {
			'/': englishSidebar,
			'/zh-TW/': zhTwSidebar,
		},
		socialLinks: [
			{ icon: 'github', link: 'https://github.com/pikacss/pikacss' },
		],
		search: {
			provider: 'local',
		},
	},
	markdown: {
		config: (md) => {
			md.use(MarkdownItGroupIcon)
		},
		codeTransformers: [
			transformerTwoslash(),
		],
		languages: ['js', 'jsx', 'ts', 'tsx'],
	},
})
