import { it } from 'vitest'
import { readExampleFile, renderExampleCSS } from '../__test-utils__/render-example'

it('faq-atomic output matches engine', async ({ expect }) => {
	const usage = await readExampleFile(new URL('./faq-atomic.pikainput.ts', import.meta.url))
	const css = await renderExampleCSS({
		config: { prefix: 'pk-' },
		usageCode: usage,
	})
	await expect(css).toMatchFileSnapshot('./faq-atomic.pikaoutput.css')
})
