import { describe, expect, it, vi } from 'vitest'
import { createEventHook } from './eventHook'

describe('eventHook', () => {
	it('registers listeners, triggers them, and supports unsubscribe helpers', () => {
		const hook = createEventHook<number>()
		const listener = vi.fn()
		const second = vi.fn()

		const dispose = hook.on(listener)
		hook.on(second)
		hook.trigger(1)
		dispose()
		hook.trigger(2)
		hook.off(second)
		hook.trigger(3)

		expect(listener)
			.toHaveBeenCalledTimes(1)
		expect(listener)
			.toHaveBeenCalledWith(1)
		expect(second)
			.toHaveBeenCalledTimes(2)
		expect(second)
			.toHaveBeenNthCalledWith(1, 1)
		expect(second)
			.toHaveBeenNthCalledWith(2, 2)
		expect(hook.listeners.size)
			.toBe(0)
	})

	it('does nothing when triggering without listeners', () => {
		const hook = createEventHook<string>()

		expect(() => hook.trigger('payload')).not.toThrow()
	})
})
