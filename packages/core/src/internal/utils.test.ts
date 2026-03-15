import { describe, expect, it, vi } from 'vitest'
import { appendAutocomplete, createLogger, isPropertyValue, numberToChars, renderCSSStyleBlocks, toKebab } from './utils'

describe('utils', () => {
	it('creates a configurable logger with debug gating', () => {
		const debug = vi.fn()
		const info = vi.fn()
		const logger = createLogger('[Test]')

		logger.setDebugFn(debug)
		logger.setInfoFn(info)
		logger.debug('hidden')
		logger.toggleDebug()
		logger.debug('shown')
		logger.setPrefix('[Next]')
		logger.info('hello')

		expect(debug)
			.toHaveBeenCalledTimes(1)
		expect(debug)
			.toHaveBeenCalledWith('[Test][DEBUG]', 'shown')
		expect(info)
			.toHaveBeenCalledWith('[Next][INFO]', 'hello')
	})

	it('formats identifiers and detects property value shapes', () => {
		expect(numberToChars(0))
			.toBe('a')
		expect(numberToChars(51))
			.toBe('Z')
		expect(numberToChars(52))
			.toBe('aa')
		expect(toKebab('backgroundColor'))
			.toBe('background-color')
		expect(toKebab('--brand'))
			.toBe('--brand')
		expect(isPropertyValue('red'))
			.toBe(true)
		expect(isPropertyValue(['red', ['blue']]))
			.toBe(true)
		expect(isPropertyValue(['red']))
			.toBe(false)
		expect(isPropertyValue({ color: 'red' }))
			.toBe(false)
	})

	it('appends autocomplete contributions across literal and pattern buckets', () => {
		const config = {
			autocomplete: {
				selectors: new Set<string>(),
				shortcuts: new Set<string>(),
				extraProperties: new Set<string>(),
				extraCssProperties: new Set<string>(),
				properties: new Map<string, string[]>(),
				cssProperties: new Map<string, string[]>(),
				patterns: {
					selectors: new Set<string>(),
					shortcuts: new Set<string>(),
					properties: new Map<string, string[]>(),
					cssProperties: new Map<string, string[]>(),
				},
			},
		}

		const changed = appendAutocomplete(config as any, {
			selectors: ['hover'],
			shortcuts: 'btn',
			extraProperties: '__layer',
			extraCssProperties: '--brand',
			properties: { __layer: ['"utilities"'] },
			cssProperties: { color: ['red'] },
			patterns: {
				selectors: ['screen-$' + '{number}'],
				cssProperties: { color: ['var\\(--.*\\)'] },
			},
		})

		expect(changed)
			.toBe(true)
		expect([...config.autocomplete.selectors])
			.toEqual(['hover'])
		expect(config.autocomplete.cssProperties.get('color'))
			.toEqual(['red'])
		expect(config.autocomplete.patterns.cssProperties.get('color'))
			.toEqual(['var\\(--.*\\)'])
	})

	it('renders nested CSS blocks with formatting', () => {
		const blocks = new Map([
			['.a', {
				properties: [{ property: 'color', value: 'red' }],
				children: new Map([
					['&:hover', { properties: [{ property: 'color', value: 'blue' }] }],
				]),
			}],
		])

		expect(renderCSSStyleBlocks(blocks, true))
			.toBe([
				'.a {',
				'  color: red;',
				'  &:hover {',
				'    color: blue;',
				'  }',
				'}',
			].join('\n'))
	})
})
