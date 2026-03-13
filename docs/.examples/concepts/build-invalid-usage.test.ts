import { it } from 'vitest'
import { readExampleFile, renderExampleCSS } from '../__test-utils__/render-example'

it('build-invalid-usage produces empty CSS (dynamic values)', async ({ expect }) => {
	const usage = await readExampleFile(new URL('./build-invalid-usage.pikainput.ts', import.meta.url))
	const css = await renderExampleCSS({
		usageCode: usage,
	})
	await expect(css).toMatchFileSnapshot('./build-invalid-usage.pikaoutput.css')
})
