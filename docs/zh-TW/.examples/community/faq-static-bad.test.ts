import { it } from 'vitest'
import { readExampleFile, renderExampleCSS } from '../__test-utils__/render-example'

it('faq-static-bad produces empty CSS (dynamic values)', async ({ expect }) => {
	const usage = await readExampleFile(new URL('./faq-static-bad.pikainput.ts', import.meta.url))
	const css = await renderExampleCSS({
		usageCode: usage,
	})
	await expect(css).toMatchFileSnapshot('./faq-static-bad.pikaoutput.css')
})
