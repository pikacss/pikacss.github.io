<template>
	<button
		:class="pika({
			padding: '0.75rem 1rem',
			borderRadius: '0.75rem',
			backgroundColor: '#111827',
			color: 'white',
			transition: 'background-color 160ms ease',

			hover: {
				backgroundColor: '#1f2937',
			},

			'@media (min-width: 768px)': {
				padding: '0.875rem 1.25rem',
			},
		})"
	>
		Open workspace
	</button>
</template>
