import { describe, expect, it } from 'vitest'
import { buildFnNamePatterns, getCalleeName } from './fn-names'

describe('fn-names helpers', () => {
	it('builds normal and preview function name variants', () => {
		const patterns = buildFnNamePatterns('atom')

		expect(patterns.fnName)
			.toBe('atom')
		expect(patterns.previewFnName)
			.toBe('atomp')
		expect([...patterns.normalNames])
			.toEqual(['atom', 'atom.str', 'atom.arr'])
		expect([...patterns.previewNames])
			.toEqual(['atomp', 'atomp.str', 'atomp.arr'])
		expect(patterns.allNames.has('atom.str'))
			.toBe(true)
		expect(patterns.allNames.has('atomp.arr'))
			.toBe(true)
	})

	it('extracts callee names from supported call expression shapes', () => {
		expect(getCalleeName({
			type: 'CallExpression',
			callee: { type: 'Identifier', name: 'pika' },
		}))
			.toBe('pika')

		expect(getCalleeName({
			type: 'CallExpression',
			callee: {
				type: 'MemberExpression',
				computed: false,
				object: { type: 'Identifier', name: 'pika' },
				property: { type: 'Identifier', name: 'str' },
			},
		}))
			.toBe('pika.str')

		expect(getCalleeName({
			type: 'CallExpression',
			callee: {
				type: 'MemberExpression',
				computed: true,
				object: { type: 'Identifier', name: 'pika' },
				property: { type: 'Literal', value: 'arr' },
			},
		}))
			.toBe('pika.arr')

		expect(getCalleeName({
			type: 'CallExpression',
			callee: {
				type: 'MemberExpression',
				computed: true,
				object: { type: 'Identifier', name: 'pika' },
				property: {
					type: 'TemplateLiteral',
					quasis: [{ value: { cooked: 'str' } }],
					expressions: [],
				},
			},
		}))
			.toBe('pika.str')

		expect(getCalleeName({
			type: 'CallExpression',
			callee: {
				type: 'MemberExpression',
				computed: true,
				object: { type: 'CallExpression' },
				property: { type: 'Literal', value: 'str' },
			},
		}))
			.toBeNull()
	})
})
