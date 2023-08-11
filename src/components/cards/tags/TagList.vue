<template>
	<template v-for="(list, category) in tags" :key="category">
		<div v-if="list.length" class="d-flex align-start">
			<v-icon :icon="Icon[category]" class="my-2" size="small" />
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
				<TagItem v-for="tag in list" :key="tag.id" :tag="tag" @click.stop="goToCard(tag)" />
			</div>
		</div>
	</template>
</template>

<script lang="ts" setup>
import { useRepo } from "pinia-orm";
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useCardLink } from "@/composables/cardLink";
import { Category, Tag } from "@/core/models";
import { FolderRepo, LoreEntryRepo } from "@/core/repositories";
import { Icon } from "@/core/utils/icons";
import { UUID } from "@/core/utils/types";
import TagItem from "./TagItem.vue";

defineProps<{ editable?: boolean }>();

const modelValue = defineModel<UUID[]>({ required: true }); // v-model

const router = useRouter();

const folderRepo = useRepo(FolderRepo);
const loreEntryRepo = useRepo(LoreEntryRepo);

/**
 * Create a Tag for each object whose ID is given
 */
const tags = computed(() => {
	const tagLists: Record<Category, Tag[]> = {
		quest: [],
		character: [],
		event: [],
		location: [],
		faction: [],
		note: [],
	};
	for (const id of modelValue.value) {
		const item = findItem(id);
		// If the ID matches an item (lore entry or folder), add the tag in the list of its category
		if (item) {
			tagLists[item.category].push(Tag.from(item));
		} else {
			console.error(`TagList: No item with id ${id} found.`);
		}
	}
	return tagLists;
});

function findItem(id: UUID) {
	return loreEntryRepo.find(id) ?? folderRepo.find(id);
}

/**
 * Remove the ID matching the specified Tag from the 'value' prop (if any).
 * Performs in-place removal, the prop is changed directly.
 */
function remove(tag: Tag) {
	const index = modelValue.value.indexOf(tag.id);
	if (index >= 0) modelValue.value.splice(index, 1);
}

/**
 * Navigate to the card referenced by the specified tag.
 */
function goToCard(tag: Tag) {
	const item = findItem(tag.id);
	if (item) {
		const routeParams = useCardLink(item);
		if (routeParams) {
			router.push(routeParams);
		}
	}
}
</script>
