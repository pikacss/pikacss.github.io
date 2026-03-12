import { it } from 'vitest'
import { readExampleFile, renderExampleCSS } from '../__test-utils__/render-example'

it('build-valid-usage output matches engine', async ({ expect }) => {
	const usage = await readExampleFile(new URL('./build-valid-usage.ts', import.meta.url))
	const css = await renderExampleCSS({
		usageCode: usage,
	})
	await expect(css).toMatchFileSnapshot('./build-valid-usage-output.css')
})
