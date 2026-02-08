import type { TSESTree } from '@typescript-eslint/utils'
import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils'

const createRule = ESLintUtils.RuleCreator(
	name => `https://github.com/pikacss/pikacss/blob/main/packages/eslint-config/docs/rules/${name}.md`,
)

export const pikaBuildTime = createRule({
	name: 'pika-build-time',
	meta: {
		type: 'problem',
		docs: {
			description: 'Enforce static analysis constraints on pika() calls',
		},
		messages: {
			dynamicArgument: 'Argument must be statically evaluable (no variables or expressions).',
		},
		schema: [],
	},
	defaultOptions: [],
	create(context) {
		const targetCallees = new Set(['pika', 'pikap'])

		function isStatic(node: TSESTree.Node): boolean {
			switch (node.type) {
				case AST_NODE_TYPES.Literal:
					return true
				case AST_NODE_TYPES.ObjectExpression:
					return node.properties.every((prop) => {
						if (prop.type === AST_NODE_TYPES.SpreadElement) {
							return false
						}
						if (prop.computed && !isStatic(prop.key)) {
							return false
						}
						return isStatic(prop.value)
					})
				case AST_NODE_TYPES.ArrayExpression:
					return node.elements.every(element => element === null || (element.type !== AST_NODE_TYPES.SpreadElement && isStatic(element)))
				case AST_NODE_TYPES.TemplateLiteral:
					return node.expressions.length === 0
				case AST_NODE_TYPES.UnaryExpression:
					// Allow negative numbers e.g. -1
					return node.operator === '-' && node.argument.type === AST_NODE_TYPES.Literal && typeof node.argument.value === 'number'
				default:
					return false
			}
		}

		return {
			CallExpression(node) {
				let isTarget = false
				if (node.callee.type === AST_NODE_TYPES.Identifier && targetCallees.has(node.callee.name)) {
					isTarget = true
				}
				else if (
					node.callee.type === AST_NODE_TYPES.MemberExpression
					&& node.callee.object.type === AST_NODE_TYPES.Identifier
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
							node: arg,
							messageId: 'dynamicArgument',
						})
					}
				}
			},
		}
	},
})
