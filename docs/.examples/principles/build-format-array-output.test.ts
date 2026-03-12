import { it } from 'vitest'
import { readExampleFile, renderExampleCSS } from '../__test-utils__/render-example'

it('build-format-array output matches engine', async ({ expect }) => {
	const usage = await readExampleFile(new URL('./build-format-array.ts', import.meta.url))
	const css = await renderExampleCSS({
		usageCode: usage,
	})
	await expect(css).toMatchFileSnapshot('./build-format-array-output.css')
})
