<template>
	<div class="pa-3">
		<v-row v-for="(list, category) in tags" :key="category">
			<div v-if="list.length" class="d-flex align-center">
				<v-icon :icon="icons[category]" size="small" />
				<!-- Editable version -->
				<div v-if="editable">
					<v-chip
						v-for="tag in list"
						:key="tag.id"
						class="ma-1"
						size="small"
						closable
						@click:close="remove(tag)"
					>
						{{ truncate(tag.text, 30) }}
					</v-chip>
				</div>
				<!-- Immutable version -->
				<div v-else>
					<v-chip
						v-for="tag in list"
						:key="tag.id"
						class="ma-1"
						size="small"
						@click.stop="goToCard(tag)"
					>
						{{ truncate(tag.text, 30) }}
					</v-chip>
				</div>
			</div>
		</v-row>
	</div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { eventBus } from "@/js/eventBus.js";
import { CardCategory, Icon as icons, ID, Tag } from "@/js/types";
import utilities from "@/js/utilities";
import { useCardsStore } from "@/store/cards";

const props = withDefaults(
	defineProps<{
		modelValue: ID[]; // v-model
		editable?: boolean;
	}>(),
	{ editable: false }
);

const emit = defineEmits<{
	(e: "update:modelValue", value: ID[]): void;
}>();

const cardsStore = useCardsStore();

// v-model binding
const model = computed({
	get() {
		return props.modelValue;
	},
	set(value) {
		emit("update:modelValue", value);
	},
});

/**
 * Remove the ID matching the specified Tag from the 'value' prop (if any).
 * Performs in-place removal, the prop is changed directly.
 */
function remove(tag: Tag) {
	const index = model.value.indexOf(tag.id);
	if (index >= 0) model.value.splice(index, 1);
}
/**
 * Send an event to the eventBus indicating that a tag referencing a card has been clicked.
 * This event can be used by layout components to redirect the user to the according card.
 */
function goToCard(tag: Tag) {
	eventBus.emit("select-tag", tag);
}

const truncate = utilities.truncate;

type TagsPerCategory = {
	[Property in CardCategory]: Tag[];
};
/**
 * Create a Tag for each object whose ID is given
 */
const tags = computed(() => {
	const tagLists: TagsPerCategory = {
		quest: [],
		character: [],
		event: [],
		location: [],
		faction: [],
		note: [],
	};
	for (const id of model.value) {
		const elem = cardsStore.getById(id);

		// If the object is found, create a tag object from the element's data
		if (elem) {
			// Add the tag in the list of its type
			tagLists[elem._category].push(new Tag(elem));
		} else console.error(`TagList: No card with id ${id} found.`);
	}
	return tagLists;
});
</script>
