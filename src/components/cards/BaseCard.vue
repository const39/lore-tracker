<template>
	<v-card
		:id="id"
		:elevation="elevation"
		:draggable="draggable"
		:ripple="false"
		:class="{ draggable, highlight, selected }"
		class="mb-4 h-100"
		fill-height
		@mouseenter="hovered = true"
		@mouseleave="hovered = false"
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
import { useDebounceFn } from "@vueuse/core";
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { UUID } from "@/core/utils/types";
import CardOptions from "./CardOptions.vue";

const props = defineProps<{
	id: UUID;
	/**
	 * Whether this card should provide an options menu
	 */
	withOptions?: boolean;
	/**
	 * If selected, this card displays a selection style.
	 */
	selected?: boolean;
	/**
	 * If draggable, this card can emit the 'dragstart' event and display the drag animation.
	 */
	draggable?: boolean;
}>();

const emit = defineEmits<{
	(e: "edit"): void;
	(e: "delete"): void;
	(e: "move"): void;
	(e: "dragstart", value: DragEvent): void;
}>();

const route = useRoute();

const hovered = ref(false);
const highlight = ref(false);

const elevation = computed(() => {
	let n = 1;
	if (hovered.value) n++;
	if (props.selected) n++;
	return n;
});

const id = computed(() => props.id + "-card");

function onDragStart(e: DragEvent) {
	if (props.draggable) emit("dragstart", e);
}

/**
 * Scroll this card into view if the URL's hash contains its ID.
 * This function is debounced to only trigger after a certain delay and avoid multiple calls in rapid succession.
 */
const scrollIntoViewIfSelected = useDebounceFn(() => {
	if (route.hash === `#${id.value}`) {
		// Find the card's underlying DOM element to scroll it into view
		const el = document.querySelector(`[id="${id.value}"]`);
		el?.scrollIntoView({ behavior: "smooth", block: "center" });

		// Highlight the selected card for 3s
		highlight.value = true;
		setTimeout(() => (highlight.value = false), 3000);
	}
}, 700);

watch(
	() => route.hash,
	() => scrollIntoViewIfSelected(),
	{ immediate: true }
);
</script>
<style scoped>
:not(.draggable) {
	cursor: default;
}

.draggable {
	cursor: grab;
	transition: transform 250ms ease;
}

.selected {
	border: 1px solid lightgray;
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
