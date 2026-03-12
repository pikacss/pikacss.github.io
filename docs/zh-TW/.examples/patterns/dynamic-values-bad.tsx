interface MeterProps {
	progress: number
	accent: string
}

export function Meter({ progress, accent }: MeterProps) {
	return (
		<div
			className={pika({
				width: `${progress}%`,
				backgroundColor: accent,
			})}
		/>
	)
}
