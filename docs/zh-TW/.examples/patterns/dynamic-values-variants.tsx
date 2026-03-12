import type { CSSProperties } from 'react'

type BadgeVariant = 'solid' | 'outline'

const badgeClassNames = {
	solid: pika({
		backgroundColor: 'var(--badge-color)',
		color: 'white',
		border: '1px solid var(--badge-color)',
	}),
	outline: pika({
		border: '1px solid var(--badge-color)',
		color: 'var(--badge-color)',
		backgroundColor: 'transparent',
	}),
} satisfies Record<BadgeVariant, string>

interface BadgeProps {
	variant: BadgeVariant
	color: string
}

function Badge({ variant, color }: BadgeProps) {
	return (
		<span
			className={badgeClassNames[variant]}
			style={{ '--badge-color': color } as CSSProperties}
		/>
	)
}
