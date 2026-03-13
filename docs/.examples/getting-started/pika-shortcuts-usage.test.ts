import { it } from 'vitest'
import config from './custom-config'
import { readExampleFile, renderExampleCSS } from '../__test-utils__/render-example'

it('pika-shortcuts-usage output matches engine', async ({ expect }) => {
	const usage = await readExampleFile(new URL('./pika-shortcuts-usage.pikainput.ts', import.meta.url))
	const css = await renderExampleCSS({
		config,
		usageCode: usage,
	})
	await expect(css).toMatchFileSnapshot('./pika-shortcuts-usage.pikaoutput.css')
})
