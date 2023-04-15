<template>
	<v-card class="my-2 border" variant="outlined">
		<v-card-title class="d-flex">
			<span class="text-subtitle-1">{{ title }}</span>
			<v-spacer></v-spacer>
			<!-- 'Action' slot -->
			<slot name="action"></slot>
		</v-card-title>
		<v-card-text v-if="isFilled">
			<!-- Default slot -->
			<slot></slot>
		</v-card-text>
		<v-card-text v-else>
			<p class="mb-0 text-grey text-left">{{ emptyContentText }}</p>
		</v-card-text>
	</v-card>
</template>

<script lang="ts" setup>
defineProps<{
	title: string;
	emptyContentText: string;
	isFilled: boolean;
}>();
</script>
