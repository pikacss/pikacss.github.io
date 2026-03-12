import { readdir } from 'node:fs/promises'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, it } from 'vitest'

const __dirname = dirname(fileURLToPath(import.meta.url))
const docsDir = resolve(__dirname, '..', '..')
const zhTwDir = resolve(docsDir, 'zh-TW')

async function findMdFiles(dir: string): Promise<string[]> {
	const results: string[] = []
	const entries = await readdir(dir, { withFileTypes: true, recursive: true })
	for (const entry of entries) {
		if (entry.isFile() && entry.name.endsWith('.md')) {
			results.push(join(entry.parentPath, entry.name))
		}
	}
	return results
}

describe('zh-TW markdown page parity', async () => {
	const allDocsFiles = await findMdFiles(docsDir)
	const enFiles = allDocsFiles.filter(
		f => !f.includes(`${sep}zh-TW${sep}`) && !f.includes(`${sep}.vitepress${sep}`),
	)
	const zhTwFiles = await findMdFiles(zhTwDir).catch(() => [] as string[])

	const enRelPaths = new Set(enFiles.map(f => relative(docsDir, f)))
	const zhTwRelPaths = new Set(zhTwFiles.map(f => relative(zhTwDir, f)))

	it('every English page has a zh-TW counterpart', ({ expect }) => {
		const missing = [...enRelPaths].filter(p => !zhTwRelPaths.has(p))
		expect(
			missing,
			`English pages missing zh-TW counterpart:\n${missing.map(p => `  ${p}`).join('\n')}`,
		).toEqual([])
	})

	it('every zh-TW page has an English counterpart (no ghost pages)', ({ expect }) => {
		const ghosts = [...zhTwRelPaths].filter(p => !enRelPaths.has(p))
		expect(
			ghosts,
			`zh-TW pages without English counterpart:\n${ghosts.map(p => `  ${p}`).join('\n')}`,
		).toEqual([])
	})
})
