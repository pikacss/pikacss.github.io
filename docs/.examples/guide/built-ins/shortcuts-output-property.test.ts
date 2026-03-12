import { it } from 'vitest'
import config from './shortcuts-config'
import { readExampleFile, renderExampleCSS } from '../../__test-utils__/render-example'

it('built-in shortcuts property output matches engine', async ({ expect }) => {
	const usage = await readExampleFile(new URL('./shortcuts-usage-property.ts', import.meta.url))
	const css = await renderExampleCSS({
		config,
		usageCode: usage,
	})
	await expect(css).toMatchFileSnapshot('./shortcuts-output-property.css')
})
