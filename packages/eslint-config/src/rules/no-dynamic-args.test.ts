import { Linter } from 'eslint'
import { describe, expect, it, vi } from 'vitest'
import vueParser from 'vue-eslint-parser'
import rule from './no-dynamic-args'

function verify(
	code: string,
	options: string | {
		fnName?: string
		languageOptions?: Record<string, unknown>
		filename?: string
	} = 'pika',
) {
	const normalized = typeof options === 'string'
		? { fnName: options }
		: options
	const {
		fnName = 'pika',
		languageOptions = {},
		filename,
	} = normalized
	const linter = new Linter()
	return linter.verify(
		code,
		{
			plugins: {
				pikacss: {
					rules: {
						'no-dynamic-args': rule,
					},
				},
			},
			rules: {
				'pikacss/no-dynamic-args': ['error', { fnName }],
			},
			languageOptions: {
				ecmaVersion: 2022,
				sourceType: 'module',
				...languageOptions,
			},
		},
		filename,
	)
}

function verifyVue(code: string, fnName = 'pika') {
	const linter = new Linter()
	return linter.verify(
		code,
		[
			{
				files: ['**/*.vue'],
				plugins: {
					pikacss: {
						rules: {
							'no-dynamic-args': rule,
						},
					},
				},
				rules: {
					'pikacss/no-dynamic-args': ['error', { fnName }],
				},
				languageOptions: {
					parser: vueParser,
					ecmaVersion: 2022,
					sourceType: 'module',
				},
			},
		],
		'Component.vue',
	)
}

describe('no-dynamic-args rule', () => {
	it('accepts static literals, arrays, objects, spreads, and unary expressions', () => {
		const messages = verify(`
			pika('a', { color: 'red', nested: { margin: ['1rem', ...['2rem']] } }, [-1, +2, , 'x'])
			pika.str({ ['color']: 'blue' })
			pikap.arr({ ...{ color: 'red' } })
		`)

		expect(messages)
			.toEqual([])
	})

	it('reports dynamic top-level arguments, properties, spreads, and computed keys', () => {
		const messages = verify([
			'const color = \'red\'',
			'const extra = { color: \'red\' }',
			'const key = \'tone\'',
			'pika(color)',
			'pika({ color })',
			'pika({ ...extra })',
			'pika({ [key]: \'red\' })',
			'pika(',
			'template`$' + '{color}`,',
			'condition ? \'a\' : \'b\',',
			')',
		].join('\n'))

		expect(messages.map(message => message.messageId))
			.toEqual([
				'noDynamicArg',
				'noDynamicProperty',
				'noDynamicSpread',
				'noDynamicComputedKey',
				'noDynamicArg',
				'noDynamicArg',
			])
		expect(messages[0]?.message)
			.toContain('Variable reference')
		expect(messages[4]?.message)
			.toContain('Tagged template expressions')
		expect(messages[5]?.message)
			.toContain('Conditional expressions')
	})

	it('reports dynamic top-level spread arguments', () => {
		const messages = verify([
			'const extra = [\'red\']',
			'pika(...extra)',
		].join('\n'))

		expect(messages)
			.toHaveLength(1)
		expect(messages[0]?.messageId)
			.toBe('noDynamicSpread')
		expect(messages[0]?.message)
			.toContain('Spread of dynamic value')
	})

	it('reports specialized reasons for remaining dynamic expression kinds', () => {
		const messages = verify([
			'async function loadStyle() {',
			'  return "loaded"',
			'}',
			'function* iterateStyle(value) {',
			'  pika(yield value)',
			'}',
			'let assigned = "before"',
			'let first = "alpha"',
			'let second = "beta"',
			'pika(new URL("https://example.com"))',
			'async function run() {',
			'  pika(await loadStyle())',
			'}',
			'pika((assigned = "after"))',
			'pika((first, second))',
			'pika(class {})',
		].join('\n'))

		expect(messages)
			.toHaveLength(6)
		const messageText = messages.map(message => message.message)
		expect(messageText)
			.toEqual(expect.arrayContaining([
				expect.stringContaining('New expressions are not statically analyzable'),
				expect.stringContaining('Yield expressions are not statically analyzable'),
				expect.stringContaining('Await expressions are not statically analyzable'),
				expect.stringContaining('Assignment expressions are not statically analyzable'),
				expect.stringContaining('Sequence expressions are not statically analyzable'),
				expect.stringContaining('This expression is not statically analyzable'),
			]))
	})

	it('reports binary, logical, member, and call expression reasons', () => {
		const messages = verify([
			'const base = "red"',
			'const nested = { tone: "soft" }',
			'function buildTone() {',
			'  return "blue"',
			'}',
			'pika(base + "-500")',
			'pika(base || "fallback")',
			'pika(nested.tone)',
			'pika(buildTone())',
		].join('\n'))

		expect(messages)
			.toHaveLength(4)
		const messageText = messages.map(message => message.message)
		expect(messageText)
			.toEqual(expect.arrayContaining([
				expect.stringContaining('\'+\' expressions are not statically analyzable'),
				expect.stringContaining('\'||\' expressions are not statically analyzable'),
				expect.stringContaining('Member expressions are not statically analyzable'),
				expect.stringContaining('Function calls are not statically analyzable'),
			]))
	})

	it('respects custom function names and ignores unrelated callees', () => {
		const messages = verify(`
			atom({ color: dynamicValue })
			other({ color: dynamicValue })
		`, 'atom')

		expect(messages)
			.toHaveLength(1)
		expect(messages[0]?.message)
			.toContain('atom()')
	})

	it('registers the vue template visitor when parser services expose it', () => {
		const defineTemplateBodyVisitor = (templateVisitor: object, scriptVisitor: object) => ({
			templateVisitor,
			scriptVisitor,
		})
		const context = {
			options: [],
			report: () => {},
			sourceCode: {
				parserServices: {
					defineTemplateBodyVisitor,
				},
			},
		} as any

		const visitors = rule.create(context) as unknown as {
			templateVisitor: Record<string, unknown>
			scriptVisitor: Record<string, unknown>
		}

		expect(visitors.templateVisitor)
			.toHaveProperty('CallExpression')
		expect(visitors.scriptVisitor)
			.toHaveProperty('CallExpression')
	})

	it('uses vue-eslint-parser services to register template visitors', () => {
		const parsed = vueParser.parseForESLint('<template><div :class="pika(color)" /></template>', {
			ecmaVersion: 2022,
			sourceType: 'module',
		})
		const parserServices = parsed.services as {
			defineTemplateBodyVisitor: (templateVisitor: object, scriptVisitor: object) => unknown
		}
		const defineTemplateBodyVisitorSpy = vi.spyOn(parserServices, 'defineTemplateBodyVisitor')
		const context = {
			options: [],
			report: () => {},
			sourceCode: {
				parserServices,
			},
		} as any

		rule.create(context)

		expect(defineTemplateBodyVisitorSpy)
			.toHaveBeenCalledWith(
				expect.objectContaining({ CallExpression: expect.any(Function) }),
				expect.objectContaining({ CallExpression: expect.any(Function) }),
			)
	})

	it('reports template call violations with parser-backed vue ast nodes', () => {
		const parsed = vueParser.parseForESLint('<template><div :class="pika(color)" /></template>', {
			ecmaVersion: 2022,
			sourceType: 'module',
		})
		interface TemplateVisitor { CallExpression: (node: unknown) => void }
		let templateVisitor: TemplateVisitor | null = null
		const report = vi.fn()
		const context = {
			options: [],
			report,
			sourceCode: {
				parserServices: {
					defineTemplateBodyVisitor: (visitor: TemplateVisitor, scriptVisitor: object) => {
						templateVisitor = visitor
						return { visitor, scriptVisitor }
					},
				},
			},
		} as any

		rule.create(context)

		const templateBody = parsed.ast.templateBody as any
		const callExpression = templateBody.children[0].startTag.attributes[0].value.expression
		expect(templateVisitor)
			.toBeDefined()
		templateVisitor!.CallExpression(callExpression)

		expect(report)
			.toHaveBeenCalledWith(expect.objectContaining({
				messageId: 'noDynamicArg',
				node: callExpression.arguments[0],
				data: expect.objectContaining({
					fnName: 'pika',
					reason: expect.stringContaining('Variable reference'),
				}),
			}))
	})

	it('reports violations when linting a real vue file through eslint', () => {
		const messages = verifyVue(
			'<template><div :class="pika(color)" /></template>\n<script setup>const color = "red"</script>',
		)

		expect(messages)
			.toHaveLength(1)
		expect(messages[0])
			.toMatchObject({
				ruleId: 'pikacss/no-dynamic-args',
				severity: 2,
			})
		expect(messages[0]?.message)
			.toContain('Variable reference')
	})

	it('reports object property, spread, and computed key violations in real vue files', () => {
		const messages = verifyVue([
			'<template><div :class="pika({ color, ...extra, [key]: \'red\' })" /></template>',
			'<script setup>',
			'const color = "red"',
			'const extra = { color: "blue" }',
			'const key = "tone"',
			'</script>',
		].join('\n'))

		expect(messages.map(message => message.messageId))
			.toEqual([
				'noDynamicProperty',
				'noDynamicSpread',
				'noDynamicComputedKey',
			])
		expect(messages[0]?.message)
			.toContain('Variable reference')
		expect(messages[1]?.message)
			.toContain('Spread of dynamic value')
		expect(messages[2]?.message)
			.toContain('Computed property key')
	})

	it('reports array element and spread violations in real vue files', () => {
		const messages = verifyVue([
			'<template><div :class="pika([color, ...extra, { tone: nested }])" /></template>',
			'<script setup>',
			'const color = "red"',
			'const extra = ["blue"]',
			'const nested = "soft"',
			'</script>',
		].join('\n'))

		expect(messages.map(message => message.messageId))
			.toEqual([
				'noDynamicArg',
				'noDynamicSpread',
				'noDynamicProperty',
			])
		expect(messages[0]?.message)
			.toContain('Variable reference')
		expect(messages[1]?.message)
			.toContain('Spread of dynamic value')
		expect(messages[2]?.message)
			.toContain('Variable reference')
	})
})
