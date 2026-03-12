import { readFile, readdir } from 'node:fs/promises'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, it } from 'vitest'

const __dirname = dirname(fileURLToPath(import.meta.url))
const examplesDir = resolve(__dirname, '..')
const zhTwExamplesDir = resolve(examplesDir, '..', 'zh-TW', '.examples')

async function findCssFiles(dir: string, pattern: RegExp): Promise<string[]> {
	const results: string[] = []
	const entries = await readdir(dir, { withFileTypes: true, recursive: true })
	for (const entry of entries) {
		if (entry.isFile() && pattern.test(entry.name)) {
			results.push(join(entry.parentPath, entry.name))
		}
	}
	return results
}

describe('zh-TW output.css sync', async () => {
	const allEnFiles = await findCssFiles(examplesDir, /-(output|generated)\.css$/)

	for (const enFile of allEnFiles) {
		const relPath = relative(examplesDir, enFile)
		const zhTwFile = resolve(zhTwExamplesDir, relPath)
		const label = `${relPath} matches zh-TW counterpart`

		it(label, async ({ expect }) => {
			const enContent = await readFile(enFile, 'utf-8')
			const zhTwContent = await readFile(zhTwFile, 'utf-8').catch(() => null)

			if (zhTwContent === null) {
				// zh-TW file doesn't exist — skip (not all examples may have zh-TW versions)
				return
			}

			expect(zhTwContent).toBe(enContent)
		})
	}
})
