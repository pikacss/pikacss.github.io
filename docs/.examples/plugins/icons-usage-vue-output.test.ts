import { it } from 'vitest'
import { icons } from '@pikacss/plugin-icons'
import { readExampleFile, renderExampleCSS } from '../__test-utils__/render-example'

const dummySvg = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>'

it('icons-usage.vue output matches engine', async ({ expect }) => {
	const usage = await readExampleFile(new URL('./icons-usage.vue', import.meta.url))
	const css = await renderExampleCSS({
		config: {
			plugins: [icons()],
			icons: {
				collections: {
					mdi: {
						home: dummySvg,
					},
					tabler: {
						settings: dummySvg,
					},
				},
			},
		},
		usageCode: usage,
	})
	await expect(css).toMatchFileSnapshot('./icons-usage-vue-output.css')
})
