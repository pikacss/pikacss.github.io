import { describe, expect, it } from 'vitest'
import { pikaPackageBoundariesRule } from '../../rules/pika-package-boundaries'

describe('pika-package-boundaries', () => {
	it('should export a valid ESLint rule', () => {
		expect(pikaPackageBoundariesRule)
			.toBeDefined()
		expect(pikaPackageBoundariesRule.meta)
			.toBeDefined()
		expect(pikaPackageBoundariesRule.meta.type)
			.toBe('problem')
		expect(pikaPackageBoundariesRule.meta.docs?.description)
			.toBe(
				'Enforce monorepo layer boundaries in imports',
			)
		expect(pikaPackageBoundariesRule.create)
			.toBeTypeOf('function')
	})

	it('should have correct message ID', () => {
		expect(pikaPackageBoundariesRule.meta.messages)
			.toHaveProperty('invalidImport')
		expect(pikaPackageBoundariesRule.meta.messages.invalidImport)
			.toContain('layer boundary')
	})

	it('should have layer order in error message', () => {
		const msg = pikaPackageBoundariesRule.meta.messages.invalidImport
		expect(msg)
			.toContain('{{ expectedOrder }}')
	})
})
