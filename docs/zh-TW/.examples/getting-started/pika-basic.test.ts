import { it } from 'vitest'
import config from './default-engine-config'
import { readExampleFile, renderExampleCSS } from '../__test-utils__/render-example'

it('pika-basic output matches engine', async ({ expect }) => {
	const usage = await readExampleFile(new URL('./pika-basic.pikainput.ts', import.meta.url))
	const css = await renderExampleCSS({
		config,
		usageCode: usage,
	})
	await expect(css).toMatchFileSnapshot('./pika-basic.pikaoutput.css')
})
