/* eslint-disable no-cond-assign */
/**
 * check-docs-examples.ts
 *
 * Scans all English docs markdown files for <<< snippet imports and reports
 * which referenced example files in docs/.examples/ do not have a
 * corresponding test file.
 *
 * Usage:
 *   tsx ./scripts/check-docs-examples.ts
 *   tsx ./scripts/check-docs-examples.ts --verbose
 *   tsx ./scripts/check-docs-examples.ts --clean    # delete orphaned files
 */

import { access, readdir, readFile, rm } from 'node:fs/promises'
import { basename, dirname, extname, join, relative, resolve, sep } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')
const docsDir = resolve(rootDir, 'docs')
const examplesDir = resolve(docsDir, '.examples')

const verbose = process.argv.includes('--verbose')
const shouldClean = process.argv.includes('--clean')

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function findFiles(
	dir: string,
	filter?: (name: string, fullPath: string) => boolean,
): Promise<string[]> {
	const results: string[] = []
	const entries = await readdir(dir, { withFileTypes: true, recursive: true })
	for (const entry of entries) {
		if (entry.isFile()) {
			const fullPath = join(entry.parentPath, entry.name)
			if (!filter || filter(entry.name, fullPath)) {
				results.push(fullPath)
			}
		}
	}
	return results
}

async function fileExists(p: string): Promise<boolean> {
	return access(p)
		.then(() => true, () => false)
}

/**
 * Extracts all <<< @/.examples/path/to/file [optional-region] references from
 * a markdown file's content. Returns paths relative to docs/.examples/.
 */
function extractExampleRefs(content: string): string[] {
	const refs: string[] = []
	// VitePress snippet syntax: <<< @/.examples/relative/path.ext [region]
	const pattern = /<<<\s+@\/\.examples\/([^\s[\]]+)/g
	let m: RegExpExecArray | null
	while ((m = pattern.exec(content)) !== null) {
		refs.push(m[1]!)
	}
	return refs
}

/**
 * Extracts all <<< @/zh-TW/.examples/... references from a zh-TW markdown
 * file's content. Returns paths relative to docs/zh-TW/.examples/.
 */
function extractZhTWExampleRefs(content: string): string[] {
	const refs: string[] = []
	const pattern = /<<<\s+@\/zh-TW\/\.examples\/([^\s[\]]+)/g
	let m: RegExpExecArray | null
	while ((m = pattern.exec(content)) !== null) {
		refs.push(m[1]!)
	}
	return refs
}

// ---------------------------------------------------------------------------
// Category definitions — single source of truth for ids, labels, and ordering
// ---------------------------------------------------------------------------

const CATEGORY_DEFS = [
	{ id: 'css-output', label: 'CSS output files', mustHaveTests: true },
	{ id: 'source', label: 'Source files with pika() usage', mustHaveTests: true },
	{ id: 'css-plain', label: 'Plain CSS files', mustHaveTests: false },
	{ id: 'config-or-type', label: 'Config / type / helper files', mustHaveTests: false },
	{ id: 'shell-script', label: 'Shell scripts', mustHaveTests: false },
	{ id: 'html', label: 'HTML files', mustHaveTests: false },
	{ id: 'config-file', label: 'Config / dotfiles', mustHaveTests: false },
	{ id: 'text', label: 'Text files', mustHaveTests: false },
	{ id: 'other', label: 'Other', mustHaveTests: false },
] as const satisfies { id: string, label: string, mustHaveTests: boolean }[]

type CategoryId = typeof CATEGORY_DEFS[number]['id']

const CATEGORY_ORDER: readonly CategoryId[] = CATEGORY_DEFS.map(c => c.id)
const CATEGORY_LABEL: Record<CategoryId, string> = Object.fromEntries(
	CATEGORY_DEFS.map(c => [
		c.id,
		c.mustHaveTests ? `${c.label} (must have tests)` : c.label,
	]),
) as Record<CategoryId, string>

// Classification rules derived from CATEGORY_DEFS ids
const SOURCE_EXTS = new Set(['.ts', '.tsx', '.vue', '.js', '.mjs'])
const CONFIG_OR_TYPE_INCLUDES = ['-config', '-interface', '-helper', '-define-', '-type']
const CONFIG_OR_TYPE_SUFFIXES = ['-types.ts']
const CONFIG_OR_TYPE_PREFIXES = ['auto-created-']

/** Classifies an example file into one of the CATEGORY_DEFS ids. */
function classify(ref: string): CategoryId {
	const name = basename(ref)
	const ext = extname(name)
		.toLowerCase()

	if (ext === '.sh')
		return 'shell-script'
	if (ext === '.html')
		return 'html'
	if (ext === '.gitignore' || name === '.gitignore')
		return 'config-file'
	if (ext === '.css') {
		return (name.includes('-output') || name.includes('-generated'))
			? 'css-output'
			: 'css-plain'
	}
	if (ext === '.txt')
		return 'text'
	if (SOURCE_EXTS.has(ext)) {
		const isConfigOrType
			= CONFIG_OR_TYPE_INCLUDES.some(s => name.includes(s))
				|| CONFIG_OR_TYPE_SUFFIXES.some(s => name.endsWith(s))
				|| CONFIG_OR_TYPE_PREFIXES.some(s => name.startsWith(s))
		return isConfigOrType ? 'config-or-type' : 'source'
	}
	return 'other'
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
	// 1. Collect all English .md files (exclude zh-TW/)
	const mdFiles = await findFiles(
		docsDir,
		(name, fullPath) =>
			name.endsWith('.md') && !fullPath.includes(`${sep}zh-TW${sep}`),
	)

	// 2. Collect all test files in docs/.examples/
	const testFiles = await findFiles(
		examplesDir,
		name => name.endsWith('.test.ts'),
	)

	// 3. Read content of every test file to detect which example files are used
	const testContents = new Map<string, string>()
	await Promise.all(
		testFiles.map(async (tf) => {
			testContents.set(tf, await readFile(tf, 'utf-8'))
		}),
	)

	// 4. Build a quick lookup: for each directory, set of filenames mentioned in
	//    test files inside that directory (so we can check at O(1) per ref)
	//    Key: directory abs path — Value: Set of mentioned filenames
	const testedByDir = new Map<string, Set<string>>()
	for (const [testFile, content] of testContents) {
		const dir = dirname(testFile)
		if (!testedByDir.has(dir))
			testedByDir.set(dir, new Set())
		const mentioned = testedByDir.get(dir)!

		// Collect all filenames/stems referenced via import or URL strings
		// e.g. './shortcuts-usage-string-arg.ts'  or  import config from './shortcuts-config'
		const fileRef = /['"` /]([^'"` /\n]+\.[a-z]+)['"` ,)]/g
		let m: RegExpExecArray | null
		while ((m = fileRef.exec(content)) !== null) {
			mentioned.add(m[1]!)
		}
	}

	// 5. Parse every markdown file and collect refs
	interface RefInfo {
		/** Path relative to docs/.examples/ */
		ref: string
		/** Markdown file (absolute) where it appears */
		mdFile: string
		hasTest: boolean
		fileExists: boolean
		kind: CategoryId
	}

	const allRefInfos: RefInfo[] = []
	const seenRefs = new Set<string>()

	for (const mdFile of mdFiles) {
		const content = await readFile(mdFile, 'utf-8')
		const refs = extractExampleRefs(content)
		for (const ref of refs) {
			const absPath = resolve(examplesDir, ref)
			const dir = dirname(absPath)
			const name = basename(absPath)
			const stem = basename(absPath, extname(absPath))
			const kind = classify(ref)

			// Determine if a test covers this file
			let hasTest = false

			// 5a. Direct test file with same stem: foo.css -> foo.test.ts
			const directTest = resolve(dir, `${stem}.test.ts`)
			if (await fileExists(directTest)) {
				hasTest = true
			}

			// 5b. Any test in same directory references this file by name or stem
			if (!hasTest) {
				const mentioned = testedByDir.get(dir)
				if (mentioned) {
					// Check for exact filename match or ./ prefixed name
					hasTest = mentioned.has(name) || mentioned.has(`./${name}`) || mentioned.has(stem)
				}
			}

			// 5c. A batch test file in __test-utils__ explicitly covers this category
			//     (e.g. shell-scripts.test.ts covers all .sh files)
			if (!hasTest) {
				const utilTests = testFiles.filter(t => t.includes('__test-utils__'))
				for (const ut of utilTests) {
					const c = testContents.get(ut) ?? ''
					if (c.includes(name) || c.includes(stem)) {
						hasTest = true
						break
					}
				}
			}

			const exists = await fileExists(absPath)

			// Deduplicate identical refs (same file, multiple MD refs)
			const dedupeKey = ref
			if (!seenRefs.has(dedupeKey)) {
				seenRefs.add(dedupeKey)
				allRefInfos.push({ ref, mdFile, hasTest, fileExists: exists, kind })
			}
			else {
				// Already seen; update hasTest if we now found a test
				const existing = allRefInfos.find(r => r.ref === dedupeKey)
				if (existing && !existing.hasTest && hasTest)
					existing.hasTest = true
			}
		}
	}

	// 6. Find unreferenced example files (exist on disk but never referenced by any .md)
	//    Also check whether unreferenced files are still needed by test files
	//    (e.g. a config imported directly by a *.test.ts). Those are "test-only"
	//    and must not be deleted — they only lack a docs reference.
	const referencedAbsPaths = new Set(
		[...seenRefs].map(ref => resolve(examplesDir, ref)),
	)

	const allExampleFiles = await findFiles(
		examplesDir,
		(_name, fullPath) =>
			!fullPath.includes(`${sep}__test-utils__${sep}`)
			&& !fullPath.includes(`${sep}zh-TW${sep}`)
			&& !fullPath.endsWith('.test.ts'),
	)

	const unreferencedFiles: string[] = []
	const testOnlyFiles: string[] = []

	for (const f of allExampleFiles) {
		if (referencedAbsPaths.has(f))
			continue

		const dir = dirname(f)
		const name = basename(f)
		const stem = basename(f, extname(f))

		// Check if a co-located test mentions this file by name or stem
		let neededByTest = false
		const mentioned = testedByDir.get(dir)
		if (mentioned && (mentioned.has(name) || mentioned.has(`./${name}`) || mentioned.has(stem))) {
			neededByTest = true
		}

		// Also check explicit (non-dynamic) mentions in __test-utils__ batch tests
		if (!neededByTest) {
			const utilTests = testFiles.filter(t => t.includes(`${sep}__test-utils__${sep}`))
			for (const ut of utilTests) {
				const c = testContents.get(ut) ?? ''
				if (
					c.includes(`'${name}'`) || c.includes(`"${name}"`)
					|| c.includes(`'${stem}'`) || c.includes(`"${stem}"`)
				) {
					neededByTest = true
					break
				}
			}
		}

		const rel = relative(examplesDir, f)
		if (neededByTest) {
			testOnlyFiles.push(rel)
		}
		else {
			unreferencedFiles.push(rel)
		}
	}

	// 7. Render report
	const missingTest = allRefInfos.filter(r => !r.hasTest && r.fileExists)
	const missingFile = allRefInfos.filter(r => !r.fileExists)

	const total = allRefInfos.length
	const covered = allRefInfos.filter(r => r.hasTest && r.fileExists).length
	const hasIssues = missingTest.length > 0 || unreferencedFiles.length > 0 || missingFile.length > 0

	console.log('\n📋 Docs Example Test Coverage Report')
	console.log('='.repeat(50))
	console.log(`  Total referenced examples : ${total}`)
	console.log(`  Covered by tests          : ${covered}`)
	console.log(`  Missing tests             : ${missingTest.length}`)
	console.log(`  Unreferenced files        : ${unreferencedFiles.length}`)
	if (testOnlyFiles.length > 0)
		console.log(`  Test-only (not in docs)   : ${testOnlyFiles.length}`)
	if (missingFile.length > 0) {
		console.log(`  Broken references         : ${missingFile.length}`)
	}
	console.log('='.repeat(50))

	if (missingFile.length > 0) {
		console.log('\n🔴 Broken references (file does not exist):')
		for (const r of missingFile) {
			const relMd = relative(rootDir, r.mdFile)
			console.log(`   ❌ .examples/${r.ref}`)
			if (verbose)
				console.log(`      referenced in: ${relMd}`)
		}
	}

	if (!hasIssues) {
		console.log('\n✅ All referenced example files have tests and no orphaned files found!\n')
		return
	}

	// Group by kind for a structured report
	const byKind = new Map<CategoryId, RefInfo[]>()
	for (const info of missingTest) {
		if (!byKind.has(info.kind))
			byKind.set(info.kind, [])
		byKind.get(info.kind)!.push(info)
	}

	console.log('\n⚠️  Example files referenced in docs without tests:\n')

	for (const kind of CATEGORY_ORDER) {
		const infos = byKind.get(kind)
		if (!infos || infos.length === 0)
			continue

		console.log(`── ${CATEGORY_LABEL[kind]} (${infos.length})`)
		for (const info of infos) {
			const relMd = relative(rootDir, info.mdFile)
			console.log(`   ❌ .examples/${info.ref}`)
			if (verbose)
				console.log(`      referenced in: ${relMd}`)
		}
		console.log()
	}

	// If verbose, also show a per-markdown-file breakdown
	if (verbose && missingTest.length > 0) {
		console.log('── By markdown file:')
		const byMd = new Map<string, RefInfo[]>()
		for (const info of missingTest) {
			const key = relative(rootDir, info.mdFile)
			if (!byMd.has(key))
				byMd.set(key, [])
			byMd.get(key)!.push(info)
		}
		for (const [md, infos] of [...byMd].sort((a, b) => a[0].localeCompare(b[0]))) {
			console.log(`\n   📄 ${md}`)
			for (const info of infos) {
				console.log(`      ❌ .examples/${info.ref}  [${info.kind}]`)
			}
		}
		console.log()
	}

	if (unreferencedFiles.length > 0) {
		console.log(`\n🗑️  Orphaned example files (exist but never referenced in any .md): (${unreferencedFiles.length})\n`)
		for (const f of unreferencedFiles.sort()) {
			console.log(`   ❌ .examples/${f}`)
		}
		console.log()
	}

	if (testOnlyFiles.length > 0) {
		console.log(`\n📎 Test-only example files (not referenced in docs, but needed by tests): (${testOnlyFiles.length})\n`)
		for (const f of testOnlyFiles.sort()) {
			console.log(`   ℹ️  .examples/${f}`)
		}
		console.log()
	}

	if (shouldClean) {
		await cleanOrphanedFiles(unreferencedFiles, testOnlyFiles)
		return
	}

	process.exit(1)
}

async function cleanOrphanedFiles(orphanedEnglish: string[], testOnlyEnglish: string[]): Promise<void> {
	const zhTWExamplesDir = resolve(docsDir, 'zh-TW', '.examples')

	// Collect zh-TW files that are referenced by zh-TW docs
	const zhTWMdFiles = await findFiles(
		resolve(docsDir, 'zh-TW'),
		name => name.endsWith('.md'),
	)
	const zhTWReferencedPaths = new Set<string>()
	for (const mdFile of zhTWMdFiles) {
		const content = await readFile(mdFile, 'utf-8')
		for (const ref of extractZhTWExampleRefs(content)) {
			zhTWReferencedPaths.add(resolve(zhTWExamplesDir, ref))
		}
	}

	// zh-TW counterparts of test-only English files are also not orphaned
	const testOnlyEnglishAbsPaths = new Set(testOnlyEnglish.map(rel => resolve(zhTWExamplesDir, rel)))

	// Find all zh-TW example files that are not referenced (and not test-only mirrors)
	const allZhTWFiles = await findFiles(
		zhTWExamplesDir,
		(_name, fullPath) => !fullPath.endsWith('.test.ts'),
	)
	const orphanedZhTW = allZhTWFiles.filter(
		f => !zhTWReferencedPaths.has(f) && !testOnlyEnglishAbsPaths.has(f),
	)

	let cleaned = 0

	for (const rel of orphanedEnglish) {
		const absPath = resolve(examplesDir, rel)
		await rm(absPath)
		cleaned++
		if (verbose)
			console.log(`  🗑️  deleted .examples/${rel}`)
	}

	for (const absPath of orphanedZhTW) {
		const rel = relative(zhTWExamplesDir, absPath)
		await rm(absPath)
		cleaned++
		if (verbose)
			console.log(`  🗑️  deleted zh-TW/.examples/${rel}`)
	}

	// Remove empty directories (deepest first)
	const dirsToCheck = new Set<string>()
	for (const rel of orphanedEnglish)
		dirsToCheck.add(dirname(resolve(examplesDir, rel)))
	for (const absPath of orphanedZhTW)
		dirsToCheck.add(dirname(absPath))

	const sortedDirs = [...dirsToCheck].sort((a, b) => b.length - a.length)
	for (const dir of sortedDirs) {
		const entries = await readdir(dir)
		if (entries.length === 0) {
			await rm(dir, { recursive: true })
			if (verbose)
				console.log(`  🗑️  removed empty dir ${relative(rootDir, dir)}`)
		}
	}

	console.log(`\n✅ Cleaned ${cleaned} orphaned example files.\n`)
}

main()
	.catch((err) => {
		console.error(err)
		process.exit(1)
	})
