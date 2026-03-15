import { describe, expect, it, vi } from 'vitest'
import { keyframes } from './keyframes'

function createMockEngine() {
	const preflights: Array<(engine: any) => unknown> = []
	return {
		appendAutocomplete: vi.fn(),
		notifyPreflightUpdated: vi.fn(),
		addPreflight: vi.fn((preflight: { preflight: (engine: any) => unknown } | ((engine: any) => unknown)) => {
			if (typeof preflight === 'function')
				preflights.push(preflight)
			else
				preflights.push(preflight.preflight)
		}),
		store: { atomicStyles: new Map() },
		config: { preflights: [] as any[] },
		preflights,
	} as any
}

describe('keyframes plugin', () => {
	it('registers keyframes autocomplete and renders used or non-pruned keyframes', () => {
		const plugin = keyframes()
		plugin.rawConfigConfigured?.({
			keyframes: {
				keyframes: [
					['fade', { from: { opacity: '0' }, to: { opacity: '1' } }, ['1s ease-in-out']],
					['spin', { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } }, [], false],
				],
			},
		} as any)

		const engine = createMockEngine()
		plugin.configureEngine?.(engine)
		engine.store.atomicStyles.set('pk-a', {
			id: 'pk-a',
			content: { selector: ['.%'], property: 'animation', value: ['fade 1s linear'] },
		})

		const preflight = engine.preflights[0]
		const result = preflight?.(engine) as Record<string, unknown>

		expect(engine.appendAutocomplete)
			.toHaveBeenCalled()
		expect(result)
			.toMatchObject({
				'@keyframes fade': { from: { opacity: '0' }, to: { opacity: '1' } },
				'@keyframes spin': { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } },
			})
	})

	it('accepts string and object config forms and filters unused pruned keyframes', () => {
		const plugin = keyframes()
		plugin.rawConfigConfigured?.({
			keyframes: {
				pruneUnused: false,
				keyframes: [
					'fade',
					{ name: 'wave', frames: { '50%': { opacity: '0.5' } }, autocomplete: ['2s linear'], pruneUnused: true },
				],
			},
		} as any)

		const engine = createMockEngine()
		plugin.configureEngine?.(engine)
		engine.store.atomicStyles.set('pk-a', {
			id: 'pk-a',
			content: { selector: ['.%'], property: 'animation-name', value: ['fade'] },
		})

		const preflight = engine.preflights[0]
		const result = preflight?.(engine) as Record<string, unknown>

		expect(engine.appendAutocomplete)
			.toHaveBeenCalledWith({
				cssProperties: {
					animationName: 'fade',
					animation: ['fade '],
				},
			})
		expect(engine.appendAutocomplete)
			.toHaveBeenCalledWith({
				cssProperties: {
					animationName: 'wave',
					animation: ['wave ', '2s linear'],
				},
			})
		expect(result)
			.toEqual({})
	})
})
