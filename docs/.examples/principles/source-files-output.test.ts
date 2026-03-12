import { it } from 'vitest'
import { readExampleFile, renderExampleCSS } from '../__test-utils__/render-example'

const files = [
	'./build-compiled.ts',
	'./order-class-order-problem.tsx',
	'./zero-compiled.ts',
] as const

const nonEmptyFiles = [
	'./order-class-order-problem.css',
] as const

for (const file of files) {
	it(`${file} produces no atomic output`, async ({ expect }) => {
		const usage = await readExampleFile(new URL(file, import.meta.url))
		const css = await renderExampleCSS({ usageCode: usage })
		expect(css).toBe('')
	})
}

for (const file of nonEmptyFiles) {
	it(`${file} stays non-empty`, async ({ expect }) => {
		const content = await readExampleFile(new URL(file, import.meta.url))
		expect(content.trim()).not.toBe('')
	})
}