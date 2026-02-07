import fs from 'node:fs/promises'
import process from 'node:process'
import { glob } from 'zx'

const DOCS_DIR = 'docs'

async function main() {
	// Exclude node_modules
	const files = await glob([`${DOCS_DIR}/**/*.md`, `!${DOCS_DIR}/**/node_modules/**`])
	let hasErrors = false

	console.log(`Scanning ${files.length} markdown files in ${DOCS_DIR} (excluding node_modules)...`)

	for (const file of files) {
		const content = await fs.readFile(file, 'utf-8')
		const lines = content.split('\n')
		let inCodeBlock = false

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i]
			if (line === undefined)
				continue

			const trimmed = line.trim()

			if (trimmed.startsWith('```')) {
				if (inCodeBlock) {
					inCodeBlock = false
				}
				else {
					const lang = trimmed.slice(3)
						.trim()
						.toLowerCase()
					if (['ts', 'typescript', 'js', 'javascript', 'vue'].some(l => lang.startsWith(l))) {
						inCodeBlock = true
					}
				}
				continue
			}

			if (inCodeBlock) {
				// 1. Check for pika import
				// Simple string check to avoid complex regex backtracking issues
				if (line.startsWith('import ') && (line.includes('\'@pikacss/core\'') || line.includes('"@pikacss/core"') || line.includes('\'pikacss\'') || line.includes('"pikacss"'))) {
					if (/\bpika\b/.test(line)) {
						console.error(`ERROR: ${file}:${i + 1}: Explicit pika import found. pika() is a build-time global.`)
						hasErrors = true
					}
				}

				// 2. Check for non-ASCII in comments (single line //)
				if (line.includes('//')) {
					const commentPart = line.substring(line.indexOf('//') + 2)
					// Check for characters > 127
					// eslint-disable-next-line no-control-regex
					if (/[^\x00-\x7F]/.test(commentPart)) {
						console.error(`ERROR: ${file}:${i + 1}: Non-ASCII characters found in comment: "${commentPart.trim()}". Use English only.`)
						hasErrors = true
					}
				}

				// 3. Check for dynamic pika() arguments
				const pikaIndex = line.indexOf('pika(')
				if (pikaIndex !== -1 && !line.trim()
					.startsWith('export function pika')) {
					const argsStart = line.substring(pikaIndex + 5)
						.trim()

					if (argsStart.length > 0) {
						const firstChar = argsStart[0]
						if (!['{', '[', '"', '\'', '`', ')'].includes(firstChar)) {
							const argSnippet = (argsStart.split(')')[0] || '').trim()
							console.error(`WARNING: ${file}:${i + 1}: Possible dynamic pika() argument found: pika(${argSnippet}). Ensure it is static.`)
							hasErrors = true
						}
					}
				}
			}
		}
	}

	if (hasErrors) {
		console.error('Violations found.')
		process.exit(1)
	}
	else {
		console.log('All checks passed!')
	}
}

main()
	.catch(console.error)
