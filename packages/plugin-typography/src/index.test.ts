import { describe, expect, it, vi } from 'vitest'
import { typography } from './index'

function createMockEngine() {
	return {
		variables: { add: vi.fn() },
		shortcuts: { add: vi.fn() },
	} as any
}

describe('typography plugin', () => {
	it('registers typography variables and shortcuts including size variants', async () => {
		const plugin = typography()
		plugin.configureRawConfig?.({
			typography: {
				variables: {
					'--pk-prose-color-body': '#111827',
				},
			},
		} as any)

		const engine = createMockEngine()
		await plugin.configureEngine?.(engine)

		expect(engine.variables.add)
			.toHaveBeenCalledWith(expect.objectContaining({
				'--pk-prose-color-body': '#111827',
				'--pk-prose-color-links': 'currentColor',
			}))
		expect(engine.shortcuts.add)
			.toHaveBeenCalledWith(['prose-base', expect.any(Object)])
		expect(engine.shortcuts.add)
			.toHaveBeenCalledWith(['prose', expect.arrayContaining(['prose-paragraphs', 'prose-links'])])
		expect(engine.shortcuts.add)
			.toHaveBeenCalledWith(['prose-sm', ['prose', { fontSize: '0.875rem', lineHeight: '1.71' }]])
		expect(engine.shortcuts.add)
			.toHaveBeenCalledWith(['prose-2xl', ['prose', { fontSize: '1.5rem', lineHeight: '1.66' }]])
	})

	it('uses default variables when no typography config is provided', async () => {
		const plugin = typography()
		plugin.configureRawConfig?.({} as any)
		const engine = createMockEngine()

		await plugin.configureEngine?.(engine)

		expect(engine.variables.add)
			.toHaveBeenCalledWith(expect.objectContaining({
				'--pk-prose-color-body': expect.any(String),
				'--pk-prose-color-links': expect.any(String),
			}))
		expect(engine.shortcuts.add)
			.toHaveBeenCalledWith(['prose-lg', ['prose', { fontSize: '1.125rem', lineHeight: '1.77' }]])
		expect(engine.shortcuts.add)
			.toHaveBeenCalledWith(['prose-xl', ['prose', { fontSize: '1.25rem', lineHeight: '1.8' }]])
	})
})
