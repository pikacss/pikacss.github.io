import { defineEngineConfig } from '@pikacss/core'
import { describe, expectTypeOf, it } from 'vitest'
import { icons } from '../src'

describe('plugin-icons types', () => {
	it('should augment EngineConfig with icons property', () => {
		const config = defineEngineConfig({
			plugins: [icons()],
			icons: {
				prefix: 'icon-',
				scale: 1.2,
				mode: 'mask',
			},
		})

		expectTypeOf(config)
			.toHaveProperty('icons')
		expectTypeOf(config.icons)
			.toMatchTypeOf<{
				prefix?: string | string[]
				scale?: number
				mode?: 'auto' | 'mask' | 'bg'
			} | undefined>()
	})

	it('should enforce valid mode values', () => {
		const validConfig = defineEngineConfig({
			plugins: [icons()],
			icons: {
				mode: 'auto' as const, // Valid
			},
		})
		expectTypeOf(validConfig.icons?.mode)
			.toEqualTypeOf<'auto' | undefined>()

		const validMaskConfig = defineEngineConfig({
			plugins: [icons()],
			icons: {
				mode: 'mask' as const, // Valid
			},
		})
		expectTypeOf(validMaskConfig.icons?.mode)
			.toEqualTypeOf<'mask' | undefined>()

		const validBgConfig = defineEngineConfig({
			plugins: [icons()],
			icons: {
				mode: 'bg' as const, // Valid
			},
		})
		expectTypeOf(validBgConfig.icons?.mode)
			.toEqualTypeOf<'bg' | undefined>()
	})

	it('should accept partial configuration', () => {
		// Only prefix
		const config1 = defineEngineConfig({
			plugins: [icons()],
			icons: { prefix: 'i-' },
		})
		expectTypeOf(config1.icons)
			.toMatchTypeOf<{ prefix?: string | string[] } | undefined>()

		// Only scale
		const config2 = defineEngineConfig({
			plugins: [icons()],
			icons: { scale: 1.5 },
		})
		expectTypeOf(config2.icons)
			.toMatchTypeOf<{ scale?: number } | undefined>()

		// Only mode
		const config3 = defineEngineConfig({
			plugins: [icons()],
			icons: { mode: 'bg' },
		})
		expectTypeOf(config3.icons)
			.toMatchTypeOf<{ mode?: 'auto' | 'mask' | 'bg' } | undefined>()

		// Combination
		const config4 = defineEngineConfig({
			plugins: [icons()],
			icons: {
				prefix: 'icon-',
				scale: 1.2,
			},
		})
		expectTypeOf(config4.icons)
			.toMatchTypeOf<{
				prefix?: string | string[]
				scale?: number
			} | undefined>()
	})

	it('should work without icons config', () => {
		const config = defineEngineConfig({
			plugins: [icons()],
		})
		expectTypeOf(config)
			.toMatchTypeOf<{ plugins: any[] }>()
		expectTypeOf(config.icons)
			.toEqualTypeOf<undefined | object>()
	})

	it('should accept string or string array for prefix', () => {
		const config1 = defineEngineConfig({
			plugins: [icons()],
			icons: {
				prefix: 'i-', // Single string
			},
		})
		expectTypeOf(config1.icons?.prefix)
			.toMatchTypeOf<string | string[] | undefined>()

		const config2 = defineEngineConfig({
			plugins: [icons()],
			icons: {
				prefix: ['i-', 'icon-'], // Array of strings
			},
		})
		expectTypeOf(config2.icons?.prefix)
			.toMatchTypeOf<string | string[] | undefined>()
	})

	it('should accept all configuration options', () => {
		const config = defineEngineConfig({
			plugins: [icons()],
			icons: {
				prefix: 'i-',
				scale: 1.2,
				mode: 'auto',
				cdn: 'https://esm.sh/',
				collections: {
					custom: {
						icon: '<svg></svg>',
					},
				},
				autoInstall: false,
				unit: 'em',
				extraProperties: {
					verticalAlign: 'middle',
				},
				autocomplete: ['mdi:home', 'heroicons:user'],
			},
		})

		expectTypeOf(config.icons)
			.toMatchTypeOf<{
				prefix?: string | string[]
				scale?: number
				mode?: 'auto' | 'mask' | 'bg'
				cdn?: string
				collections?: Record<string, any>
				autoInstall?: boolean
				unit?: string
				extraProperties?: Record<string, string>
				autocomplete?: string[]
			} | undefined>()
	})

	it('should accept processor function', () => {
		const config = defineEngineConfig({
			plugins: [icons()],
			icons: {
				processor: (styleItem, meta) => {
					// Custom processing
					expectTypeOf(styleItem)
						.toBeObject()
					expectTypeOf(meta)
						.toMatchTypeOf<{
						collection: string
						name: string
						svg: string
						mode: 'auto' | 'mask' | 'bg'
					}>()
				},
			},
		})

		expectTypeOf(config.icons?.processor)
			.toMatchTypeOf<
      ((styleItem: any, meta: any) => void) | undefined
		>()
	})

	it('should infer correct option types', () => {
		const config = defineEngineConfig({
			plugins: [icons()],
			icons: {
				prefix: 'i-',
				scale: 1.5,
				mode: 'mask',
			},
		})

		if (config.icons) {
			expectTypeOf(config.icons.prefix)
				.toMatchTypeOf<string | string[] | undefined>()
			expectTypeOf(config.icons.scale)
				.toMatchTypeOf<number | undefined>()
			expectTypeOf(config.icons.mode)
				.toMatchTypeOf<'auto' | 'mask' | 'bg' | undefined>()
		}
	})
})
