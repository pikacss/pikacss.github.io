import { readFile, readdir } from 'node:fs/promises'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, it } from 'vitest'

const __dirname = dirname(fileURLToPath(import.meta.url))
const examplesDir = resolve(__dirname, '..')

async function findFiles(dir: string, pattern: RegExp): Promise<string[]> {
	const results: string[] = []
	const entries = await readdir(dir, { withFileTypes: true, recursive: true })
	for (const entry of entries) {
		if (entry.isFile() && pattern.test(entry.name)) {
			results.push(join(entry.parentPath, entry.name))
		}
	}
	return results
}

describe('shell script examples', async () => {
	const shFiles = await findFiles(examplesDir, /\.sh$/)
	const validCommands = /\b(pnpm|npm|yarn|bun|npx|bunx)\b/

	for (const file of shFiles) {
		const relPath = relative(examplesDir, file)
		it(`${relPath} contains valid package manager commands`, async ({ expect }) => {
			const content = await readFile(file, 'utf-8')
			expect(content.trim().length).toBeGreaterThan(0)
			expect(content).toMatch(validCommands)
		})
	}
})
