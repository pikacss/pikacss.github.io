import { it } from 'vitest'
import config from './shortcuts-config'
import { readExampleFile, renderExampleCSS } from '../../__test-utils__/render-example'

it('built-in shortcuts string-arg output matches engine', async ({ expect }) => {
	const usage = await readExampleFile(new URL('./shortcuts-string-arg.pikainput.ts', import.meta.url))
	const css = await renderExampleCSS({
		config,
		usageCode: usage,
	})
	await expect(css).toMatchFileSnapshot('./shortcuts-string-arg.pikaoutput.css')
})
