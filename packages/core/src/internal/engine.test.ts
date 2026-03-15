import { describe, expect, it, vi } from 'vitest'
import { createEngine, renderAtomicStyles, renderPreflightDefinition, resolveEngineConfig, resolveStyleItemList } from './engine'
import { defineEnginePlugin } from './plugin'
import { log } from './utils'

describe('engine', () => {
	it('resolves engine config defaults and deduplicates css imports', async () => {
		const resolved = await resolveEngineConfig({
			cssImports: ['@import "a"', '@import "a";', '   '],
			autocomplete: { selectors: ['hover'] },
		})

		expect(resolved.cssImports)
			.toEqual(['@import "a";'])
		expect([...resolved.autocomplete.selectors])
			.toEqual(['hover'])
		expect(resolved.layers.preflights)
			.toBe(1)
		expect(resolved.layers.utilities)
			.toBe(10)
	})

	it('resolves style item lists with unknown items and explicit layers', async () => {
		const result = await resolveStyleItemList({
			itemList: ['unknown', { __layer: 'components', color: 'red' }],
			transformStyleItems: async items => items,
			extractStyleDefinition: async styleDefinition => [{ selector: ['.%'], property: 'color', value: [styleDefinition.color as string] }],
		})

		expect([...result.unknown])
			.toEqual(['unknown'])
		expect(result.contents)
			.toEqual([
				{ selector: ['@layer components', '.%'], property: 'color', value: ['red'] },
			])
	})

	it('creates an engine and renders atomic styles plus preflight definitions', async () => {
		const engine = await createEngine({
			layers: { components: 5, utilities: 10 },
		})

		await expect(engine.use('unknown-token', { __layer: 'components', color: 'red' })).resolves.toEqual(['unknown-token', 'pk-a'])
		await expect(engine.renderAtomicStyles(false)).resolves.toContain('@layer components {.pk-a{color:red;}}')
		await expect(renderPreflightDefinition({
			engine,
			preflightDefinition: {
				':root': { color: 'red' },
				'@media (min-width: 768px)': {
					':root': { color: 'blue' },
				},
			},
			isFormatted: false,
		})).resolves.toBe(':root{color:red;}@media (min-width: 768px){:root{color:blue;}}')
		expect(renderAtomicStyles({
			atomicStyles: [{ id: 'pk-a', content: { selector: ['.%'], property: 'color', value: ['red'] } }],
			isPreview: true,
			isFormatted: false,
			defaultSelector: '.%',
			layers: { utilities: 10 },
		}))
			.toBe('@layer utilities {.%{color:red;}}')
	})

	it('falls back to unlayered output for unknown layers and skips selectors dropped by plugins', async () => {
		const warnSpy = vi.spyOn(log, 'warn')
			.mockImplementation(() => {})
		const engine = await createEngine({
			plugins: [
				defineEnginePlugin({
					name: 'drop-preflight-selector',
					transformSelectors: async selectors => selectors[0] === '.drop' ? [] : selectors,
				}),
			],
			layers: { utilities: 10 },
		})

		const atomicCss = renderAtomicStyles({
			atomicStyles: [
				{ id: 'pk-a', content: { selector: ['@layer custom', '.%'], property: 'color', value: ['red'] } },
				{ id: 'pk-b', content: { selector: ['.%'], property: 'background', value: ['blue'] } },
				{ id: 'pk-c', content: { selector: ['.card'], property: 'border', value: ['1px solid black'] } },
			],
			isPreview: false,
			isFormatted: false,
			defaultSelector: '.%',
			layers: { utilities: 10 },
		})

		const preflightCss = await renderPreflightDefinition({
			engine,
			preflightDefinition: {
				'.drop': { color: 'red' },
				':root': {
					'color': 'blue',
					'.child': {
						backgroundColor: 'black',
					},
				},
			},
			isFormatted: false,
		})

		expect(warnSpy)
			.toHaveBeenCalledWith('Unknown layer "custom" encountered in atomic style; falling back to unlayered output.')
		expect(atomicCss)
			.toBe('.pk-a{color:red;}@layer utilities {.pk-b{background:blue;}}')
		expect(preflightCss)
			.toContain(':root{color:blue;.child{background-color:black;}}')
		expect(preflightCss)
			.not.toContain('color:red')
	})

	it('wraps unlayered preflights into the default layer and leaves them raw when the layer is absent', async () => {
		const layeredEngine = await createEngine({
			layers: { base: 0, tokens: 5, utilities: 10 },
			defaultPreflightsLayer: 'base',
			preflights: [
				':root{color:red;}',
				{ layer: 'tokens', preflight: ':root{background:blue;}' } as any,
			],
		})
		const rawEngine = await createEngine({
			layers: { utilities: 10 },
			defaultPreflightsLayer: 'base',
			preflights: [':root{color:red;}'],
		})

		await expect(layeredEngine.renderPreflights(false))
			.resolves.toBe('@layer base {  :root{color:red;}}@layer tokens {:root{background:blue;}}')
		await expect(rawEngine.renderPreflights(false))
			.resolves.toBe(':root{color:red;}')
	})

	it('renders formatted preflights with imports and layer indentation', async () => {
		const engine = await createEngine({
			cssImports: ['@import "./theme.css"'],
			layers: { base: 0, tokens: 5, utilities: 10 },
			defaultPreflightsLayer: 'base',
			preflights: [
				':root{color:red;}',
				{ layer: 'tokens', preflight: ':root{background:blue;}' } as any,
			],
		})

		await expect(engine.renderPreflights(true))
			.resolves.toBe([
				'@import "./theme.css";',
				'@layer base {',
				'  :root{color:red;}',
				'}',
				'@layer tokens {',
				'  :root{background:blue;}',
				'}',
			].join('\n'))
	})

	it('renders formatted object preflights with nested selectors inside the default layer', async () => {
		const engine = await createEngine({
			layers: { base: 0, utilities: 10 },
			defaultPreflightsLayer: 'base',
			preflights: [
				{
					':root': {
						'color': 'red',
						'.child': {
							backgroundColor: 'blue',
						},
					},
				},
			],
		})

		await expect(engine.renderPreflights(true))
			.resolves.toBe([
				'@layer base {',
				'  :root {',
				'    color: red;',
				'    .child {',
				'      background-color: blue;',
				'    }',
				'  }',
				'}',
			].join('\n'))
	})

	it('skips null object preflight entries and null property values', async () => {
		const engine = await createEngine({
			preflights: [
				{
					'.skip-me': null,
					':root': {
						color: 'red',
						margin: null,
					},
				} as any,
			],
		})

		await expect(engine.renderPreflights(false))
			.resolves.toBe('@layer preflights {  :root{color:red;}}')
	})

	it('drops atomic styles with invalid selectors or null values from rendered output', () => {
		const css = renderAtomicStyles({
			atomicStyles: [
				{ id: 'pk-a', content: { selector: ['.%'], property: 'color', value: ['red'] } },
				{ id: 'pk-b', content: { selector: ['.card'], property: 'background', value: ['blue'] } },
				{ id: 'pk-c', content: { selector: ['.%'], property: 'margin', value: null } as any },
			],
			isPreview: false,
			isFormatted: false,
			defaultSelector: '.%',
		})

		expect(css)
			.toBe('.pk-a{color:red;}')
	})
})
