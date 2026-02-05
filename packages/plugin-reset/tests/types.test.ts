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

	it('should reject invalid reset values', () => {
		expectTypeOf({
			plugins: [reset()],
			// @ts-expect-error - invalid value
			reset: 'invalid-reset',
		}).not.toMatchTypeOf(defineEngineConfig)
	})

	it('should work with default config (no reset property)', () => {
		const config = defineEngineConfig({
			plugins: [reset()],
		})
		expectTypeOf(config)
			.toMatchTypeOf<{ plugins: any[] }>()
	})
})
