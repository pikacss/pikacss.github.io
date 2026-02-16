import { defineEnginePlugin } from '@pikacss/core'

export const plugin = defineEnginePlugin({
	name: 'example',
	configureEngine: async (engine) => {
		// Add custom selectors to autocomplete
		engine.appendAutocompleteSelectors('hover', 'focus', 'dark')

		// Add custom style item strings to autocomplete
		engine.appendAutocompleteStyleItemStrings(
			'flex-center',
			'btn-primary',
		)

		// Add extra TypeScript properties for autocomplete
		engine.appendAutocompleteExtraProperties('__shortcut')

		// Add extra CSS properties for autocomplete
		engine.appendAutocompleteExtraCssProperties(
			'--my-color',
			'--my-size',
		)

		// Add TypeScript type unions for a property value
		engine.appendAutocompletePropertyValues(
			'__shortcut',
			'(string & {})',
		)

		// Add concrete CSS values for a property
		engine.appendAutocompleteCssPropertyValues(
			'display',
			'flex',
			'grid',
			'block',
		)
	},
})
