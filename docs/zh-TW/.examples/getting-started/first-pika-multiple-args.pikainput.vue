<template>
	<button
		:class="pika(
			{
				display: 'inline-flex',
				alignItems: 'center',
				justifyContent: 'center',
				gap: '0.5rem',
				padding: '0.75rem 1rem',
				borderRadius: '9999px',
				border: 'none',
				cursor: 'pointer',
			},
			{
				backgroundColor: '#0ea5e9',
				color: 'white',
			},
			{
				fontSize: '0.875rem',
			},
		)"
	>
		Publish changes
	</button>
</template>
