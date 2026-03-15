import type { FontsProviderFontEntry } from './providers'
import { describe, expect, it } from 'vitest'
import { builtInFontsProviders, defineFontsProvider } from './providers'

describe('fonts providers', () => {
	it('keeps custom providers unchanged', () => {
		const provider = defineFontsProvider({
			buildImportUrls: () => ['https://example.com/fonts.css'],
		})

		expect(provider.buildImportUrls?.())
			.toEqual(['https://example.com/fonts.css'])
	})

	it('builds expected import urls for builtin providers', () => {
		const fonts: FontsProviderFontEntry[] = [
			{ name: 'Inter', weights: ['400', '700'], italic: false, options: {} },
			{ name: 'Roboto Slab', weights: ['300'], italic: true, options: {} },
		]

		expect(builtInFontsProviders.google.buildImportUrls?.(fonts, {
			provider: 'google',
			display: 'swap',
			options: { text: 'Hello' },
		}))
			.toBe('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Roboto+Slab:ital,wght@0,300;1,300&display=swap&text=Hello')

		expect(builtInFontsProviders.bunny.buildImportUrls?.(fonts, {
			provider: 'bunny',
			display: 'swap',
			options: {},
		}))
			.toBe('https://fonts.bunny.net/css?family=Inter:400,700|Roboto+Slab:300,300i&display=swap')

		expect(builtInFontsProviders.fontshare.buildImportUrls?.(fonts, {
			provider: 'fontshare',
			display: 'swap',
			options: {},
		}))
			.toBe('https://api.fontshare.com/v2/css?f[]=inter%40400%2C700&f[]=roboto-slab%40300&display=swap')

		expect(builtInFontsProviders.coollabs.buildImportUrls?.(fonts, {
			provider: 'coollabs',
			display: 'block',
			options: { text: ['AB', 'CD'] },
		}))
			.toBe('https://api.fonts.coollabs.io/css2?family=Inter:wght@400;700&family=Roboto+Slab:ital,wght@0,300;1,300&display=block&text=AB%2CCD')

		expect(builtInFontsProviders.none.buildImportUrls?.(fonts, {
			provider: 'none',
			display: 'swap',
			options: {},
		}))
			.toEqual([])
	})
})
