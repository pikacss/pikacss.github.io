import { it } from 'vitest'
import config from './first-pika-config'
import { readExampleFile, renderExampleCSS } from '../__test-utils__/render-example'

it('first-pika-multiple-args output matches engine', async ({ expect }) => {
	const usage = await readExampleFile(new URL('./first-pika-multiple-args.vue', import.meta.url))
	const css = await renderExampleCSS({
		config,
		usageCode: usage,
	})
	await expect(css).toMatchFileSnapshot('./first-pika-multiple-args-output.css')
})
