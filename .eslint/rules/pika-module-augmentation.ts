import type { TSESTree } from '@typescript-eslint/utils'
import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils'

const createRule = ESLintUtils.RuleCreator(
	name => `https://docs.pikacss.io/verification/${name}`,
)

export const pikaModuleAugmentationRule = createRule({
	name: 'pika-module-augmentation',
	meta: {
		type: 'problem',
		docs: {
			description: 'Ensure plugin examples include TypeScript module augmentation for @pikacss/core',
		},
		messages: {
			missingAugmentation: 'Plugin exports configuration but missing TypeScript module augmentation for \'@pikacss/core\'. Users will not get type completions.',
			suggestPattern: 'Add: declare module \'@pikacss/core\' { interface EngineConfig { yourOption?: YourType } }',
		},
		schema: [],
		hasSuggestions: true,
	},
	defaultOptions: [],
	create(context) {
		let hasPluginExport = false
		let hasModuleAugmentation = false

		return {
			// Check for plugin exports (defineEnginePlugin calls)
			CallExpression(node: TSESTree.CallExpression) {
				if (
					node.callee.type === AST_NODE_TYPES.Identifier
					&& node.callee.name === 'defineEnginePlugin'
				) {
					hasPluginExport = true
				}
			},

			// Check for TypeScript module augmentation
			TSModuleDeclaration(node: TSESTree.TSModuleDeclaration) {
				// Check if this is augmenting '@pikacss/core'
				if (
					node.id.type === AST_NODE_TYPES.Literal
					&& node.id.value === '@pikacss/core'
					&& node.declare === true
				) {
					hasModuleAugmentation = true
				}
			},

			// At the end of the file, check if plugin export exists without augmentation
			'Program:exit': function (node: TSESTree.Program) {
				if (hasPluginExport && !hasModuleAugmentation) {
					context.report({
						node,
						messageId: 'missingAugmentation',
						suggest: [
							{
								messageId: 'suggestPattern',
								fix: (fixer) => {
									// Add augmentation at the top of the file
									const augmentation = `declare module '@pikacss/core' {\n  interface EngineConfig {\n    // Add your plugin options here\n  }\n}\n\n`
									return fixer.insertTextBefore(node, augmentation)
								},
							},
						],
					})
				}
			},
		}
	},
})
