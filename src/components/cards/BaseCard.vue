<template>
	<v-card
		:id="id"
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
import { useDebounceFn } from "@vueuse/core";
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { ID } from "@/core/model/cards";
import CardOptions from "./CardOptions.vue";

const props = defineProps<{
	id: ID;
	/**
	 * Whether this card should provide an options menu
	 */
	withOptions?: boolean;
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

const route = useRoute();

const highlight = ref(false);
const elevation = ref(1);

const id = computed(() => props.id + "-card");

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
