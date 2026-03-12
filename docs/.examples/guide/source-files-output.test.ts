import { it } from 'vitest'
import { readExampleFile, renderExampleCSS } from '../__test-utils__/render-example'

const files = [
	'./config-autocomplete.ts',
	'./config-basic.ts',
	'./config-css-imports.ts',
	'./config-full-example.ts',
	'./config-important.ts',
	'./config-keyframes.ts',
	'./config-layers.ts',
	'./config-plugins.ts',
	'./config-preflights-with-layer.ts',
	'./config-shortcuts.ts',
	'./config-variables-transitive.ts',
	'./config-variables.ts',
] as const

const nonEmptyFiles = [
	'./config-variables-semantic-type.ts',
	'./core-features-config.ts',
	'./important-config.ts',
	'./keyframes-config.ts',
	'./selectors-config.ts',
	'./shortcuts-config.ts',
	'./variables-config.ts',
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