import { beforeEach, describe, expect, it, vi } from 'vitest'

import { icons } from './index'

const mocked = vi.hoisted(() => ({
	encodeSvgForCss: vi.fn((svg: string) => encodeURIComponent(svg)),
	loadIcon: vi.fn(),
	quicklyValidateIconSet: vi.fn(),
	searchForIcon: vi.fn(),
	stringToIcon: vi.fn((value: string) => {
		const [prefix, nameWithQuery] = value.split(':')
		if (!prefix || !nameWithQuery)
			return null
		const [name] = nameWithQuery.split('?')
		return { prefix, name }
	}),
	loadNodeIcon: vi.fn(),
	fetch: vi.fn(),
}))

vi.mock('@iconify/utils', () => ({
	encodeSvgForCss: mocked.encodeSvgForCss,
	loadIcon: mocked.loadIcon,
	quicklyValidateIconSet: mocked.quicklyValidateIconSet,
	searchForIcon: mocked.searchForIcon,
	stringToIcon: mocked.stringToIcon,
}))

vi.mock('@iconify/utils/lib/loader/node-loader', () => ({
	loadNodeIcon: mocked.loadNodeIcon,
}))

vi.mock('ofetch', () => ({
	$fetch: mocked.fetch,
}))

function createMockEngine() {
	return {
		appendAutocomplete: vi.fn(),
		shortcuts: { add: vi.fn() },
		variables: {
			store: new Map<string, unknown>(),
			add: vi.fn(),
		},
		config: { prefix: 'pk-' },
	} as any
}

describe('icons plugin', () => {
	beforeEach(() => {
		mocked.loadIcon.mockReset()
		mocked.loadNodeIcon.mockReset()
		mocked.searchForIcon.mockReset()
		mocked.fetch.mockReset()
		mocked.quicklyValidateIconSet.mockReset()
	})

	it('registers autocomplete patterns and resolves icons into mask styles', async () => {
		mocked.loadIcon.mockResolvedValue('<svg fill="currentColor"></svg>')

		const plugin = icons()
		await plugin.configureRawConfig?.({
			icons: {
				prefix: ['i-', 'icon-'],
				autocomplete: ['mdi:home'],
			},
		} as any)

		const engine = createMockEngine()
		await plugin.configureEngine?.(engine)

		expect(engine.appendAutocomplete)
			.toHaveBeenCalledWith({
				patterns: {
					shortcuts: [
						'`i-$' + '{string}:$' + '{string}`',
						'`i-$' + '{string}:$' + '{string}?mask`',
						'`i-$' + '{string}:$' + '{string}?bg`',
						'`i-$' + '{string}:$' + '{string}?auto`',
						'`icon-$' + '{string}:$' + '{string}`',
						'`icon-$' + '{string}:$' + '{string}?mask`',
						'`icon-$' + '{string}:$' + '{string}?bg`',
						'`icon-$' + '{string}:$' + '{string}?auto`',
					],
				},
			})

		const shortcutConfig = engine.shortcuts.add.mock.calls[0]?.[0]
		expect(shortcutConfig.autocomplete)
			.toEqual(['i-', 'icon-', 'i-mdi:home', 'icon-mdi:home'])
		const style = await shortcutConfig.value(['i-mdi:home', 'mdi:home', 'auto'])

		expect(engine.variables.add)
			.toHaveBeenCalledWith({
				'--pk-svg-icon-mdi-home': {
					value: 'url("data:image/svg+xml;utf8,%3Csvg%20fill%3D%22currentColor%22%3E%3C%2Fsvg%3E")',
					autocomplete: { asValueOf: '-', asProperty: false },
					pruneUnused: true,
				},
			})
		expect(style)
			.toMatchObject({
				'--svg-icon': 'var(--pk-svg-icon-mdi-home)',
				'background-color': 'currentColor',
				'mask': 'var(--svg-icon) no-repeat',
			})
	})

	it('returns an empty style when icon loading fails', async () => {
		mocked.loadIcon.mockResolvedValue(null)
		mocked.loadNodeIcon.mockResolvedValue(null)

		const plugin = icons()
		await plugin.configureRawConfig?.({ icons: {} } as any)
		const engine = createMockEngine()
		await plugin.configureEngine?.(engine)

		const shortcutConfig = engine.shortcuts.add.mock.calls[0]?.[0]
		await expect(shortcutConfig.value(['i-mdi:missing', 'mdi:missing', 'mask'])).resolves.toEqual({})
	})

	it('falls back to the local loader and switches auto mode to background rendering', async () => {
		mocked.loadIcon.mockResolvedValue(null)
		mocked.loadNodeIcon.mockResolvedValue('<svg fill="#000"></svg>')

		const plugin = icons()
		await plugin.configureRawConfig?.({ icons: {} } as any)
		const engine = createMockEngine()
		await plugin.configureEngine?.(engine)

		const shortcutConfig = engine.shortcuts.add.mock.calls[0]?.[0]
		const style = await shortcutConfig.value(['i-mdi:home', 'mdi:home', 'auto'])

		expect(mocked.loadNodeIcon)
			.toHaveBeenCalledWith('mdi', 'home', expect.any(Object))
		expect(style)
			.toMatchObject({
				'--svg-icon': 'var(--pk-svg-icon-mdi-home)',
				'background': 'var(--svg-icon) no-repeat',
				'background-size': '100% 100%',
				'background-color': 'transparent',
			})
		expect(style)
			.not.toHaveProperty('mask')
	})

	it('falls back to the CDN loader and reuses cached collections', async () => {
		mocked.loadIcon.mockResolvedValue(null)
		mocked.loadNodeIcon.mockResolvedValue(null)
		mocked.fetch.mockResolvedValue({ prefix: 'mdi' })
		mocked.quicklyValidateIconSet.mockReturnValue({ prefix: 'mdi' })
		mocked.searchForIcon.mockResolvedValue('<svg fill="#123456"></svg>')

		const plugin = icons()
		await plugin.configureRawConfig?.({
			icons: {
				cdn: 'https://cdn.example.com/icons',
			},
		} as any)
		const engine = createMockEngine()
		await plugin.configureEngine?.(engine)

		const shortcutConfig = engine.shortcuts.add.mock.calls[0]?.[0]
		const firstStyle = await shortcutConfig.value(['i-mdi:home', 'mdi:home', 'auto'])
		const secondStyle = await shortcutConfig.value(['i-mdi:account', 'mdi:account', 'auto'])

		expect(mocked.fetch)
			.toHaveBeenCalledTimes(1)
		expect(mocked.fetch)
			.toHaveBeenCalledWith('https://cdn.example.com/icons/mdi.json')
		expect(mocked.quicklyValidateIconSet)
			.toHaveBeenCalledWith({ prefix: 'mdi' })
		expect(mocked.searchForIcon)
			.toHaveBeenCalledTimes(2)
		expect(firstStyle)
			.toMatchObject({
				'background': 'var(--svg-icon) no-repeat',
				'background-size': '100% 100%',
			})
		expect(secondStyle)
			.toMatchObject({
				'background': 'var(--svg-icon) no-repeat',
				'background-color': 'transparent',
			})
	})

	it('returns an empty style for invalid icon names and processor-free CDN failures', async () => {
		mocked.stringToIcon.mockImplementationOnce(() => null as any)
		mocked.loadIcon.mockResolvedValue(null)
		mocked.loadNodeIcon.mockResolvedValue(null)
		mocked.fetch.mockRejectedValue(new Error('offline'))

		const plugin = icons()
		await plugin.configureRawConfig?.({
			icons: {
				cdn: 'https://cdn.example.com/icons',
			},
		} as any)
		const engine = createMockEngine()
		await plugin.configureEngine?.(engine)

		const shortcutConfig = engine.shortcuts.add.mock.calls[0]?.[0]
		await expect(shortcutConfig.value(['i-invalid', 'invalid', 'mask'])).resolves.toEqual({})
		await expect(shortcutConfig.value(['i-mdi:offline', 'mdi:offline', 'mask'])).resolves.toEqual({})
		expect(mocked.fetch)
			.toHaveBeenCalledWith('https://cdn.example.com/icons/mdi.json')
	})

	it('applies unit sizing, processor mutations, and explicit bg mode for custom icons', async () => {
		mocked.loadIcon.mockResolvedValue('<svg viewBox="0 0 24 24"></svg>')

		const processor = vi.fn((styleItem: Record<string, string>) => {
			styleItem.border = '1px solid red'
		})
		const plugin = icons()
		await plugin.configureRawConfig?.({
			icons: {
				mode: 'bg',
				unit: 'rem',
				scale: 2,
				extraProperties: { focusable: 'false' },
				processor,
			},
		} as any)

		const engine = createMockEngine()
		await plugin.configureEngine?.(engine)

		const shortcutConfig = engine.shortcuts.add.mock.calls[0]?.[0]
		const style = await shortcutConfig.value(['i-mdi:home?bg', 'mdi:home', 'bg'])

		expect(processor)
			.toHaveBeenCalled()
		expect(style)
			.toMatchObject({
				background: 'var(--svg-icon) no-repeat',
				border: '1px solid red',
			})
	})

	it('skips the local loader in VS Code environments and uses collection placeholders for CDN urls', async () => {
		const previousVsCodePid = process.env.VSCODE_PID
		process.env.VSCODE_PID = '1234'
		mocked.loadIcon.mockResolvedValue(null)
		mocked.loadNodeIcon.mockResolvedValue('<svg></svg>')
		mocked.fetch.mockResolvedValue({ prefix: 'mdi' })
		mocked.quicklyValidateIconSet.mockReturnValue({ prefix: 'mdi' })
		mocked.searchForIcon.mockResolvedValue('<svg fill="#333"></svg>')

		const plugin = icons()
		await plugin.configureRawConfig?.({
			icons: {
				cdn: 'https://cdn.example.com/{collection}.json',
			},
		} as any)
		const engine = createMockEngine()
		await plugin.configureEngine?.(engine)

		const shortcutConfig = engine.shortcuts.add.mock.calls[0]?.[0]
		const style = await shortcutConfig.value(['i-mdi:account', 'mdi:account', 'mask'])

		expect(mocked.loadNodeIcon)
			.not.toHaveBeenCalled()
		expect(mocked.fetch)
			.toHaveBeenCalledWith('https://cdn.example.com/mdi.json')
		expect(style)
			.toMatchObject({
				mask: 'var(--svg-icon) no-repeat',
			})

		if (previousVsCodePid == null)
			delete process.env.VSCODE_PID
		else
			process.env.VSCODE_PID = previousVsCodePid
	})
})
