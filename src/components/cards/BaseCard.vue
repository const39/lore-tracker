<template>
	<v-card height="100%" :outlined="outlined" :elevation="elevation" fill-height class="mb-4" @mouseenter="hover = true" @mouseleave="hover = false" @dblclick="$emit('edit')">
		<!-- "Options" button menu (optional) -->
		<v-card-actions v-if="withOptions" class="float-right">
			<CardOptions @edit="$emit('edit')" @delete="$emit('delete')" />
		</v-card-actions>
		<!-- Inner content of the card -->
		<slot></slot>
    </v-card>
</template>

<script>
import CardOptions from "./CardOptions.vue";

export default {
	components: {
		CardOptions
	},
	props: {
		outlined: Boolean,
		withOptions: Boolean
	},
	data() {
		return {
			hover: false,
		};
	},
	computed: {
		elevation() {
			let elevation = this.outlined ? 0 : 1;
			if (this.hover) elevation++;

			return elevation;
		},
	},
};
</script>

<style></style>
