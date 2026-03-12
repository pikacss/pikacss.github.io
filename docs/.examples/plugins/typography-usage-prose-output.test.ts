import { it } from 'vitest'
import { typography } from '@pikacss/plugin-typography'
import { readExampleFile, renderExampleCSS } from '../__test-utils__/render-example'

it('typography-usage-prose output matches engine', async ({ expect }) => {
	const usage = await readExampleFile(new URL('./typography-usage-prose.ts', import.meta.url))
	const css = await renderExampleCSS({
		config: { plugins: [typography()] },
		usageCode: usage,
	})
	await expect(css).toMatchFileSnapshot('./typography-usage-prose-output.css')
})
