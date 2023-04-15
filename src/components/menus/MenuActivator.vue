<template>
	<v-menu location="left" open-on-hover :open-delay="0" :close-delay="0">
		<template v-slot:activator="{ props }">
			<v-list-item v-bind="props" :prepend-icon="icon">
				<v-list-item-title>{{ title }}</v-list-item-title>
			</v-list-item>
		</template>
		<slot></slot>
	</v-menu>
</template>

<script lang="ts" setup>
defineProps<{
	title: string;
	icon?: string; // Optional icon
}>();
</script>
