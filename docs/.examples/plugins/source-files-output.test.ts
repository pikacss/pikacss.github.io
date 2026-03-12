import { it } from 'vitest'
import { readExampleFile, renderExampleCSS } from '../__test-utils__/render-example'

const files = [
	'./fonts-custom-provider.ts',
	'./fonts-font-face.ts',
	'./fonts-provider-options.ts',
	'./icons-custom-collections.ts',
	'./icons-directory-collection.ts',
	'./reset-all-presets.ts',
	'./reset-basic-usage.ts',
	'./reset-custom-preset.ts',
	'./typography-custom-variables.ts',
] as const

const nonEmptyFiles = [
	'./fonts-basic-config.ts',
	'./fonts-install-npm.sh',
	'./fonts-install-yarn.sh',
	'./fonts-install.sh',
	'./icons-advanced-config.ts',
	'./icons-basic-config.ts',
	'./icons-install-npm.sh',
	'./icons-install-yarn.sh',
	'./icons-install.sh',
	'./reset-install-npm.sh',
	'./reset-install-yarn.sh',
	'./reset-install.sh',
	'./typography-basic-config.ts',
	'./typography-install-npm.sh',
	'./typography-install-yarn.sh',
	'./typography-install.sh',
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