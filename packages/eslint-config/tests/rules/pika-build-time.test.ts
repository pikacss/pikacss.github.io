import { RuleTester } from '@typescript-eslint/rule-tester'
import { afterAll, describe, it } from 'vitest'
import { pikaBuildTime } from '../../src/rules/pika-build-time'

RuleTester.afterAll = afterAll
RuleTester.describe = describe
RuleTester.it = it

const ruleTester = new RuleTester({
	languageOptions: {
		parserOptions: {
			ecmaVersion: 2020,
			sourceType: 'module',
		},
	},
})

ruleTester.run('pika-build-time', pikaBuildTime as any, {
	valid: [
		'pika({ color: \'red\' })',
		'pika.str(\'foo\')',
		'pika([\'a\', \'b\'])',
		'pika({ nested: { val: 1 } })',
		'pika(`val-static`)',
		'pika(-1)',
		'otherCall(someVar)',
	],
	invalid: [
		{
			code: 'pika(someVar)',
			errors: [{ messageId: 'dynamicArgument' }],
		},
		{
			code: 'pika({ color: someVar })',
			errors: [{ messageId: 'dynamicArgument' }],
		},
		{
			code: 'pika(\'a\' + \'b\')',
			errors: [{ messageId: 'dynamicArgument' }],
		},
		{
			// eslint-disable-next-line no-template-curly-in-string
			code: 'pika(`val-${x}`)',
			errors: [{ messageId: 'dynamicArgument' }],
		},
		{
			code: 'pika(condition ? \'a\' : \'b\')',
			errors: [{ messageId: 'dynamicArgument' }],
		},
		{
			code: 'pika(...items)',
			errors: [{ messageId: 'dynamicArgument' }],
		},
		{
			code: 'pika({ ...obj })',
			errors: [{ messageId: 'dynamicArgument' }],
		},
		{
			code: 'pika.str(someVar)',
			errors: [{ messageId: 'dynamicArgument' }],
		},
	],
})
