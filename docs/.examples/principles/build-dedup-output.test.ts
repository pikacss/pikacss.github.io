import { it } from 'vitest'
import { readExampleFile, renderExampleCSS } from '../__test-utils__/render-example'

it('build-dedup output matches engine', async ({ expect }) => {
	const usage = await readExampleFile(new URL('./build-dedup-source.ts', import.meta.url))
	const css = await renderExampleCSS({
		config: { prefix: 'pk-' },
		usageCode: usage,
		renderScope: 'full',
	})
	await expect(css).toMatchFileSnapshot('./build-dedup-output.css')
})
