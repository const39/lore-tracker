<template>
	<v-card
		:elevation="highlight ? undefined : elevation"
		:draggable="draggable"
		:ripple="false"
		:class="{ draggable, highlight }"
		class="mb-4 h-100"
		fill-height
		@mouseenter="elevation++"
		@mouseleave="elevation--"
		@dragstart="($event) => $emit('dragstart', $event)"
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
import { ref } from "vue";
import CardOptions from "./CardOptions.vue";

defineProps<{
	/**
	 * Whether this card should provide an options menu
	 */
	withOptions?: boolean;
	/**
	 * Whether this card should display the highlight animation
	 */
	highlight?: boolean;
	/**
	 * Whether this card should display the draggable animation
	 */
	draggable?: boolean;
}>();

defineEmits<{
	(e: "edit"): void;
	(e: "delete"): void;
	(e: "move"): void;
	(e: "dragstart", value: DragEvent): void;
}>();

const elevation = ref(1);
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
