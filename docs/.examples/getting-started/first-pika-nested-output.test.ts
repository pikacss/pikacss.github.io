import { it } from 'vitest'
import config from './first-pika-config'
import { readExampleFile, renderExampleCSS } from '../__test-utils__/render-example'

it('first-pika-nested output matches engine', async ({ expect }) => {
	const usage = await readExampleFile(new URL('./first-pika-nested.vue', import.meta.url))
	const css = await renderExampleCSS({
		config,
		usageCode: usage,
	})
	await expect(css).toMatchFileSnapshot('./first-pika-nested-output.css')
})
