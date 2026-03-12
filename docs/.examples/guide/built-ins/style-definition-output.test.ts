import { it } from 'vitest'
import { readExampleFile, renderExampleCSS } from '../../__test-utils__/render-example'

it('style-definition-define-helper produces empty CSS (variable reference pattern)', async ({ expect }) => {
	const usage = await readExampleFile(new URL('./style-definition-define-helper.ts', import.meta.url))
	const css = await renderExampleCSS({
		usageCode: usage,
	})
	// pika(badgeBase) references a local variable — transform cannot statically extract it
	expect(css).toBe('')
})
