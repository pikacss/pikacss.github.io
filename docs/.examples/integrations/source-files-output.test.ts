import { it } from 'vitest'
import { readExampleFile, renderExampleCSS } from '../__test-utils__/render-example'

const files = [
	'./import-pika-css.ts',
	'./nuxt.config.scan-all.ts',
	'./nuxt.config.ts',
	'./plugin-options.ts',
	'./vite-all-options.ts',
] as const

const nonEmptyFiles = [
	'./eslint-install-npm.sh',
	'./eslint-install-yarn.sh',
	'./eslint-install.sh',
	'./eslint-recommended-config.mjs',
	'./install-nuxt-npm.sh',
	'./install-nuxt-yarn.sh',
	'./install-nuxt.sh',
	'./vite-basic-config.ts',
	'./vite-inline-config.ts',
	'./vite-install-npm.sh',
	'./vite-install-yarn.sh',
	'./vite-install.sh',
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