import { it } from 'vitest'
import { readExampleFile, renderExampleCSS } from '../__test-utils__/render-example'

it('order-pika-overlap output matches engine', async ({ expect }) => {
	const usage = await readExampleFile(new URL('./order-pika-overlap.pikainput.ts', import.meta.url))
	const css = await renderExampleCSS({
		config: { prefix: 'pk-' },
		usageCode: usage,
	})
	await expect(css).toMatchFileSnapshot('./order-pika-overlap.pikaoutput.css')
})
