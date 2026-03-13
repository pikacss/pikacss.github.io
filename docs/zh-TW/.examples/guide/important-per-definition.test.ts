import { it } from 'vitest'
import { readExampleFile, renderExampleCSS } from '../__test-utils__/render-example'

it('important-per-definition output matches engine', async ({ expect }) => {
	const usage = await readExampleFile(new URL('./important-per-definition.pikainput.ts', import.meta.url))
	const css = await renderExampleCSS({
		usageCode: usage,
	})
	await expect(css).toMatchFileSnapshot('./important-per-definition.pikaoutput.css')
})
