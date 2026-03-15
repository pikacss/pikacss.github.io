import { describe, expect, it, vi } from 'vitest'
import { shortcuts } from './shortcuts'

describe('shortcuts plugin', () => {
	it('resolves shortcut strings and expands __shortcut definitions', async () => {
		const plugin = shortcuts()
		plugin.rawConfigConfigured?.({
			shortcuts: {
				shortcuts: [
					['center', { display: 'flex', justifyContent: 'center' }],
					[/^m-(\d+)$/, (match: RegExpMatchArray) => ({ margin: `${match[1]}px` }), ['m-4']],
				],
			},
		} as any)

		const appendAutocomplete = vi.fn()
		const engine: any = { appendAutocomplete }
		plugin.configureEngine?.(engine)

		expect(await plugin.transformStyleItems?.(['center', 'm-4', { color: 'red' }]))
			.toEqual([
				{ display: 'flex', justifyContent: 'center' },
				{ margin: '4px' },
				{ color: 'red' },
			])

		expect(await plugin.transformStyleDefinitions?.([
			{ __shortcut: ['center', 'm-4'], color: 'red' },
		]))
			.toEqual([
				{ display: 'flex', justifyContent: 'center' },
				{ margin: '4px' },
				{ color: 'red' },
			])
		expect(appendAutocomplete)
			.toHaveBeenCalledWith({
				extraProperties: '__shortcut',
				properties: {
					__shortcut: ['(string & {}) | Autocomplete[\'Shortcut\']', '((string & {}) | Autocomplete[\'Shortcut\'])[]'],
				},
			})
	})

	it('ignores invalid configs, preserves unknown strings, and handles null __shortcut', async () => {
		const plugin = shortcuts()
		plugin.rawConfigConfigured?.({
			shortcuts: {
				shortcuts: [
					null,
					['known', { display: 'block' }],
				] as any,
			},
		} as any)

		const appendAutocomplete = vi.fn()
		const engine: any = { appendAutocomplete }
		plugin.configureEngine?.(engine)

		expect(await plugin.transformStyleItems?.(['missing', { color: 'red' }]))
			.toEqual([
				'missing',
				{ color: 'red' },
			])
		expect(await plugin.transformStyleDefinitions?.([
			{ __shortcut: null, color: 'red' },
		]))
			.toEqual([
				{ color: 'red' },
			])
		expect(appendAutocomplete)
			.toHaveBeenCalledWith({ shortcuts: ['known'] })
	})
})
