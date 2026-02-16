<template>
	<!-- pika() accepts multiple arguments (StyleItem[]) -->
	<!-- Each argument can be a string (shortcut) or a style object -->
	<div
		:class="pika(
			'my-shortcut',
			{
				fontSize: '1.5rem',
				color: '#333',
			},
		)"
	>
		Combining shortcuts and inline styles
	</div>
</template>
