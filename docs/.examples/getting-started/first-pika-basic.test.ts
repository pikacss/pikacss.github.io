import { it } from 'vitest'
import config from './first-pika-config'
import { readExampleFile, renderExampleCSS } from '../__test-utils__/render-example'

it('first-pika output matches engine', async ({ expect }) => {
	const usage = await readExampleFile(new URL('./first-pika-basic.pikainput.ts', import.meta.url))
	const css = await renderExampleCSS({
		config,
		usageCode: usage,
	})
	await expect(css).toMatchFileSnapshot('./first-pika-basic.pikaoutput.css')
})
