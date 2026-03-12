import { it } from 'vitest'
import { readExampleFile, renderExampleCSS } from '../__test-utils__/render-example'

it('dynamic-values-bad produces empty CSS (dynamic values)', async ({ expect }) => {
	const usage = await readExampleFile(new URL('./dynamic-values-bad.tsx', import.meta.url))
	const css = await renderExampleCSS({
		usageCode: usage,
	})
	expect(css).toBe('')
})
