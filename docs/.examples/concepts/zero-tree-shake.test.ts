import { it } from 'vitest'
import { readExampleFile, renderExampleCSS } from '../__test-utils__/render-example'

it('zero-tree-shake output matches engine', async ({ expect }) => {
	const usage = await readExampleFile(new URL('./zero-tree-shake.pikainput.ts', import.meta.url))
	const css = await renderExampleCSS({
		usageCode: usage,
	})
	await expect(css).toMatchFileSnapshot('./zero-tree-shake.pikaoutput.css')
})
