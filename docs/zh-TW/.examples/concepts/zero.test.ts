import { it } from 'vitest'
import { readExampleFile, renderExampleCSS } from '../__test-utils__/render-example'

it('zero output matches engine', async ({ expect }) => {
	const usage = await readExampleFile(new URL('./zero.pikainput.ts', import.meta.url))
	const css = await renderExampleCSS({
		config: { prefix: 'pk-' },
		usageCode: usage,
	})
	await expect(css).toMatchFileSnapshot('./zero.pikaoutput.css')
})

it('zero.compiled.ts produces no atomic output', async ({ expect }) => {
	const usage = await readExampleFile(new URL('./zero-compiled.ts', import.meta.url))
	const css = await renderExampleCSS({ usageCode: usage })
	expect(css).toBe('')
})
