import { it } from 'vitest'
import { readExampleFile, renderExampleCSS } from '../__test-utils__/render-example'

it('build-generated output matches engine', async ({ expect }) => {
	const usage = await readExampleFile(new URL('./build-source.ts', import.meta.url))
	const css = await renderExampleCSS({
		config: { prefix: 'pk-' },
		usageCode: usage,
		renderScope: 'full',
	})
	await expect(css).toMatchFileSnapshot('./build-generated.css')
})
