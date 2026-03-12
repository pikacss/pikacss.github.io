import { readFile, readdir } from 'node:fs/promises'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, it } from 'vitest'

const __dirname = dirname(fileURLToPath(import.meta.url))
const docsDir = resolve(__dirname, '..', '..')

async function findAllMdFiles(dir: string): Promise<string[]> {
	const results: string[] = []
	const entries = await readdir(dir, { withFileTypes: true, recursive: true })
	for (const entry of entries) {
		if (entry.isFile() && entry.name.endsWith('.md')) {
			results.push(join(entry.parentPath, entry.name))
		}
	}
	return results
}

function extractFrontmatter(content: string): string | null {
	const match = /^---\r?\n([\s\S]*?)\n---/.exec(content)
	return match ? (match[1] ?? null) : null
}

describe('markdown pages have description in frontmatter', async () => {
	const allFiles = await findAllMdFiles(docsDir)
	const mdFiles = allFiles.filter(f => !f.includes(`${sep}.vitepress${sep}`))

	for (const file of mdFiles) {
		const relPath = relative(docsDir, file)
		it(relPath, async ({ expect }) => {
			const content = await readFile(file, 'utf-8')
			const frontmatter = extractFrontmatter(content)

			if (frontmatter && /^validation:\s*skip/m.test(frontmatter))
				return

			expect(frontmatter, `${relPath} has no frontmatter block`).not.toBeNull()
			expect(
				/^description:\s*\S/m.test(frontmatter ?? ''),
				`${relPath} is missing a non-empty description in frontmatter`,
			).toBe(true)
		})
	}
})

describe('markdown pages have a ## Next section', async () => {
	const allFiles = await findAllMdFiles(docsDir)
	const mdFiles = allFiles.filter(f => !f.includes(`${sep}.vitepress${sep}`))

	for (const file of mdFiles) {
		const relPath = relative(docsDir, file)
		it(relPath, async ({ expect }) => {
			const content = await readFile(file, 'utf-8')
			const frontmatter = extractFrontmatter(content)

			if (frontmatter && /^validation:\s*skip/m.test(frontmatter))
				return

			expect(
				/^## Next/m.test(content),
				`${relPath} is missing a ## Next section`,
			).toBe(true)
		})
	}
})
