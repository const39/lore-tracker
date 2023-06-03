<template>
	<v-card class="my-2 border" variant="outlined">
		<v-card-title class="d-flex">
			<span class="text-subtitle-1">{{ title }}</span>
			<v-spacer />
			<!-- 'Action' slot -->
			<slot name="action" />
		</v-card-title>
		<v-card-text v-if="isFilled">
			<!-- Default slot -->
			<slot />
		</v-card-text>
		<slot v-else name="placeholder">
			<v-card-text v-if="placeholder">
				<p class="mb-0 text-grey text-left">
					{{ placeholder }}
				</p>
			</v-card-text>
		</slot>
		<slot name="append" />
	</v-card>
</template>

<script lang="ts" setup>
defineProps<{
	title: string;
	placeholder?: string;
	isFilled: boolean;
}>();
</script>
