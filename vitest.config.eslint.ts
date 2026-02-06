import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		name: 'eslint-integration',
		include: ['.eslint/tests/**/*.test.ts'],
		globals: true,
		environment: 'node',
		// Force sequential execution to prevent race conditions during pnpm install
		// Tests create temp dirs in monorepo space for workspace:* resolution
		// Parallel execution causes ENOENT/EEXIST errors when multiple tests
		// simultaneously run pnpm install with shared node_modules hoisting
		sequence: {
			concurrent: false,
		},
		isolate: true, // Complete isolation per test file
		testTimeout: 300000, // 300s = 5 min (5x buffer for slowest CI runners)
	},
})
