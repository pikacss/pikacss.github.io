import { readFile, readdir } from 'node:fs/promises'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, it } from 'vitest'

const __dirname = dirname(fileURLToPath(import.meta.url))
const examplesDir = resolve(__dirname, '..')
const zhTwExamplesDir = resolve(examplesDir, '..', 'zh-TW', '.examples')

async function findFiles(dir: string): Promise<string[]> {
	const results: string[] = []
	const entries = await readdir(dir, { withFileTypes: true, recursive: true })
	for (const entry of entries) {
		if (entry.isFile()) {
			results.push(join(entry.parentPath, entry.name))
		}
	}
	return results
}

function normalizeFileContent(relPath: string, content: string): string {
	const normalizedLineEndings = content.replace(/\r\n/g, '\n')

	if (relPath.endsWith('.pikaoutput.css'))
		return normalizedLineEndings

	const withoutComments = normalizedLineEndings
		.replace(/<!--[\s\S]*?-->/g, '')
		.replace(/\/\*[\s\S]*?\*\//g, '')
		.replace(/^\s*\/\/.*$/gm, '')
		.replace(/^\s*#.*$/gm, '')

	return withoutComments
		.split('\n')
		.map(line => line.trim())
		.filter(Boolean)
		.join(' ')
		.replace(/\s+/g, ' ')
		.trim()
}

describe('zh-TW example mirror parity', async () => {
	const allEnFiles = (await findFiles(examplesDir))
		.filter(file => !file.includes('__test-utils__'))
	const allZhTwFiles = await findFiles(zhTwExamplesDir)

	const enRelPaths = allEnFiles.map(file => relative(examplesDir, file)).sort()
	const zhRelPaths = allZhTwFiles.map(file => relative(zhTwExamplesDir, file)).sort()
	const zhRelPathSet = new Set(zhRelPaths)
	const enRelPathSet = new Set(enRelPaths)

	it('every English example file has a zh-TW counterpart', ({ expect }) => {
		const missing = enRelPaths.filter(relPath => !zhRelPathSet.has(relPath))
		expect(
			missing,
			`English example files missing zh-TW counterpart:\n${missing.map(path => `  ${path}`).join('\n')}`,
		).toEqual([])
	})

	it('zh-TW example files have no ghost counterparts', ({ expect }) => {
		const ghosts = zhRelPaths.filter(relPath => !enRelPathSet.has(relPath))
		expect(
			ghosts,
			`zh-TW example files without English counterpart:\n${ghosts.map(path => `  ${path}`).join('\n')}`,
		).toEqual([])
	})

	for (const enFile of allEnFiles) {
		const relPath = relative(examplesDir, enFile)
		const zhTwFile = resolve(zhTwExamplesDir, relPath)
		const label = `${relPath} matches zh-TW counterpart structurally`

		it(label, async ({ expect }) => {
			const enContent = await readFile(enFile, 'utf-8')
			const zhTwContent = await readFile(zhTwFile, 'utf-8')

			if (relPath.endsWith('.pikaoutput.css')) {
				expect(zhTwContent).toBe(enContent)
				return
			}

			expect(normalizeFileContent(relPath, zhTwContent)).toBe(normalizeFileContent(relPath, enContent))
		})
	}
})
