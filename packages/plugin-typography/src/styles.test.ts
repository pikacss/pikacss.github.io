import { describe, expect, it } from 'vitest'
import {
	proseBaseStyle,
	proseCodeStyle,
	proseEmphasisStyle,
	proseHeadingsStyle,
	proseHrStyle,
	proseKbdStyle,
	proseLinksStyle,
	proseListsStyle,
	proseMediaStyle,
	proseParagraphsStyle,
	proseQuotesStyle,
	proseTablesStyle,
	typographyVariables,
} from './styles'

// ─── typographyVariables ─────────────────────────────────────────────────────

describe('typographyVariables', () => {
	it('should be an object', () => {
		expect(typeof typographyVariables)
			.toBe('object')
		expect(typographyVariables).not.toBeNull()
	})

	it('should contain all expected CSS variable keys', () => {
		const expectedKeys = [
			'--pk-prose-color-body',
			'--pk-prose-color-headings',
			'--pk-prose-color-lead',
			'--pk-prose-color-links',
			'--pk-prose-color-bold',
			'--pk-prose-color-counters',
			'--pk-prose-color-bullets',
			'--pk-prose-color-hr',
			'--pk-prose-color-quotes',
			'--pk-prose-color-quote-borders',
			'--pk-prose-color-captions',
			'--pk-prose-color-code',
			'--pk-prose-color-pre-code',
			'--pk-prose-color-pre-bg',
			'--pk-prose-color-th-borders',
			'--pk-prose-color-td-borders',
			'--pk-prose-color-kbd',
			'--pk-prose-kbd-shadows',
		]
		for (const key of expectedKeys) {
			expect(typographyVariables)
				.toHaveProperty(key)
		}
	})

	it('should have string values for all keys', () => {
		for (const value of Object.values(typographyVariables)) {
			expect(typeof value)
				.toBe('string')
		}
	})

	it('should default most color variables to "currentColor"', () => {
		expect(typographyVariables['--pk-prose-color-body'])
			.toBe('currentColor')
		expect(typographyVariables['--pk-prose-color-headings'])
			.toBe('currentColor')
		expect(typographyVariables['--pk-prose-color-links'])
			.toBe('currentColor')
	})

	it('should default --pk-prose-color-pre-bg to "transparent"', () => {
		expect(typographyVariables['--pk-prose-color-pre-bg'])
			.toBe('transparent')
	})
})

// ─── proseBaseStyle ──────────────────────────────────────────────────────────

describe('proseBaseStyle', () => {
	it('should be a valid object', () => {
		expect(typeof proseBaseStyle)
			.toBe('object')
		expect(proseBaseStyle).not.toBeNull()
	})

	it('should have color property', () => {
		expect(proseBaseStyle)
			.toHaveProperty('color')
	})

	it('should have maxWidth property', () => {
		expect(proseBaseStyle)
			.toHaveProperty('maxWidth')
	})

	it('should have fontSize property', () => {
		expect(proseBaseStyle)
			.toHaveProperty('fontSize')
	})

	it('should have lineHeight property', () => {
		expect(proseBaseStyle)
			.toHaveProperty('lineHeight')
	})

	it('should use prose body color variable for color', () => {
		expect(proseBaseStyle.color)
			.toBe('var(--pk-prose-color-body)')
	})

	it('should set maxWidth to 65ch', () => {
		expect(proseBaseStyle.maxWidth)
			.toBe('65ch')
	})
})

// ─── proseParagraphsStyle ────────────────────────────────────────────────────

describe('proseParagraphsStyle', () => {
	it('should be a valid object', () => {
		expect(typeof proseParagraphsStyle)
			.toBe('object')
		expect(proseParagraphsStyle).not.toBeNull()
	})

	it('should have paragraph selector styles', () => {
		expect(proseParagraphsStyle)
			.toHaveProperty('$ p')
	})

	it('should have lead selector styles', () => {
		expect(proseParagraphsStyle)
			.toHaveProperty('$ [class~="lead"]')
	})
})

// ─── proseLinksStyle ─────────────────────────────────────────────────────────

describe('proseLinksStyle', () => {
	it('should be a valid object', () => {
		expect(typeof proseLinksStyle)
			.toBe('object')
		expect(proseLinksStyle).not.toBeNull()
	})

	it('should have anchor selector styles', () => {
		expect(proseLinksStyle)
			.toHaveProperty('$ a')
	})
})

// ─── proseEmphasisStyle ──────────────────────────────────────────────────────

describe('proseEmphasisStyle', () => {
	it('should be a valid object', () => {
		expect(typeof proseEmphasisStyle)
			.toBe('object')
		expect(proseEmphasisStyle).not.toBeNull()
	})

	it('should have strong selector styles', () => {
		expect(proseEmphasisStyle)
			.toHaveProperty('$ strong')
	})

	it('should have em selector styles', () => {
		expect(proseEmphasisStyle)
			.toHaveProperty('$ em')
	})
})

// ─── proseKbdStyle ───────────────────────────────────────────────────────────

describe('proseKbdStyle', () => {
	it('should be a valid object', () => {
		expect(typeof proseKbdStyle)
			.toBe('object')
		expect(proseKbdStyle).not.toBeNull()
	})

	it('should have kbd selector styles', () => {
		expect(proseKbdStyle)
			.toHaveProperty('$ kbd')
	})
})

// ─── proseListsStyle ────────────────────────────────────────────────────────

describe('proseListsStyle', () => {
	it('should be a valid object', () => {
		expect(typeof proseListsStyle)
			.toBe('object')
		expect(proseListsStyle).not.toBeNull()
	})

	it('should have ordered list selector styles', () => {
		expect(proseListsStyle)
			.toHaveProperty('$ ol')
	})

	it('should have unordered list selector styles', () => {
		expect(proseListsStyle)
			.toHaveProperty('$ ul')
	})

	it('should have list item selector styles', () => {
		expect(proseListsStyle)
			.toHaveProperty('$ li')
	})
})

// ─── proseHrStyle ────────────────────────────────────────────────────────────

describe('proseHrStyle', () => {
	it('should be a valid object', () => {
		expect(typeof proseHrStyle)
			.toBe('object')
		expect(proseHrStyle).not.toBeNull()
	})

	it('should have hr selector styles', () => {
		expect(proseHrStyle)
			.toHaveProperty('$ hr')
	})
})

// ─── proseHeadingsStyle ──────────────────────────────────────────────────────

describe('proseHeadingsStyle', () => {
	it('should be a valid object', () => {
		expect(typeof proseHeadingsStyle)
			.toBe('object')
		expect(proseHeadingsStyle).not.toBeNull()
	})

	it('should have h1 selector styles', () => {
		expect(proseHeadingsStyle)
			.toHaveProperty('$ h1')
	})

	it('should have h2 selector styles', () => {
		expect(proseHeadingsStyle)
			.toHaveProperty('$ h2')
	})

	it('should have h3 selector styles', () => {
		expect(proseHeadingsStyle)
			.toHaveProperty('$ h3')
	})

	it('should have h4 selector styles', () => {
		expect(proseHeadingsStyle)
			.toHaveProperty('$ h4')
	})
})

// ─── proseQuotesStyle ────────────────────────────────────────────────────────

describe('proseQuotesStyle', () => {
	it('should be a valid object', () => {
		expect(typeof proseQuotesStyle)
			.toBe('object')
		expect(proseQuotesStyle).not.toBeNull()
	})

	it('should have blockquote selector styles', () => {
		expect(proseQuotesStyle)
			.toHaveProperty('$ blockquote')
	})
})

// ─── proseMediaStyle ─────────────────────────────────────────────────────────

describe('proseMediaStyle', () => {
	it('should be a valid object', () => {
		expect(typeof proseMediaStyle)
			.toBe('object')
		expect(proseMediaStyle).not.toBeNull()
	})

	it('should have img selector styles', () => {
		expect(proseMediaStyle)
			.toHaveProperty('$ img')
	})

	it('should have video selector styles', () => {
		expect(proseMediaStyle)
			.toHaveProperty('$ video')
	})

	it('should have figure selector styles', () => {
		expect(proseMediaStyle)
			.toHaveProperty('$ figure')
	})
})

// ─── proseCodeStyle ──────────────────────────────────────────────────────────

describe('proseCodeStyle', () => {
	it('should be a valid object', () => {
		expect(typeof proseCodeStyle)
			.toBe('object')
		expect(proseCodeStyle).not.toBeNull()
	})

	it('should have code selector styles', () => {
		expect(proseCodeStyle)
			.toHaveProperty('$ code')
	})

	it('should have pre selector styles', () => {
		expect(proseCodeStyle)
			.toHaveProperty('$ pre')
	})
})

// ─── proseTablesStyle ────────────────────────────────────────────────────────

describe('proseTablesStyle', () => {
	it('should be a valid object', () => {
		expect(typeof proseTablesStyle)
			.toBe('object')
		expect(proseTablesStyle).not.toBeNull()
	})

	it('should have table selector styles', () => {
		expect(proseTablesStyle)
			.toHaveProperty('$ table')
	})

	it('should have thead selector styles', () => {
		expect(proseTablesStyle)
			.toHaveProperty('$ thead')
	})
})
