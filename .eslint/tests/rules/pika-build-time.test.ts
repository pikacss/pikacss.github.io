import { describe, expect, it } from 'vitest'
import { pikaBuildTimeRule } from '../../rules/pika-build-time'

describe('pika-build-time', () => {
	it('should export a valid ESLint rule', () => {
		expect(pikaBuildTimeRule)
			.toBeDefined()
		expect(pikaBuildTimeRule.meta)
			.toBeDefined()
		expect(pikaBuildTimeRule.meta.type)
			.toBe('problem')
		expect(pikaBuildTimeRule.meta.docs?.description)
			.toBe(
				'Enforce build-time analyzable arguments in pika() calls',
			)
		expect(pikaBuildTimeRule.create)
			.toBeTypeOf('function')
	})

	it('should have correct message IDs', () => {
		expect(pikaBuildTimeRule.meta.messages)
			.toHaveProperty('runtimeArg')
		expect(pikaBuildTimeRule.meta.messages)
			.toHaveProperty('suggestCssVar')
	})

	it('should support suggestions', () => {
		expect(pikaBuildTimeRule.meta.hasSuggestions)
			.toBe(true)
	})
})
