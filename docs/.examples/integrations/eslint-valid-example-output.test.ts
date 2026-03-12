import { it } from 'vitest'
import { readExampleFile, renderExampleCSS } from '../__test-utils__/render-example'

it('eslint-valid-example output matches engine', async ({ expect }) => {
	const usage = await readExampleFile(new URL('./eslint-valid-example.ts', import.meta.url))
	const css = await renderExampleCSS({
		usageCode: usage,
	})
	await expect(css).toMatchFileSnapshot('./eslint-valid-example-output.css')
})
