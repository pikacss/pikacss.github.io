import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ESLint } from 'eslint'
import { describe, expect, it } from 'vitest'
import recommended from '../src/configs/recommended'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dummyConfig = join(__dirname, 'fixtures/eslint.config.js')

describe('recommended config', () => {
	it('should validate pika() calls', async () => {
		const eslint = new ESLint({
			baseConfig: recommended,
			overrideConfigFile: dummyConfig,
			overrideConfig: [
				{
					files: ['test.js'],
					languageOptions: {
						ecmaVersion: 2022,
						sourceType: 'module',
					},
				},
			],
		})

		const code = `
            const dynamic = 'red'
            pika({ color: dynamic })
        `

		const results = await eslint.lintText(code, { filePath: 'test.js' })

		expect(results)
			.toHaveLength(1)
		expect(results[0]!.messages)
			.toHaveLength(1)
		expect(results[0]!.messages[0]!.ruleId)
			.toBe('pika/pika-build-time')
	})

	it('should allow valid pika() calls', async () => {
		const eslint = new ESLint({
			baseConfig: recommended,
			overrideConfigFile: dummyConfig,
			overrideConfig: [
				{
					files: ['test.js'],
					languageOptions: {
						ecmaVersion: 2022,
						sourceType: 'module',
					},
				},
			],
		})

		const code = `
            pika({ color: 'red' })
        `

		const results = await eslint.lintText(code, { filePath: 'test.js' })

		expect(results)
			.toHaveLength(1)
		expect(results[0]!.messages)
			.toHaveLength(0)
	})
})
