import type { EngineConfig } from '@pikacss/core'
import type { TypographyPluginOptions } from '../src'
import { defineEngineConfig } from '@pikacss/core'

import { describe, expectTypeOf, it } from 'vitest'
import { typography } from '../src'

describe('plugin-typography types', () => {
	it('should augment EngineConfig with typography property', () => {
		const config = defineEngineConfig({
			plugins: [typography()],
			typography: {
				variables: {
					'--pk-prose-color-body': '#333',
					'--pk-prose-color-headings': '#111',
				},
			},
		})

		expectTypeOf(config)
			.toHaveProperty('typography')
		expectTypeOf(config.typography)
			.toMatchTypeOf<TypographyPluginOptions | undefined>()
	})

	it('should accept valid CSS variable names from typography variables', () => {
		const config = defineEngineConfig({
			plugins: [typography()],
			typography: {
				variables: {
					'--pk-prose-color-body': '#333',
					'--pk-prose-color-headings': '#111',
					'--pk-prose-color-links': '#2563eb',
				},
			},
		})

		expectTypeOf(config.typography)
			.toMatchTypeOf<TypographyPluginOptions | undefined>()
	})

	it('should work without typography config', () => {
		const config = defineEngineConfig({
			plugins: [typography()],
		})

		expectTypeOf(config)
			.toMatchTypeOf<EngineConfig>()
		expectTypeOf(config.typography)
			.toEqualTypeOf<TypographyPluginOptions | undefined>()
	})

	it('should enforce correct variable value types', () => {
		// @ts-expect-error - numbers not allowed, only strings
		defineEngineConfig({
			plugins: [typography()],
			typography: {
				variables: {
					'--pk-prose-color-body': 123,
				},
			},
		})
	})

	it('should accept all documented prose variables', () => {
		const config = defineEngineConfig({
			plugins: [typography()],
			typography: {
				variables: {
					'--pk-prose-color-body': 'currentColor',
					'--pk-prose-color-headings': 'currentColor',
					'--pk-prose-color-lead': 'currentColor',
					'--pk-prose-color-links': 'currentColor',
					'--pk-prose-color-bold': 'currentColor',
					'--pk-prose-color-counters': 'currentColor',
					'--pk-prose-color-bullets': 'currentColor',
					'--pk-prose-color-hr': 'currentColor',
					'--pk-prose-color-quotes': 'currentColor',
					'--pk-prose-color-quote-borders': 'currentColor',
					'--pk-prose-color-captions': 'currentColor',
					'--pk-prose-color-code': 'currentColor',
					'--pk-prose-color-pre-code': 'currentColor',
					'--pk-prose-color-pre-bg': 'transparent',
					'--pk-prose-color-th-borders': 'currentColor',
					'--pk-prose-color-td-borders': 'currentColor',
					'--pk-prose-color-kbd': 'currentColor',
					'--pk-prose-kbd-shadows': 'currentColor',
				},
			},
		})

		expectTypeOf(config)
			.toHaveProperty('typography')
	})
})
