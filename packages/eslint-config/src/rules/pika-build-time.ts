import type { TSESTree } from '@typescript-eslint/utils'
import type { Rule } from 'eslint'

export const pikaBuildTime: Rule.RuleModule = {
	meta: {
		type: 'problem',
		docs: {
			description: 'Enforce static analysis constraints on pika() calls',
			url: 'https://github.com/pikacss/pikacss/blob/main/packages/eslint-config/docs/rules/pika-build-time.md',
		},
		messages: {
			dynamicArgument: 'Argument must be statically evaluable (no variables or expressions).',
		},
		schema: [],
	},
	create(context) {
		const targetCallees = new Set(['pika', 'pikap'])

		function isStatic(node: TSESTree.Node): boolean {
			switch (node.type) {
				case 'Literal':
					return true
				case 'ObjectExpression':
					return node.properties.every((prop) => {
						if (prop.type === 'SpreadElement') {
							return false
						}
						if (prop.computed && !isStatic(prop.key)) {
							return false
						}
						return isStatic(prop.value)
					})
				case 'ArrayExpression':
					return node.elements.every(element => element === null || (element.type !== 'SpreadElement' && isStatic(element)))
				case 'TemplateLiteral':
					return node.expressions.length === 0
				case 'UnaryExpression':
					// Allow negative numbers e.g. -1
					return node.operator === '-' && node.argument.type === 'Literal' && typeof node.argument.value === 'number'
				default:
					return false
			}
		}

		return {
			CallExpression(node: TSESTree.CallExpression) {
				let isTarget = false
				// node.callee is Expression | Super
				if (node.callee.type === 'Identifier' && targetCallees.has(node.callee.name)) {
					isTarget = true
				}
				else if (
					node.callee.type === 'MemberExpression'
					&& node.callee.object.type === 'Identifier'
					&& targetCallees.has(node.callee.object.name)
				) {
					isTarget = true
				}

				if (!isTarget) {
					return
				}

				for (const arg of node.arguments) {
					if (!isStatic(arg)) {
						context.report({
							node: arg as any,
							messageId: 'dynamicArgument',
						})
					}
				}
			},
		} as any
	},
}
