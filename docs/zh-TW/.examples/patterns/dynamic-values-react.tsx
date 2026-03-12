import type { CSSProperties } from 'react'

interface ProgressBarProps {
	value: number
	color: string
}

const progressBar = pika({
	width: 'var(--progress-width)',
	backgroundColor: 'var(--progress-color)',
	height: '0.5rem',
	borderRadius: '9999px',
})

export function ProgressBar({ value, color }: ProgressBarProps) {
	return (
		<div
			className={progressBar}
			style={{
				'--progress-width': `${value}%`,
				'--progress-color': color,
			} as CSSProperties}
		/>
	)
}
