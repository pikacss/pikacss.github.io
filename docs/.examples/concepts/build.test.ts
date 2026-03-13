import { it } from 'vitest'
import { readExampleFile, renderExampleCSS } from '../__test-utils__/render-example'

it('build output matches engine', async ({ expect }) => {
	const usage = await readExampleFile(new URL('./build.pikainput.ts', import.meta.url))
	const css = await renderExampleCSS({
		config: { prefix: 'pk-' },
		usageCode: usage,
		renderScope: 'full',
	})
	await expect(css).toMatchFileSnapshot('./build.pikaoutput.css')
})

it('build.compiled.ts produces no atomic output', async ({ expect }) => {
	const usage = await readExampleFile(new URL('./build-compiled.ts', import.meta.url))
	const css = await renderExampleCSS({ usageCode: usage })
	expect(css).toBe('')
})
