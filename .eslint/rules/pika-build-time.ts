import type { TSESTree } from '@typescript-eslint/utils'
import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils'
import * as ts from 'typescript'

const createRule = ESLintUtils.RuleCreator(
	name => `https://docs.pikacss.io/verification/${name}`,
)

export const pikaBuildTimeRule = createRule({
	name: 'pika-build-time',
	meta: {
		type: 'problem',
		docs: {
			description: 'Enforce build-time analyzable arguments in pika() calls',
		},
		messages: {
			runtimeArg: 'pika() argument must be statically analyzable at build time. Found runtime variable: {{ varName }}',
			suggestCssVar: 'Consider using CSS variables: pika({ {{ propName }}: \'var(--{{ varName }})\' })',
		},
		schema: [],
		hasSuggestions: true,
	},
	defaultOptions: [],
	create(context) {
		return {
			CallExpression(node: TSESTree.CallExpression) {
				// Check if this is a pika() call
				if (
					node.callee.type !== AST_NODE_TYPES.Identifier
					|| node.callee.name !== 'pika'
				) {
					return
				}

				// pika() requires at least one argument
				const arg = node.arguments[0]
				if (!arg || arg.type === AST_NODE_TYPES.SpreadElement) {
					return
				}

				// Get TypeScript parser services for type checking
				// Gracefully handle cases where type info is not available (e.g., Vue files without proper parser config)
				let services: ReturnType<typeof ESLintUtils.getParserServices> | null = null
				let checker: ts.TypeChecker | null = null
				try {
					services = ESLintUtils.getParserServices(context)
					checker = services.program.getTypeChecker()
				}
				catch {
					// Type information not available - skip type-based analysis
					// This can happen in Vue files or other non-TS contexts
					return
				}

				// Check if argument is an object expression
				if (arg.type === AST_NODE_TYPES.ObjectExpression) {
					// Traverse each property to check if values are static
					for (const property of arg.properties) {
						if (property.type !== AST_NODE_TYPES.Property)
							continue

						const value = property.value
						// Skip non-expression values
						if (!isExpression(value))
							continue

						// Get the property name for better error messages
						const propName = property.key.type === AST_NODE_TYPES.Identifier
							? property.key.name
							: property.key.type === AST_NODE_TYPES.Literal
								? String(property.key.value)
								: 'property'

						// Check if value is runtime-dynamic (requires type info)
						if (checker && services && isRuntimeDynamic(value, checker, services)) {
							const varName = getVariableName(value)

							context.report({
								node: value,
								messageId: 'runtimeArg',
								data: { varName },
								suggest: [
									{
										messageId: 'suggestCssVar',
										data: { propName, varName },
										fix: (fixer) => {
											return fixer.replaceText(value, `'var(--${varName})'`)
										},
									},
								],
							})
						}
					}
				}
				// If the entire argument is a variable, check if it's static
				else if (checker && services && isRuntimeDynamic(arg, checker, services)) {
					const varName = getVariableName(arg)

					context.report({
						node: arg,
						messageId: 'runtimeArg',
						data: { varName },
					})
				}
			},
		}
	},
})

/**
 * Type guard to check if a node is an expression we can analyze
 */
function isExpression(node: TSESTree.Node): node is TSESTree.Expression {
	return (
		node.type !== AST_NODE_TYPES.SpreadElement
		&& node.type !== AST_NODE_TYPES.AssignmentPattern
		&& node.type !== AST_NODE_TYPES.TSEmptyBodyFunctionExpression
	)
}

/**
 * Check if a node represents a runtime-dynamic value (not statically analyzable)
 */
function isRuntimeDynamic(
	node: TSESTree.Expression,
	checker: ts.TypeChecker,
	services: ReturnType<typeof ESLintUtils.getParserServices>,
): boolean {
	// Literal values are always static
	if (node.type === AST_NODE_TYPES.Literal) {
		return false
	}

	// Template literals with no expressions are static
	if (node.type === AST_NODE_TYPES.TemplateLiteral && node.expressions.length === 0) {
		return false
	}

	// Object/Array expressions need recursive checking (but we handle them separately)
	if (node.type === AST_NODE_TYPES.ObjectExpression || node.type === AST_NODE_TYPES.ArrayExpression) {
		return false
	}

	// Identifiers need type checking
	if (node.type === AST_NODE_TYPES.Identifier) {
		try {
			const tsNode = services.esTreeNodeToTSNodeMap.get(node)
			const type = checker.getTypeAtLocation(tsNode)

			// Check if the type is a literal type (const value)
			if (type.flags & ts.TypeFlags.Literal) {
				return false
			}

			// Check if it's a string/number/boolean literal type
			if (type.flags & (ts.TypeFlags.StringLiteral | ts.TypeFlags.NumberLiteral | ts.TypeFlags.BooleanLiteral)) {
				return false
			}

			// Check if it's an enum member (statically known)
			if (type.flags & ts.TypeFlags.EnumLiteral) {
				return false
			}

			// If type has no literal flags, it's runtime
			return true
		}
		catch {
			// If we can't get type info, assume it's runtime
			return true
		}
	}

	// Member expressions (obj.prop) are typically runtime (e.g., props.color)
	if (node.type === AST_NODE_TYPES.MemberExpression) {
		return true
	}

	// Function calls are runtime
	if (node.type === AST_NODE_TYPES.CallExpression) {
		return true
	}

	// Default: assume runtime-dynamic for safety
	return true
}

/**
 * Extract variable name for error messages
 */
function getVariableName(node: TSESTree.Expression): string {
	if (node.type === AST_NODE_TYPES.Identifier) {
		return node.name
	}

	if (node.type === AST_NODE_TYPES.MemberExpression) {
		if (node.property.type === AST_NODE_TYPES.Identifier) {
			return node.property.name
		}
	}

	return 'variable'
}
