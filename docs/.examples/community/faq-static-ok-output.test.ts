import { it } from 'vitest'
import { readExampleFile, renderExampleCSS } from '../__test-utils__/render-example'

it('faq-static-ok output matches engine', async ({ expect }) => {
	const usage = await readExampleFile(new URL('./faq-static-ok.ts', import.meta.url))
	const css = await renderExampleCSS({
		usageCode: usage,
	})
	await expect(css).toMatchFileSnapshot('./faq-static-ok-output.css')
})
