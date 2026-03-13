import { it } from 'vitest'
import config from './variables-config'
import { readExampleFile, renderExampleCSS } from '../__test-utils__/render-example'

it('variables output matches engine', async ({ expect }) => {
	const usage = await readExampleFile(new URL('./variables.pikainput.ts', import.meta.url))
	const css = await renderExampleCSS({
		config,
		usageCode: usage,
		renderScope: 'preflights-and-atomic',
	})
	await expect(css).toMatchFileSnapshot('./variables.pikaoutput.css')
})
