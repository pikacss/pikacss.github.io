import { it } from 'vitest'
import { readExampleFile, renderExampleCSS } from '../__test-utils__/render-example'

it('first-pika-basic.vue output matches engine', async ({ expect }) => {
	const usage = await readExampleFile(new URL('./first-pika-basic.vue', import.meta.url))
	const css = await renderExampleCSS({
		usageCode: usage,
	})
	await expect(css).toMatchFileSnapshot('./first-pika-basic-vue-output.css')
})
