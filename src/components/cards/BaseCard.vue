<template>
	<v-card
		height="100%"
		:outlined="outlined"
		:elevation="elevation"
		fill-height
		class="mb-4"
		@mouseenter="hover = true"
		@mouseleave="hover = false"
		@dblclick="$emit('edit')"
	>
		<!-- "Options" button menu (optional) -->
		<v-card-actions v-if="withOptions" class="float-right">
			<CardOptions @edit="$emit('edit')" @delete="$emit('delete')" />
		</v-card-actions>
		<!-- Inner content of the card -->
		<slot></slot>
	</v-card>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import CardOptions from "./CardOptions.vue";

const props = defineProps<{
	outlined?: boolean;
	withOptions?: boolean;
}>();

const hover = ref(false);
const elevation = () => {
	let elevation = props.outlined ? 0 : 1;
	if (hover.value) elevation++;
	return elevation;
};
</script>

<style></style>
