import { describe, expect, it, vi } from 'vitest'
import { important } from './important'

describe('important plugin', () => {
	it('registers autocomplete metadata for __important', () => {
		const plugin = important()
		const appendAutocomplete = vi.fn()

		plugin.configureEngine?.({ appendAutocomplete } as any)

		expect(appendAutocomplete)
			.toHaveBeenCalledWith({
				extraProperties: '__important',
				properties: { __important: 'boolean' },
			})
	})

	it('applies important modifiers using defaults and explicit overrides', () => {
		const plugin = important()
		plugin.rawConfigConfigured?.({ important: { default: true } } as any)

		const transformed = plugin.transformStyleDefinitions?.([
			{ color: 'red' },
			{ __important: false, backgroundColor: 'blue' } as any,
			{ __important: true, margin: ['1rem', ['2rem', '3rem']] } as any,
		])

		expect(transformed)
			.toEqual([
				{ color: 'red !important' },
				{ backgroundColor: 'blue' },
				{ margin: ['1rem !important', ['2rem !important', '3rem !important']] },
			])
	})
})
