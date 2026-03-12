import { it } from 'vitest'
import { readExampleFile, renderExampleCSS } from '../__test-utils__/render-example'

it('faq-case output matches engine', async ({ expect }) => {
	const usage = await readExampleFile(new URL('./faq-case.ts', import.meta.url))
	const css = await renderExampleCSS({
		usageCode: usage,
	})
	await expect(css).toMatchFileSnapshot('./faq-case-output.css')
})
