import { it } from 'vitest'
import { readExampleFile, renderExampleCSS } from '../../__test-utils__/render-example'

it('style-definition-define-helper produces empty CSS (variable reference pattern)', async ({ expect }) => {
	const usage = await readExampleFile(new URL('./style-definition-define-helper.pikainput.ts', import.meta.url))
	const css = await renderExampleCSS({
		usageCode: usage,
	})
	await expect(css).toMatchFileSnapshot('./style-definition-define-helper.pikaoutput.css')
})
