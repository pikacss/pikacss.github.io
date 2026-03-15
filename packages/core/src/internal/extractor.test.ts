import { describe, expect, it } from 'vitest'
import { createExtractFn, extract, normalizeSelectors, normalizeValue } from './extractor'

describe('extractor', () => {
	it('normalizes selectors while preserving attribute suffix matches', () => {
		const normalized = normalizeSelectors({
			selectors: ['$:hover, [data-kind$="icon"] $', '% $'],
			defaultSelector: '.pk-a',
		})

		expect(normalized)
			.toEqual([
				'.pk-a:hover,[data-kind$="icon"] .pk-a',
				'% .pk-a',
			])
	})

	it('normalizes property values by trimming and removing duplicate fallbacks', () => {
		expect(normalizeValue([' red ', [' red ', 'blue', 'blue ']]))
			.toEqual(['blue', 'red'])
		expect(normalizeValue(' 1rem '))
			.toEqual(['1rem'])
		expect(normalizeValue(null))
			.toBeNull()
	})

	it('extracts nested definitions and falls back to the default selector when transforms return no selector', async () => {
		const result = await extract({
			styleDefinition: {
				color: ' red ',
				hover: { backgroundColor: 'blue' },
				stack: ['ignored', { borderColor: 'black' }],
			},
			defaultSelector: '.%',
			transformSelectors: async (selectors) => {
				if (selectors.length === 0)
					return []
				return selectors.map(selector => selector === 'hover' ? '$:hover' : selector)
			},
			transformStyleItems: async items => items,
			transformStyleDefinitions: async definitions => definitions,
		})

		expect(result)
			.toEqual([
				{ selector: ['.%'], property: 'color', value: ['red'] },
				{ selector: ['.%:hover'], property: 'background-color', value: ['blue'] },
				{ selector: ['stack', '.%'], property: 'border-color', value: ['black'] },
			])
	})

	it('creates reusable extract functions with shared transforms', async () => {
		const extractFn = createExtractFn({
			defaultSelector: '.%',
			transformSelectors: async selectors => selectors,
			transformStyleItems: async items => items,
			transformStyleDefinitions: async definitions => definitions,
		})

		await expect(extractFn({ color: 'red' })).resolves.toEqual([
			{ selector: ['.%'], property: 'color', value: ['red'] },
		])
	})
})
