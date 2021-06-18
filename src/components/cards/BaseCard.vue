<template>
	<v-card height="100%" :outlined="outlined" :elevation="elevation" fill-height class="mb-4" @mouseenter="hover = true" @mouseleave="hover = false">
        <slot></slot>
    </v-card>
</template>

<script>
export default {
	props: {
		outlined: Boolean,
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
