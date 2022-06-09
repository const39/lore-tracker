<template>
	<v-card class="my-2" outlined>
		<v-card-title class="d-flex">
			<span class=" text-subtitle-1 text--primary">{{ title }}</span>
			<v-spacer></v-spacer>
			<!-- 'Action' slot -->
			<slot name="action"></slot>
		</v-card-title>
		<v-card-text v-if="isFilled">
			<!-- Default slot -->
			<slot></slot>
		</v-card-text>
		<v-card-text v-else>
			<p class="mb-0 text--secondary">{{ emptyContentText }}</p>
		</v-card-text>
	</v-card>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
	props: {
		title: String,
		emptyContentText: String,
		isFilled: Boolean,
	},
});
</script>
