<template>
	<v-card
		:elevation="elevation"
		:draggable="isDraggable"
		:class="{ draggable: isDraggable }"
		class="mb-4"
		height="100%"
		fill-height
		@mouseenter="elevation = 1"
		@mouseleave="elevation = 0"
		@dragstart="onDragStart"
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
import { CardTypes } from "@/core/model/cards";
import CardOptions from "./CardOptions.vue";

const props = defineProps<{
	withOptions?: boolean;
	/**
	 * Set with the transferred data if the card can be drag&dropped.
	 * If undefined, the card cannot be drag & dropped.
	 */
	draggableData?: CardTypes;
}>();

defineEmits(["edit", "delete"]);

const elevation = ref(0);

const isDraggable = computed(() => !!props.draggableData);

/**
 * Callback triggered when the user grabs the cards for a drag & drop
 */
function onDragStart(e: DragEvent) {
	if (props.draggableData)
		e.dataTransfer?.setData("application/card-type", JSON.stringify(props.draggableData));
}
</script>
<style scoped>
.draggable {
	cursor: grab;
}
</style>
