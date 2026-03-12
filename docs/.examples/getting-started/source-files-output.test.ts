import { it } from 'vitest'
import { readExampleFile, renderExampleCSS } from '../__test-utils__/render-example'

const files = [
	'./first-pika-entry.ts',
	'./pika.config.ts',
] as const

const nonEmptyFiles = [
	'./auto-created-config.js',
	'./custom-config.ts',
	'./default-engine-config.ts',
	'./first-pika-config.ts',
	'./install-unplugin-npm.sh',
	'./install-unplugin-yarn.sh',
	'./install-unplugin.sh',
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