import { it } from 'vitest'
import { readExampleFile, renderExampleCSS } from '../__test-utils__/render-example'

it('hero-example output matches engine', async ({ expect }) => {
	const usage = await readExampleFile(new URL('./hero-example.ts', import.meta.url))
	const css = await renderExampleCSS({
		usageCode: usage,
	})
	await expect(css).toMatchFileSnapshot('./hero-example-output.css')
})
