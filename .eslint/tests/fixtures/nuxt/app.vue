<script setup lang="ts">
// pika is a global function injected by @pikacss/nuxt-pikacss

// Invalid: reactive
const props = defineProps<{ color: string }>()

// Valid: static
const _validStyles = pika({ color: 'red' })

const _invalidStyles = pika({ color: props.color }) // SHOULD FAIL
</script>

<template>
	<div>Nuxt PikaCSS Fixture</div>
</template>
