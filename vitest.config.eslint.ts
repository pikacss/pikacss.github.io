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
		testTimeout: 120000, // Bundler builds can take time, especially in CI (2-3x slower)
	},
})
