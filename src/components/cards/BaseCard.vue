<template>
	<v-card
		:elevation="highlight ? undefined : elevation"
		:draggable="isDraggable"
		:class="{ draggable: isDraggable, highlight }"
		class="mb-4"
		height="100%"
		fill-height
		@mouseenter="elevation++"
		@mouseleave="elevation--"
		@dragstart="onDragStart"
	>
		<!-- "Options" button menu (optional) -->
		<v-card-actions v-if="withOptions" class="float-right">
			<CardOptions @edit="$emit('edit')" @delete="$emit('delete')" @move="$emit('move')" />
		</v-card-actions>
		<!-- Inner content of the card -->
		<slot />
	</v-card>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import CardOptions from "./CardOptions.vue";

const props = defineProps<{
	withOptions?: boolean;
	/**
	 * Whether this card should display the highlight animation
	 */
	highlight?: boolean;
	/**
	 * Set with the transferred data if the card can be drag&dropped.
	 * If undefined, the card cannot be drag & dropped.
	 */
	draggableData?: any;
}>();

defineEmits(["edit", "delete", "move"]);

const elevation = ref(1);

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
	transition: transform 250ms ease;
}

.draggable:hover {
	transform: scale(1.02);
}

.highlight {
	animation: highlight-anim 500ms ease-in-out infinite;
}

@keyframes highlight-anim {
	from {
		box-shadow: 0 1px 2px lightgray;
	}
	to {
		box-shadow: 0 1px 6px rgb(180, 180, 180);
	}
}
</style>
