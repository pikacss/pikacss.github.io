import { describe, expect, it, vi } from 'vitest'
import { resolveSelectorConfig, selectors } from './selectors'

describe('selectors plugin', () => {
	it('resolves selector config definitions', () => {
		expect(resolveSelectorConfig('hover'))
			.toBe('hover')
		expect(resolveSelectorConfig(['hover', '$:hover']))
			.toMatchObject({
				type: 'static',
				autocomplete: ['hover'],
			})
		expect(resolveSelectorConfig([/^screen-(\d+)$/, match => `@media (min-width:${match[1]}px)`]))
			.toMatchObject({
				type: 'dynamic',
				autocomplete: [],
			})
	})

	it('adds selector rules and resolves static plus dynamic selectors', async () => {
		const plugin = selectors()
		plugin.rawConfigConfigured?.({
			selectors: {
				selectors: [
					['hover', '$:hover'],
					[/^screen-(\d+)$/, (match: RegExpMatchArray) => `@media (min-width:${match[1]}px)`, ['screen-1']],
				],
			},
		} as any)

		const appendAutocomplete = vi.fn()
		const engine: any = { appendAutocomplete }
		plugin.configureEngine?.(engine)

		expect(await plugin.transformSelectors?.(['hover', 'screen-2', 'plain']))
			.toEqual([
				'$:hover',
				'@media (min-width:2px)',
				'plain',
			])
		expect(appendAutocomplete)
			.toHaveBeenCalledWith({ selectors: 'screen-2' })
	})

	it('ignores invalid selector configs and leaves unmatched selectors unchanged', async () => {
		const plugin = selectors()
		plugin.rawConfigConfigured?.({
			selectors: {
				selectors: [
					null,
					['hover', '$:hover'],
				] as any,
			},
		} as any)

		const appendAutocomplete = vi.fn()
		const engine: any = { appendAutocomplete }
		plugin.configureEngine?.(engine)

		expect(await plugin.transformSelectors?.(['plain']))
			.toEqual(['plain'])
		expect(appendAutocomplete)
			.toHaveBeenCalledWith({ selectors: ['hover'] })
	})
})
