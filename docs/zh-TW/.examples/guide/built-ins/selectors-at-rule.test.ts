import { it } from 'vitest'
import config from './selectors-config'
import { renderExampleCSS } from '../../__test-utils__/render-example'

it('built-in selectors at-rule output matches engine', async ({ expect }) => {
	const usage = `const className = pika({ md: { color: 'red' } })`
	const css = await renderExampleCSS({
		config,
		usageCode: usage,
	})
	await expect(css).toMatchFileSnapshot('./selectors-at-rule.pikaoutput.css')
})
