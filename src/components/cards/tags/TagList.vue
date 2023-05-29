<template>
	<div class="pa-3">
		<v-row v-for="(list, category) in tags" :key="category">
			<div v-if="list.length" class="d-flex align-center">
				<v-icon :icon="Icon[category]" size="small" />
				<!-- Editable version -->
				<div v-if="editable">
					<TagItem
						v-for="tag in list"
						:key="tag.id"
						:tag="tag"
						closable
						@click:close="remove(tag)"
					/>
				</div>
				<!-- Immutable version -->
				<div v-else>
					<TagItem
						v-for="tag in list"
						:key="tag.id"
						:tag="tag"
						@click.stop="goToCard(tag)"
					/>
				</div>
			</div>
		</v-row>
	</div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { Icon } from "@/core/icons";
import { CardCategory, ID, Tag } from "@/core/model/cards";
import { useCardsStore } from "@/store/cards";
import TagItem from "./TagItem.vue";

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
const router = useRouter();

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
 * Navigate to the card referenced by the specified tag.
 */
function goToCard(tag: Tag) {
	// Find the folder hosting the card referenced by the tag
	const res = cardsStore.getCategoryFolder(tag.category).getFolderWithFile(tag.id);
	if (res) {
		// Navigate to the card's folder, passing along the card ID in the URL's hash
		router.push({
			params: {
				category: tag.category,
				folderURI: [...res.folder.absolutePath.rawSegments],
			},
			hash: `#${tag.id}-card`,
		});
	}
}

type TagsPerCategory = {
	[Category in CardCategory]: Tag[];
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
		const elem = cardsStore.findFile(id);

		// If the object is found, create a tag object from the element's data
		if (elem) {
			// Add the tag in the list of its type
			tagLists[elem._category].push(new Tag(elem));
		} else console.error(`TagList: No card with id ${id} found.`);
	}
	return tagLists;
});
</script>
