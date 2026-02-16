import { defineEngineConfig, defineShortcut } from '@pikacss/unplugin-pikacss'

// defineShortcut() is a type-safe identity helper
// It provides full TypeScript autocomplete for shortcut definitions
const flexCenter = defineShortcut(['flex-center', {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
}])

const dynamicMargin = defineShortcut({
	shortcut: /^m-(\d+)$/,
	value: m => ({ margin: `${Number(m[1]) * 0.25}rem` }),
	autocomplete: ['m-1', 'm-2', 'm-4'],
})

export default defineEngineConfig({
	shortcuts: {
		shortcuts: [flexCenter, dynamicMargin],
	},
})
