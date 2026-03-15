import { describe, expect, it } from 'vitest'
import { getPropertyEffects, hasPropertyEffectOverlap } from './property-effects'

describe('property-effects', () => {
	it('resolves universal, custom, vendor-prefixed, and shorthand effects', () => {
		expect(getPropertyEffects('all'))
			.toEqual(['*'])
		expect(getPropertyEffects('--brand'))
			.toEqual(['--brand'])
		expect(getPropertyEffects('-webkit-line-clamp'))
			.toEqual(['-webkit-line-clamp'])
		expect(getPropertyEffects('margin'))
			.toContain('margin-top')
	})

	it('detects overlap for related properties and avoids custom property collisions', () => {
		expect(hasPropertyEffectOverlap('margin', 'margin-left'))
			.toBe(true)
		expect(hasPropertyEffectOverlap('all', 'opacity'))
			.toBe(true)
		expect(hasPropertyEffectOverlap('--brand', '--brand'))
			.toBe(true)
		expect(hasPropertyEffectOverlap('--brand', '--accent'))
			.toBe(false)
		expect(hasPropertyEffectOverlap('color', 'margin'))
			.toBe(false)
	})
})
