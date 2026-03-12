import { it } from 'vitest'
import config from './keyframes-config'
import { readExampleFile, renderExampleCSS } from '../__test-utils__/render-example'

it('keyframes output matches engine', async ({ expect }) => {
	const usage = await readExampleFile(new URL('./keyframes-usage.ts', import.meta.url))
	const css = await renderExampleCSS({
		config,
		usageCode: usage,
		renderScope: 'preflights-and-atomic',
	})
	await expect(css).toMatchFileSnapshot('./keyframes-output.css')
})
