import { defineEngineConfig } from '@pikacss/core'

export default defineEngineConfig({
	important: { default: false },
	variables: { variables: { '--surface-bg': '#ffffff' } },
	keyframes: { keyframes: ['enter-fade'] },
	selectors: { selectors: [['hover', '$:hover']] },
	shortcuts: { shortcuts: [['stack-sm', { display: 'grid', gap: '0.5rem' }]] },
})
