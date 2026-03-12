import { it } from 'vitest'
import { readExampleFile, renderExampleCSS } from '../__test-utils__/render-example'

const files = [
	'./autocomplete-api.ts',
	'./css-import-api.ts',
	'./hook-notifications.ts',
	'./minimal-plugin.ts',
	'./module-augmentation.ts',
	'./overview-async-hook.ts',
	'./overview-minimal-plugin.ts',
	'./overview-plugin-order.ts',
	'./payload-chaining-example.ts',
	'./plugin-with-options.ts',
	'./preflight-bad-example.ts',
	'./preflight-definition.ts',
	'./preflight-with-id.ts',
	'./preflight-with-layer.ts',
] as const

const nonEmptyFiles = [
	'./hook-configure-engine.ts',
	'./hook-configure-raw-config.ts',
	'./hook-configure-resolved-config.ts',
	'./overview-engine-plugin-interface.ts',
	'./use-plugin-in-config.ts',
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