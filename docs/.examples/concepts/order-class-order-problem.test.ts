import { it } from 'vitest'
import { readExampleFile, renderExampleCSS } from '../__test-utils__/render-example'

it('order-class-order-problem.tsx produces no atomic output', async ({ expect }) => {
	const usage = await readExampleFile(new URL('./order-class-order-problem.tsx', import.meta.url))
	const css = await renderExampleCSS({ usageCode: usage })
	expect(css).toBe('')
})

it('order-class-order-problem.manual.css stays non-empty', async ({ expect }) => {
	const content = await readExampleFile(new URL('./order-class-order-problem.manual.css', import.meta.url))
	expect(content.trim()).not.toBe('')
})