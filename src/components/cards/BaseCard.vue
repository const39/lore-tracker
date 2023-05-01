<template>
	<v-card
		:variant="outlined ? 'outlined' : 'elevated'"
		:elevation="elevation"
		height="100%"
		class="mb-4"
		fill-height
		@mouseenter="hover = true"
		@mouseleave="hover = false"
	>
		<!-- "Options" button menu (optional) -->
		<v-card-actions v-if="withOptions" class="float-right">
			<CardOptions @edit="$emit('edit')" @delete="$emit('delete')" />
		</v-card-actions>
		<!-- Inner content of the card -->
		<slot />
	</v-card>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import CardOptions from "./CardOptions.vue";

const props = defineProps<{
	outlined?: boolean;
	withOptions?: boolean;
}>();

defineEmits(["edit", "delete"]);

const hover = ref(false);
const elevation = computed(() => {
	let elevation = props.outlined ? 0 : 1;
	if (hover.value) elevation++;
	return elevation;
});
</script>
