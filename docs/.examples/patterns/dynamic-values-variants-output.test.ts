import { it } from 'vitest'
import { readExampleFile, renderExampleCSS } from '../__test-utils__/render-example'

it('dynamic-values-variants output matches engine', async ({ expect }) => {
	const usage = await readExampleFile(new URL('./dynamic-values-variants.tsx', import.meta.url))
	const css = await renderExampleCSS({
		usageCode: usage,
	})
	await expect(css).toMatchFileSnapshot('./dynamic-values-variants-output.css')
})
