import { it } from 'vitest'
import { readExampleFile, renderExampleCSS } from '../__test-utils__/render-example'

it('build-format-string output matches engine', async ({ expect }) => {
	const usage = await readExampleFile(new URL('./build-format-string.ts', import.meta.url))
	const css = await renderExampleCSS({
		usageCode: usage,
	})
	await expect(css).toMatchFileSnapshot('./build-format-string-output.css')
})
