<script setup lang="ts">
const links = [
	{ iconClass: pika('i-mdi:home'), label: 'Home' },
	{ iconClass: pika('i-tabler:settings?mask'), label: 'Settings' },
]
</script>

<template>
	<nav>
		<a
			v-for="link in links"
			:key="link.label"
			class="inline-flex items-center gap-2"
		>
			<span :class="link.iconClass" />
			{{ link.label }}
		</a>
	</nav>
</template>
