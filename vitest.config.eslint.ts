import process from 'node:process'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		name: 'eslint-integration',
		include: ['.eslint/tests/**/*.test.ts'],
		globals: true,
		environment: 'node',
		// Sequential for local dev (clear logs), parallel for CI
		sequence: {
			concurrent: process.env.CI === 'true',
		},
		isolate: true, // Complete isolation per test file
		testTimeout: 300000, // 300s = 5 min (5x buffer for slowest CI runners)
	},
})
