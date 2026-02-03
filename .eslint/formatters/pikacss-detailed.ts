import type { ESLint } from 'eslint'

/**
 * Custom ESLint formatter for PikaCSS-specific constraint violations
 * Provides detailed error messages with fix suggestions and documentation links
 */
const formatter: ESLint.Formatter['format'] = (results) => {
	let output = ''
	let errorCount = 0
	let warningCount = 0

	// ANSI color codes for better readability
	const colors = {
		reset: '\x1B[0m',
		red: '\x1B[31m',
		yellow: '\x1B[33m',
		green: '\x1B[32m',
		gray: '\x1B[90m',
		bold: '\x1B[1m',
	}

	// Group errors by file
	for (const result of results) {
		if (result.messages.length === 0)
			continue

		// File header
		output += `\n${colors.bold}${result.filePath}${colors.reset}\n`

		for (const message of result.messages) {
			const level = message.severity === 2 ? 'ERROR' : 'WARN'
			const levelColor = message.severity === 2 ? colors.red : colors.yellow
			const position = `${message.line}:${message.column}`

			// Main error line: position, level, message, ruleId
			output += `  ${colors.gray}${position}${colors.reset}  ${levelColor}${level}${colors.reset}  ${message.message}`

			if (message.ruleId) {
				output += `  ${colors.gray}${message.ruleId}${colors.reset}`
			}

			output += '\n'

			// Add PikaCSS-specific context for pikacss/* rules
			if (message.ruleId?.startsWith('pikacss/')) {
				// Add fix suggestion if available
				if (message.suggestions && message.suggestions.length > 0) {
					const suggestion = message.suggestions[0]
					if (suggestion?.desc) {
						output += `    ${colors.green}Fix:${colors.reset} ${suggestion.desc}\n`
					}
				}

				// Add documentation link
				const docsUrl = `https://docs.pikacss.io/verification/${message.ruleId}`
				output += `    ${colors.green}Docs:${colors.reset} ${docsUrl}\n`
			}

			// Update counters
			if (message.severity === 2)
				errorCount++
			else warningCount++
		}
	}

	// Summary line
	if (errorCount > 0 || warningCount > 0) {
		const summaryColor = errorCount > 0 ? colors.red : colors.yellow
		output += `\n${summaryColor}✖ ${errorCount} error${errorCount !== 1 ? 's' : ''}, ${warningCount} warning${warningCount !== 1 ? 's' : ''}${colors.reset}\n`
	}
	else {
		output += `\n${colors.green}✓ No problems found${colors.reset}\n`
	}

	return output
}

export default formatter
