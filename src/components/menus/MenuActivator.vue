<template>
	<v-menu :open-delay="0" :close-delay="0" location="left" open-on-hover>
		<template #activator="{ props }">
			<v-list-item v-bind="props" :prepend-icon="icon">
				<v-list-item-title>{{ title }}</v-list-item-title>
			</v-list-item>
		</template>
		<slot />
	</v-menu>
</template>

<script lang="ts" setup>
defineProps<{
	title: string;
	icon?: string; // Optional icon
}>();
</script>
