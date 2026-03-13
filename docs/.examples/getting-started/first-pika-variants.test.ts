import { it } from 'vitest'
import config from './first-pika-config'
import { readExampleFile, renderExampleCSS } from '../__test-utils__/render-example'

it('first-pika-variants output matches engine', async ({ expect }) => {
	const usage = await readExampleFile(new URL('./first-pika-variants.pikainput.ts', import.meta.url))
	const css = await renderExampleCSS({
		config,
		usageCode: usage,
	})
	await expect(css).toMatchFileSnapshot('./first-pika-variants.pikaoutput.css')
})
