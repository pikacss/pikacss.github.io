import type { Code } from 'mdast'
import type { DocumentedAPI } from './types'
import * as fs from 'node:fs/promises'
import remarkParse from 'remark-parse'
import { unified } from 'unified'
import { visit } from 'unist-util-visit'
import { DocumentationType } from './types'

/**
 * Determine the type of documentation based on file path
 */
export function getDocumentationType(filePath: string): DocumentationType {
	const normalizedPath = filePath.replace(/\\/g, '/')

	if (normalizedPath.includes('/advanced/api-reference.md')) {
		return DocumentationType.API_REFERENCE
	}

	if (normalizedPath.includes('/guide/') || normalizedPath.includes('/llm/')) {
		return DocumentationType.GUIDE
	}

	if (normalizedPath.includes('/examples/')) {
		return DocumentationType.EXAMPLE
	}

	return DocumentationType.OTHER
}

/**
 * Normalize a TypeScript signature for comparison
 * - Remove extra whitespace
 * - Normalize spacing around operators
 */
export function normalizeSignature(signature: string): string {
	let normalized = signature
		.replace(/\s+/g, ' ') // Replace multiple spaces with single space
		.replace(/\(\s+/g, '(') // Remove space after opening paren
		.replace(/\s+\)/g, ')') // Remove space before closing paren
		.replace(/,\s*/g, ', ') // Normalize commas
		.replace(/\s*:\s*/g, ': ') // Normalize colons
		.replace(/\s*=>\s*/g, ' => ') // Normalize arrows
		.replace(/\s*\|\s*/g, ' | ') // Normalize union types
		.replace(/\s*&\s*/g, ' & ') // Normalize intersection types
		.trim()

	// Strip internal suffixes (e.g. EngineConfig$1 -> EngineConfig)
	normalized = normalized.replace(/(\w+)\$\d+/g, '$1')

	// Normalize function declarations to arrow signature
	// function name(args): type -> (args) => type
	const functionMatch = normalized.match(/^(?:export\s+)?(?:async\s+)?function\s+\w+(\(.*\))\s*:\s*(\S.*)$/)
	if (functionMatch) {
		return `${functionMatch[1]} => ${functionMatch[2]}`
	}

	return normalized
}

/**
 * Parse a markdown documentation file and extract documented APIs
 */
export async function parseDocumentedAPIs(markdownFile: string): Promise<DocumentedAPI[]> {
	try {
		const content = await fs.readFile(markdownFile, 'utf-8')
		const processor = unified()
			.use(remarkParse)
		const ast = processor.parse(content)

		const apis: DocumentedAPI[] = []
		const context = getDocumentationType(markdownFile)
		const currentLine = 1

		visit(ast, 'code', (node: Code) => {
			// Only process TypeScript code blocks
			if (node.lang !== 'ts' && node.lang !== 'typescript') {
				return
			}

			// Skip example code blocks (containing "// example")
			if (node.value.includes('// example')) {
				return
			}

			// Extract API signatures from the code block
			const lines = node.value.split('\n')
			let lineNumber = currentLine + (node.position?.start.line ?? 0)

			for (const line of lines) {
				const trimmed = line.trim()

				// Match function declarations
				const functionMatch = trimmed.match(/^(export\s+)?(async\s+)?function\s+(\w+)/)
				if (functionMatch && functionMatch[3]) {
					const name = functionMatch[3]
					const signature = extractFullSignature(lines, lines.indexOf(line))
					apis.push({
						name,
						signature: normalizeSignature(signature),
						file: markdownFile,
						line: lineNumber,
						context,
					})
					lineNumber++
					continue
				}

				// Match interface declarations
				const interfaceMatch = trimmed.match(/^(export\s+)?interface\s+(\w+)/)
				if (interfaceMatch && interfaceMatch[2]) {
					const name = interfaceMatch[2]
					const signature = extractFullSignature(lines, lines.indexOf(line))
					apis.push({
						name,
						signature: normalizeSignature(signature),
						file: markdownFile,
						line: lineNumber,
						context,
					})
					lineNumber++
					continue
				}

				// Match type declarations
				const typeMatch = trimmed.match(/^(export\s+)?type\s+(\w+)/)
				if (typeMatch && typeMatch[2]) {
					const name = typeMatch[2]
					const signature = extractFullSignature(lines, lines.indexOf(line))
					apis.push({
						name,
						signature: normalizeSignature(signature),
						file: markdownFile,
						line: lineNumber,
						context,
					})
					lineNumber++
					continue
				}

				// Match class declarations
				const classMatch = trimmed.match(/^(export\s+)?class\s+(\w+)/)
				if (classMatch && classMatch[2]) {
					const name = classMatch[2]
					const signature = extractFullSignature(lines, lines.indexOf(line))
					apis.push({
						name,
						signature: normalizeSignature(signature),
						file: markdownFile,
						line: lineNumber,
						context,
					})
					lineNumber++
					continue
				}

				// Match enum declarations
				const enumMatch = trimmed.match(/^(export\s+)?enum\s+(\w+)/)
				if (enumMatch && enumMatch[2]) {
					const name = enumMatch[2]
					const signature = extractFullSignature(lines, lines.indexOf(line))
					apis.push({
						name,
						signature: normalizeSignature(signature),
						file: markdownFile,
						line: lineNumber,
						context,
					})
					lineNumber++
					continue
				}

				lineNumber++
			}
		})

		return apis
	}
	catch (error) {
		console.warn(`Failed to parse ${markdownFile}:`, error)
		return []
	}
}

/**
 * Extract the full signature for a declaration (handling multi-line signatures)
 */
function extractFullSignature(lines: string[], startIndex: number): string {
	let signature = lines[startIndex]?.trim() ?? ''
	let braceCount = (signature.match(/\{/g) || []).length - (signature.match(/\}/g) || []).length
	let parenCount = (signature.match(/\(/g) || []).length - (signature.match(/\)/g) || []).length

	// If signature is complete on one line
	if (braceCount === 0 && parenCount === 0 && !signature.endsWith(',')) {
		return signature
	}

	// For multi-line signatures, collect until balanced
	let i = startIndex + 1
	while (i < lines.length && (braceCount > 0 || parenCount > 0 || signature.endsWith(','))) {
		const line = lines[i]?.trim() ?? ''
		signature += ` ${line}`
		braceCount += (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length
		parenCount += (line.match(/\(/g) || []).length - (line.match(/\)/g) || []).length
		i++
	}

	return signature
}
