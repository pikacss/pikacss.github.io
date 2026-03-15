import { log } from '@pikacss/core'
import { describe, expect, it, vi } from 'vitest'
import { builtInFontsProviders, fonts } from './index'

function createMockEngine() {
	return {
		appendCssImport: vi.fn(),
		addPreflight: vi.fn(),
		appendAutocomplete: vi.fn(),
		variables: { add: vi.fn() },
		shortcuts: { add: vi.fn() },
	} as any
}

describe('fonts plugin', () => {
	it('registers imports, font faces, variables, shortcuts, and autocomplete', async () => {
		const plugin = fonts()
		plugin.configureRawConfig?.({
			fonts: {
				imports: ['https://example.com/base.css'],
				fonts: {
					sans: ['Inter:400,700', 'system-ui'],
				},
				families: {
					display: ['"Alegreya"', 'serif'],
				},
				faces: [{
					fontFamily: 'Local Sans',
					src: 'url(/local.woff2) format("woff2")',
					fontDisplay: 'swap',
				}],
				providerOptions: {
					google: { text: 'AB' },
				},
			},
		} as any)

		const engine = createMockEngine()
		await plugin.configureEngine?.(engine)

		expect(engine.appendCssImport)
			.toHaveBeenCalledWith('@import url("https://example.com/base.css");')
		expect(engine.appendCssImport)
			.toHaveBeenCalledWith('@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap&text=AB");')
		expect(engine.addPreflight)
			.toHaveBeenCalledWith({
				id: 'fonts:preflight',
				preflight: '@font-face { font-family: "Local Sans"; src: url(/local.woff2) format("woff2"); font-display: swap; }',
			})
		expect(engine.variables.add)
			.toHaveBeenCalledWith({
				'--pk-font-sans': {
					value: '"Inter", system-ui, ui-sans-serif, sans-serif',
					autocomplete: { asValueOf: 'font-family', asProperty: false },
				},
			})
		expect(engine.variables.add)
			.toHaveBeenCalledWith({
				'--pk-font-display': {
					value: '"Alegreya", serif',
					autocomplete: { asValueOf: 'font-family', asProperty: false },
				},
			})
		expect(engine.shortcuts.add)
			.toHaveBeenCalledWith(['font-sans', { fontFamily: 'var(--pk-font-sans)' }])
		expect(engine.shortcuts.add)
			.toHaveBeenCalledWith(['font-display', { fontFamily: 'var(--pk-font-display)' }])
		expect(engine.appendAutocomplete)
			.toHaveBeenCalledWith({
				cssProperties: {
					'font-family': ['"Inter", system-ui, ui-sans-serif, sans-serif', '"Alegreya", serif'],
				},
			})
	})

	it('re-exports builtin providers', () => {
		expect(Object.keys(builtInFontsProviders))
			.toEqual(['google', 'bunny', 'fontshare', 'coollabs', 'none'])
	})

	it('skips provider imports for generic families, omits empty preflights, and warns on unknown providers', async () => {
		const warnSpy = vi.spyOn(log, 'warn')
			.mockImplementation(() => {})
		const plugin = fonts()
		plugin.configureRawConfig?.({
			fonts: {
				provider: 'google',
				fonts: {
					sans: ['system-ui', 'Inter', 'Inter:400,400'],
					display: [{ name: 'Brand Sans', provider: 'missing' as any, weights: [500], italic: true }],
				},
				families: {
					mono: ['monospace', '"SF Mono"'],
					fancy: 'var(--font-fancy)',
				},
				faces: [],
			},
		} as any)

		const engine = createMockEngine()
		await plugin.configureEngine?.(engine)

		expect(engine.addPreflight)
			.not.toHaveBeenCalled()
		expect(engine.appendCssImport)
			.toHaveBeenCalledTimes(1)
		expect(engine.appendCssImport)
			.toHaveBeenCalledWith('@import url("https://fonts.googleapis.com/css2?family=Inter&family=Inter:wght@400&display=swap");')
		expect(engine.variables.add)
			.toHaveBeenCalledWith({
				'--pk-font-mono': {
					value: 'monospace, "SF Mono"',
					autocomplete: { asValueOf: 'font-family', asProperty: false },
				},
			})
		expect(engine.variables.add)
			.toHaveBeenCalledWith({
				'--pk-font-fancy': {
					value: 'var(--font-fancy)',
					autocomplete: { asValueOf: 'font-family', asProperty: false },
				},
			})
		expect(warnSpy)
			.toHaveBeenCalledWith('Unknown fonts provider "missing". Skipping import generation.')
	})

	it('renders full font-face declarations with all optional properties', async () => {
		const plugin = fonts()
		plugin.configureRawConfig?.({
			fonts: {
				faces: [{
					fontFamily: 'Wide Sans',
					src: ['url(/wide.woff2) format("woff2")', 'url(/wide.woff) format("woff")'],
					fontDisplay: 'fallback',
					fontWeight: 600,
					fontStyle: 'italic',
					fontStretch: 'expanded',
					unicodeRange: ['U+000-5FF', 'U+1E00-1FFF'],
				}],
			},
		} as any)

		const engine = createMockEngine()
		await plugin.configureEngine?.(engine)

		expect(engine.addPreflight)
			.toHaveBeenCalledWith({
				id: 'fonts:preflight',
				preflight: '@font-face { font-family: "Wide Sans"; src: url(/wide.woff2) format("woff2"), url(/wide.woff) format("woff"); font-display: fallback; font-weight: 600; font-style: italic; font-stretch: expanded; unicode-range: U+000-5FF, U+1E00-1FFF; }',
			})
	})
})
