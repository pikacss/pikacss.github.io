import { readFile, readdir, stat } from 'node:fs/promises'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, it } from 'vitest'

const __dirname = dirname(fileURLToPath(import.meta.url))
const examplesDir = resolve(__dirname, '..')

async function findAllFiles(dir: string): Promise<string[]> {
	const results: string[] = []
	const entries = await readdir(dir, { withFileTypes: true, recursive: true })
	for (const entry of entries) {
		if (entry.isFile()) {
			results.push(join(entry.parentPath, entry.name))
		}
	}
	return results
}

describe('all example files have non-empty content', async () => {
	const allFiles = await findAllFiles(examplesDir)
	const nonTestFiles = allFiles.filter(f =>
		!f.includes('__test-utils__')
		&& !f.includes('/zh-TW/')
		&& !f.endsWith('.test.ts'),
	)

	for (const file of nonTestFiles) {
		const relPath = relative(examplesDir, file)
		it(`${relPath} has non-empty content`, async ({ expect }) => {
			const st = await stat(file)
			if (file.endsWith('.pikaoutput.css')) {
				expect(st.size).toBeGreaterThanOrEqual(0)
				return
			}
			expect(st.size).toBeGreaterThan(0)
		})
	}
})

describe('every pika() usage file has a corresponding test', async () => {
	const allFiles = await findAllFiles(examplesDir)
	const nonTestFiles = allFiles.filter(f =>
		!f.includes('__test-utils__')
		&& !f.includes('/zh-TW/')
		&& !f.endsWith('.test.ts'),
	)

	const testFiles = allFiles.filter(f =>
		f.endsWith('.test.ts')
		&& !f.includes('__test-utils__'),
	)

	const pikaPattern = /\bpika\s*\(|pika\.\w+\s*\(/
	const pikaFiles: string[] = []

	for (const file of nonTestFiles) {
		if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.vue')) {
			const content = await readFile(file, 'utf-8')
			if (pikaPattern.test(content)) {
				pikaFiles.push(file)
			}
		}
	}

	for (const pikaFile of pikaFiles) {
		const relPath = relative(examplesDir, pikaFile)
		it(`${relPath} has a corresponding test`, ({ expect }) => {
			const dir = dirname(pikaFile)
			const dirTestFiles = testFiles.filter(t => dirname(t) === dir)
			expect(
				dirTestFiles.length,
				`No test files found in directory for ${relPath}`,
			).toBeGreaterThan(0)
		})
	}
})
