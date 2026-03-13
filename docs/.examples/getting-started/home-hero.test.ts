import { it } from 'vitest'
import { readExampleFile, renderExampleCSS } from '../__test-utils__/render-example'

it('home-hero output matches engine', async ({ expect }) => {
	const usage = await readExampleFile(new URL('./home-hero.pikainput.ts', import.meta.url))
	const css = await renderExampleCSS({
		usageCode: usage,
	})
	await expect(css).toMatchFileSnapshot('./home-hero.pikaoutput.css')
})
