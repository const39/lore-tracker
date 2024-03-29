<template>
	<v-card-actions class="float-right">
		<v-btn icon="mdi-close" density="comfortable" @click="$emit('close')" />
	</v-card-actions>
	<v-card-title class="mb-1 text-truncate">
		{{ $t("pages.loreBook.sidePanel.relatedCards") }}
		<TagItem :tag="Tag.from(relatedTo)" show-icon @click="goToSourceCard" />
	</v-card-title>
	<v-list v-if="relatedCardsCount" v-model:opened="openCategories" density="compact">
		<v-list-group v-for="category in categories" :key="category" :value="category">
			<template v-if="relatedCards[category]?.length" #activator="{ props: activatorProps }">
				<v-list-item v-bind="activatorProps">
					<v-icon :icon="Icon[category]" size="small" start />
					{{ $t(`data.categories.${category}`, 2) }}
				</v-list-item>
			</template>
			<v-list-item
				v-for="card in relatedCards[category]"
				:key="card.id"
				:to="useCardLink(card)"
				@click="$emit('submit')"
			>
				<v-list-item-title class="marquee">
					<span>{{ card.getText() }}</span>
				</v-list-item-title>
			</v-list-item>
		</v-list-group>
	</v-list>
	<v-card-text v-else>
		{{ $t("pages.loreBook.sidePanel.noRelatedCards") }}
	</v-card-text>
</template>

<script lang="ts" setup>
import { useRepo } from "pinia-orm";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import TagItem from "@/components/cards/tags/TagItem.vue";
import { useCardLink } from "@/composables/cardLink";
import { Category, Folder, LoreEntry, Tag } from "@/core/models";
import { FolderRepo, LoreEntryRepo } from "@/core/repositories";
import { t as $t } from "@/core/translation";
import Icon from "@/core/utils/icons";
import { UUID } from "@/core/utils/types";

const props = defineProps<{
	relatedTo: LoreEntry | Folder;
}>();

defineEmits(["close", "submit"]);

const categories = Object.values(Category);
const router = useRouter();

const openCategories = ref(categories);

// Type cast necessary in both computed properties because the .get() return type does not account for the 'groupBy' query method
const relatedEntries = computed(() => {
	return useRepo(LoreEntryRepo)
		.where("tags", (tags: UUID[]) => tags.includes(props.relatedTo.id))
		.groupBy("category")
		.get() as unknown as Record<Category, LoreEntry[]>;
});

const relatedFolders = computed(() => {
	return useRepo(FolderRepo)
		.where("tags", (tags: UUID[]) => tags.includes(props.relatedTo.id))
		.groupBy("category")
		.get() as unknown as Record<Category, Folder[]>;
});

const relatedCards = computed(() => {
	const groupedByCategory = {} as Record<Category, Array<LoreEntry | Folder>>;

	// Merge related folders and entries
	for (const category of categories) {
		// Default to empty array when there is no item for the current category
		const folders = relatedFolders.value[category] ?? [];
		const entries = relatedEntries.value[category] ?? [];
		groupedByCategory[category] = [...folders, ...entries];
	}
	return groupedByCategory;
});

const relatedCardsCount = computed(() => {
	return Object.values(relatedCards.value).reduce((sum, entries) => {
		sum += entries?.length;
		return sum;
	}, 0);
});

function goToSourceCard() {
	const routeParams = useCardLink(props.relatedTo);
	if (routeParams) router.push(routeParams);
}
</script>
