import { describe, expect, it } from 'vitest'
import { pikaModuleAugmentationRule } from '../../rules/pika-module-augmentation'

describe('pika-module-augmentation', () => {
	it('should be defined', () => {
		expect(pikaModuleAugmentationRule)
			.toBeDefined()
		expect(pikaModuleAugmentationRule.name)
			.toBe('pika-module-augmentation')
		expect(pikaModuleAugmentationRule.meta.type)
			.toBe('problem')
	})

	it('should have correct documentation', () => {
		expect(pikaModuleAugmentationRule.meta.docs?.description)
			.toContain('module augmentation')
		expect(pikaModuleAugmentationRule.meta.docs?.description)
			.toContain('@pikacss/core')
	})

	it('should have missingAugmentation message', () => {
		expect(pikaModuleAugmentationRule.meta.messages.missingAugmentation)
			.toBeDefined()
		expect(pikaModuleAugmentationRule.meta.messages.missingAugmentation)
			.toContain('module augmentation')
	})

	it('should have suggestPattern message', () => {
		expect(pikaModuleAugmentationRule.meta.messages.suggestPattern)
			.toBeDefined()
		expect(pikaModuleAugmentationRule.meta.messages.suggestPattern)
			.toContain('declare module')
	})

	it('should support suggestions', () => {
		expect(pikaModuleAugmentationRule.meta.hasSuggestions)
			.toBe(true)
	})

	it('should have create function', () => {
		expect(typeof pikaModuleAugmentationRule.create)
			.toBe('function')
	})

	describe('rule logic structure', () => {
		it('should return visitor with CallExpression handler', () => {
			const context = {
				sourceCode: {} as any,
				filename: 'test.ts',
				report: vi.fn(),
			} as any

			const visitor = pikaModuleAugmentationRule.create(context)
			expect(visitor.CallExpression)
				.toBeDefined()
			expect(typeof visitor.CallExpression)
				.toBe('function')
		})

		it('should return visitor with TSModuleDeclaration handler', () => {
			const context = {
				sourceCode: {} as any,
				filename: 'test.ts',
				report: vi.fn(),
			} as any

			const visitor = pikaModuleAugmentationRule.create(context)
			expect(visitor.TSModuleDeclaration)
				.toBeDefined()
			expect(typeof visitor.TSModuleDeclaration)
				.toBe('function')
		})

		it('should return visitor with Program:exit handler', () => {
			const context = {
				sourceCode: {} as any,
				filename: 'test.ts',
				report: vi.fn(),
			} as any

			const visitor = pikaModuleAugmentationRule.create(context)
			expect(visitor['Program:exit'])
				.toBeDefined()
			expect(typeof visitor['Program:exit'])
				.toBe('function')
		})
	})

	describe('detection logic', () => {
		it('should detect defineEnginePlugin as plugin indicator', () => {
			const context = {
				sourceCode: {} as any,
				filename: 'test.ts',
				report: vi.fn(),
			} as any

			const visitor = pikaModuleAugmentationRule.create(context)

			// Simulate a defineEnginePlugin call
			const callExpression = visitor.CallExpression
			if (callExpression) {
				callExpression({
					type: 'CallExpression',
					callee: {
						type: 'Identifier',
						name: 'defineEnginePlugin',
					},
				} as any)
			}

			// At program exit, should report if no augmentation found
			const programExit = visitor['Program:exit']
			if (programExit) {
				programExit({ type: 'Program' } as any)
			}

			expect(context.report)
				.toHaveBeenCalledWith(
					expect.objectContaining({
						messageId: 'missingAugmentation',
					}),
				)
		})

		it('should not report when module augmentation is present', () => {
			const context = {
				sourceCode: {} as any,
				filename: 'test.ts',
				report: vi.fn(),
			} as any

			const visitor = pikaModuleAugmentationRule.create(context)

			// Simulate a plugin export
			const callExpression = visitor.CallExpression
			if (callExpression) {
				callExpression({
					type: 'CallExpression',
					callee: {
						type: 'Identifier',
						name: 'defineEnginePlugin',
					},
				} as any)
			}

			// Simulate module augmentation
			const moduleDeclaration = visitor.TSModuleDeclaration
			if (moduleDeclaration) {
				moduleDeclaration({
					type: 'TSModuleDeclaration',
					id: {
						type: 'Literal',
						value: '@pikacss/core',
					},
					declare: true,
				} as any)
			}

			// At program exit, should NOT report
			const programExit = visitor['Program:exit']
			if (programExit) {
				programExit({ type: 'Program' } as any)
			}

			expect(context.report).not.toHaveBeenCalled()
		})

		it('should not report for non-plugin files', () => {
			const context = {
				sourceCode: {} as any,
				filename: 'test.ts',
				report: vi.fn(),
			} as any

			const visitor = pikaModuleAugmentationRule.create(context)

			// No defineEnginePlugin call
			// Just a regular function call
			const callExpression = visitor.CallExpression
			if (callExpression) {
				callExpression({
					type: 'CallExpression',
					callee: {
						type: 'Identifier',
						name: 'regularFunction',
					},
				} as any)
			}

			const programExit = visitor['Program:exit']
			if (programExit) {
				programExit({ type: 'Program' } as any)
			}

			// Should NOT report because there's no plugin export
			expect(context.report).not.toHaveBeenCalled()
		})
	})
})
