import { it } from 'vitest'
import config from './selectors-config'
import { readExampleFile, renderExampleCSS } from '../../__test-utils__/render-example'

it('built-in selectors output matches engine', async ({ expect }) => {
	const usage = await readExampleFile(new URL('./selectors.pikainput.ts', import.meta.url))
	const css = await renderExampleCSS({
		config,
		usageCode: usage,
	})
	await expect(css).toMatchFileSnapshot('./selectors.pikaoutput.css')
})
