<template>
	<v-menu offset-x left open-on-hover>
		<template v-slot:activator="{ props }">
			<v-list-item v-bind="props">
				<v-list-item-icon>
					<v-icon>{{ icon }}</v-icon>
				</v-list-item-icon>
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
