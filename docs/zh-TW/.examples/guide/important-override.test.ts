import { it } from 'vitest'
import { renderExampleCSS } from '../__test-utils__/render-example'

it('important override output matches engine', async ({ expect }) => {
	const overrideFalseUsage = `const a = pika({ __important: false, color: 'red', fontSize: '1rem' })`
	const overrideFalseCss = await renderExampleCSS({
		config: { prefix: 'pk-', important: { default: true } },
		usageCode: overrideFalseUsage,
	})

	const overrideTrueUsage = `const b = pika({ __important: true, color: 'blue', fontSize: '2rem' })`
	const overrideTrueCss = await renderExampleCSS({
		config: { prefix: 'pk-', important: { default: false } },
		usageCode: overrideTrueUsage,
	})

	const combined = `${overrideFalseCss}\n${overrideTrueCss}`
	await expect(combined).toMatchFileSnapshot('./important-override.pikaoutput.css')
})
