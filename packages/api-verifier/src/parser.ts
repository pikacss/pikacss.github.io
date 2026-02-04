/**
 * Markdown documentation parser
 * Extracts API signatures from TypeScript code blocks in markdown files
 */

import type { Code } from 'mdast'
import type { DocumentedAPI } from './types.js'
import * as fs from 'node:fs'
import remarkParse from 'remark-parse'
import { unified } from 'unified'
import { visit } from 'unist-util-visit'
import { DocumentationType } from './types.js'

/**
 * Determines documentation type based on file path
 * @param filePath - Path to documentation file
 * @returns Documentation type classification
 */
export function getDocumentationType(filePath: string): DocumentationType {
	// Normalize path separators for consistent matching
	const normalizedPath = filePath.replace(/\\/g, '/')

	// API Reference requires exact signatures
	if (normalizedPath.includes('/advanced/api-reference.md')) {
		return DocumentationType.API_REFERENCE
	}

	// Guides and LLM docs allow simplified signatures
	if (normalizedPath.includes('/guide/') || normalizedPath.includes('/llm/')) {
		return DocumentationType.GUIDE
	}

	// Examples are illustrative code
	if (normalizedPath.includes('/examples/')) {
		return DocumentationType.EXAMPLE
	}

	return DocumentationType.OTHER
}

/**
 * Normalizes TypeScript signature for comparison
 * Removes extra whitespace and standardizes formatting
 * @param signature - Raw signature string
 * @returns Normalized signature
 */
export function normalizeSignature(signature: string): string {
	return signature
		// Normalize all whitespace to single spaces
		.replace(/\s+/g, ' ')
		// Normalize colons with consistent spacing
		.replace(/\s*:\s*/g, ': ')
		// Normalize arrows with consistent spacing
		.replace(/\s*=>\s*/g, ' => ')
		// Normalize union types with consistent spacing
		.replace(/\s*\|\s*/g, ' | ')
		// Normalize intersection types with consistent spacing
		.replace(/\s*&\s*/g, ' & ')
		// Remove leading/trailing whitespace
		.trim()
}

/**
 * Extracts API name from TypeScript declaration
 * @param code - TypeScript code block
 * @returns API name if found
 */
function extractAPIName(code: string): string | null {
	// Match function declarations
	const functionMatch = code.match(/^export\s+(?:async\s+)?function\s+(\w+)/)
	if (functionMatch)
		return functionMatch[1] ?? null

	// Match const function declarations
	const constMatch = code.match(/^export\s+const\s+(\w+)\s*=/)
	if (constMatch)
		return constMatch[1] ?? null

	// Match interface declarations
	const interfaceMatch = code.match(/^export\s+interface\s+(\w+)/)
	if (interfaceMatch)
		return interfaceMatch[1] ?? null

	// Match type declarations
	const typeMatch = code.match(/^export\s+type\s+(\w+)/)
	if (typeMatch)
		return typeMatch[1] ?? null

	// Match class declarations
	const classMatch = code.match(/^export\s+(?:abstract\s+)?class\s+(\w+)/)
	if (classMatch)
		return classMatch[1] ?? null

	// Match enum declarations
	const enumMatch = code.match(/^export\s+enum\s+(\w+)/)
	if (enumMatch)
		return enumMatch[1] ?? null

	return null
}

/**
 * Checks if code block is example code (should be skipped)
 * @param code - Code block content
 * @returns true if this is example code
 */
function isExampleCode(code: string): boolean {
	// Check for explicit example markers
	if (code.includes('// example') || code.includes('// Example'))
		return true
	if (code.includes('/* example') || code.includes('/* Example'))
		return true

	// Check for usage/implementation patterns (not API declarations)
	if (code.includes('const ') && code.includes('pika(')) {
		// This is usage code, not an API declaration
		return true
	}

	return false
}

/**
 * Parses markdown file to extract documented API signatures
 * @param markdownFile - Path to markdown file
 * @returns Array of documented APIs found in file
 */
export function parseDocumentedAPIs(markdownFile: string): DocumentedAPI[] {
	try {
		// Read file content
		const content = fs.readFileSync(markdownFile, 'utf-8')

		// Parse markdown to AST
		const tree = unified()
			.use(remarkParse)
			.parse(content)

		// Determine documentation context
		const context = getDocumentationType(markdownFile)

		// Extract API signatures from TypeScript code blocks
		const apis: DocumentedAPI[] = []

		visit(tree, 'code', (node: Code) => {
			// Only process TypeScript/JavaScript code blocks
			if (node.lang !== 'typescript' && node.lang !== 'ts' && node.lang !== 'javascript' && node.lang !== 'js') {
				return
			}

			// Skip example code blocks
			if (isExampleCode(node.value)) {
				return
			}

			// Extract API name from code
			const name = extractAPIName(node.value)
			if (!name) {
				// No exported API found in this code block
				return
			}

			// Create documented API entry
			apis.push({
				name,
				signature: normalizeSignature(node.value),
				file: markdownFile,
				line: node.position?.start.line || 0,
				context,
			})
		})

		return apis
	}
	catch (error) {
		// Log warning but return empty array on errors
		console.warn(`Failed to parse ${markdownFile}:`, error)
		return []
	}
}
