import { it } from 'vitest'
import { readExampleFile, renderExampleCSS } from '../__test-utils__/render-example'

it('pika-vue-example output matches engine', async ({ expect }) => {
	const usage = await readExampleFile(new URL('./pika-vue-example.vue', import.meta.url))
	const css = await renderExampleCSS({
		usageCode: usage,
	})
	await expect(css).toMatchFileSnapshot('./pika-vue-example-output.css')
})
