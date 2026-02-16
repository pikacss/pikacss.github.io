<template>
	<div>
		<!-- Basic icon -->
		<span :class="pika('i-mdi:home')" />

		<!-- Force mask mode: icon color follows text color -->
		<span
			:class="pika('i-mdi:account?mask')"
			style="color: red;"
		/>

		<!-- Force bg mode: icon keeps its original SVG colors -->
		<span :class="pika('i-mdi:palette?bg')" />
	</div>
</template>
