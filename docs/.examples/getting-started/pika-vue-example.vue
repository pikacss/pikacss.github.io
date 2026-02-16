<script setup lang="ts">
// No import needed — `pika` is a global function
// provided by the build plugin.
</script>

<template>
	<button
		:class="pika({
			'padding': '0.5em 1em',
			'borderRadius': '0.25em',
			'border': 'none',
			'backgroundColor': 'var(--color-primary)',
			'color': 'white',
			'cursor': 'pointer',
			':hover': {
				transform: 'scale(1.05)',
			},
		})"
	>
		Click me
	</button>
</template>
