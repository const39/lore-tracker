<template>
	<div class="pa-3">
		<v-row v-for="(list, category) in tags" :key="category">
			<div v-if="list.length" class="d-flex align-center">
				<v-icon size="small">{{ icons[category] }}</v-icon>
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
import { useEventHub, TagEvent } from "@/js/eventHub";
import { CardCategory, Icon as icons, ID, Tag } from "@/js/types";
import utilities from "@/js/utilities";
import { useStore } from "@/store";
import { computed } from "vue";

const props = withDefaults(
	defineProps<{
		// Override default v-model
		modelValue: ID[];
		editable?: boolean;
	}>(),
	{ editable: false }
);

const store = useStore();
const eventHub = useEventHub();

/**
 * Remove the ID matching the specified Tag from the 'value' prop (if any).
 * Performs in-place removal, the prop is changed directly.
 */
function remove(tag: Tag) {
	const index = props.modelValue.indexOf(tag.id);
	if (index >= 0) props.modelValue.splice(index, 1);
}
/**
 * Send an event to the eventHub indicating that a tag referencing a card has been clicked.
 * This event can be used by layout components to redirect the user to the according card.
 */
function goToCard(tag: Tag) {
	eventHub.emit(TagEvent.ID, new TagEvent(tag));
}

const truncate = utilities.truncate;

type TagsPerCategory = {
	[Property in CardCategory]: Tag[];
};
/**
 * Create a Tag for each object whose ID is given
 */
const tags = computed(() => {
	let tagLists: TagsPerCategory = {
		quest: [],
		character: [],
		event: [],
		location: [],
		faction: [],
		note: [],
	};
	for (const id of props.modelValue) {
		const elem = store.getById(id);

		// If the object is found, create a tag object from the element's data
		if (elem) {
			// Add the tag in the list of its type
			tagLists[elem._category].push(new Tag(elem));
		} else console.error(`TagList: No card with id ${id} found.`);
	}
	return tagLists;
});
</script>

<style></style>
