import type { EngineConfig } from '@pikacss/core'
import type { ResetStyle } from '../src'
import { defineEngineConfig } from '@pikacss/core'
import { describe, expectTypeOf, it } from 'vitest'
import { reset } from '../src'

describe('plugin-reset types', () => {
	it('should augment EngineConfig with reset property', () => {
		const config = defineEngineConfig({
			plugins: [reset()],
			reset: 'normalize',
		})

		expectTypeOf(config)
			.toHaveProperty('reset')
		expectTypeOf(config.reset)
			.toEqualTypeOf<'modern-normalize' | 'normalize' | 'andy-bell' | 'eric-meyer' | 'the-new-css-reset' | undefined>()
	})

	it('should allow all valid ResetStyle values', () => {
		const validValues: ResetStyle[] = [
			'modern-normalize',
			'normalize',
			'andy-bell',
			'eric-meyer',
			'the-new-css-reset',
		]

		validValues.forEach((value) => {
			expectTypeOf<EngineConfig>({
				plugins: [reset()],
				reset: value,
			})
				.toMatchTypeOf<EngineConfig>()
		})
	})

	it('should work with default config (no reset property)', () => {
		const config = defineEngineConfig({
			plugins: [reset()],
		})

		// Config should still be valid even without reset property
		expectTypeOf(config)
			.toMatchTypeOf<EngineConfig>()
	})
})
