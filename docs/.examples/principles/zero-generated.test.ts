import { it } from 'vitest'
import { readExampleFile, renderExampleCSS } from '../__test-utils__/render-example'

it('zero-generated output matches engine', async ({ expect }) => {
	const usage = await readExampleFile(new URL('./zero-source.ts', import.meta.url))
	const css = await renderExampleCSS({
		config: { prefix: 'pk-' },
		usageCode: usage,
	})
	await expect(css).toMatchFileSnapshot('./zero-generated.css')
})
