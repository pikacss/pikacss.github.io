import { it } from 'vitest'
import { readExampleFile, renderExampleCSS } from '../__test-utils__/render-example'

it('pika-nested-selectors output matches engine', async ({ expect }) => {
	const usage = await readExampleFile(new URL('./pika-nested-selectors.pikainput.ts', import.meta.url))
	const css = await renderExampleCSS({
		usageCode: usage,
	})
	await expect(css).toMatchFileSnapshot('./pika-nested-selectors.pikaoutput.css')
})
