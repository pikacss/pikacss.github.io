import { it } from 'vitest'
import { readExampleFile, renderExampleCSS } from '../__test-utils__/render-example'

it('eslint-invalid-example produces empty CSS (dynamic values)', async ({ expect }) => {
	const usage = await readExampleFile(new URL('./eslint-invalid-example.ts', import.meta.url))
	const css = await renderExampleCSS({
		usageCode: usage,
	})
	expect(css).toBe('')
})
