import { it } from 'vitest'
import config from './important-config'
import { renderExampleCSS } from '../__test-utils__/render-example'

it('important default true output matches engine', async ({ expect }) => {
	const usage = `const className = pika({ color: 'red', fontSize: '1rem' })`
	const css = await renderExampleCSS({
		config: { ...config, prefix: 'pk-' },
		usageCode: usage,
	})
	await expect(css).toMatchFileSnapshot('./important-default-true-output.css')
})
