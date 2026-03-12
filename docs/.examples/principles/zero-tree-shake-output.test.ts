import { it } from 'vitest'
import { readExampleFile, renderExampleCSS } from '../__test-utils__/render-example'

it('zero-tree-shake-source output matches engine', async ({ expect }) => {
	const usage = await readExampleFile(new URL('./zero-tree-shake-source.ts', import.meta.url))
	const css = await renderExampleCSS({
		usageCode: usage,
	})
	await expect(css).toMatchFileSnapshot('./zero-tree-shake-output.css')
})
