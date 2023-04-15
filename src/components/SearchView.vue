<template>
	<div>
		<v-btn prepend-icon="mdi-magnify" @click="open = !open">
			{{ $t("search.search") }}
		</v-btn>
		<v-navigation-drawer v-if="open" location="right" width="320" class="pa-2">
			<v-row class="d-flex mx-2 my-5">
				<span class="text-h5">{{ $t("search.search") }}</span>
				<v-spacer />
				<v-btn
					variant="text"
					density="comfortable"
					icon="mdi-close"
					@click="open = false"
				/>
			</v-row>
			<v-list-subheader>{{ $t("fields.category") }}</v-list-subheader>
			<v-select
				v-model="selectedCategory"
				:items="categories"
				variant="outlined"
				density="compact"
				class="mx-2"
			>
				<template #selection="{ props, item }">
					<v-list-item
						v-bind="props"
						:prepend-icon="icons[item.raw as keyof typeof icons]"
						:title="$t(`categories.${item.raw}`)"
					/>
				</template>
				<template #item="{ props, item }">
					<v-list-item
						v-bind="props"
						:prepend-icon="icons[item.raw as keyof typeof icons]"
						:title="$t(`categories.${item.raw}`)"
					/>
				</template>
			</v-select>
			<v-list-subheader>{{ $t("search.containing") }}</v-list-subheader>
			<v-textarea v-model="textToContain" variant="outlined" density="compact" class="mx-2" />
			<v-list-subheader>{{ $t("search.taggedWith") }}</v-list-subheader>
			<TagListPanel v-model="selectedTags" class="mx-2" />
			<span class="mx-2 text-grey text-caption">{{
				resultsNumber + $t("search.cardsMatching")
			}}</span>
			<br>
			<span class="mx-2 text-grey text-caption">{{ $t("search.sortDisabled") }}</span>
		</v-navigation-drawer>
	</div>
</template>

<script lang="ts" setup>
import { t as $t } from "@/js/translation";
import { CategoryFilter, Icon as icons } from "@/js/types";
import { useCardsStore } from "@/store/cards";
import { useFilterStore } from "@/store/filter";
import { onKeyDown } from "@vueuse/core";
import { computed, ref, watch } from "vue";
import TagListPanel from "./cards/tags/TagListPanel.vue";

const open = ref(false);
const categories = ref(Object.values(CategoryFilter));
const selectedCategory = ref<CategoryFilter>(CategoryFilter.ALL);
const textToContain = ref("");
const selectedTags = ref([]);

const filterStore = useFilterStore();
const cardsStore = useCardsStore();

function search() {
	filterStore.category = selectedCategory.value;
	filterStore.text = textToContain.value;
	filterStore.tags = selectedTags.value;
}

// Register hotkeys
onKeyDown(["k", "K"], hotkey);

/**
 * Open/close the Search view when pressing Ctrl+K
 */
function hotkey(e: KeyboardEvent) {
	if (e.ctrlKey) open.value = !open.value;
}

const resultsNumber = computed(() => {
	let count = 0;
	const cards = cardsStore.filteredCards;
	for (const key in cards) count += cards[key as keyof typeof cards].length;
	return count;
});

/**
 * Reset filter once the search view is closed
 */
watch(open, (newValue) => {
	if (!newValue) {
		selectedCategory.value = CategoryFilter.ALL;
		textToContain.value = "";
		selectedTags.value = [];
		filterStore.$reset();
	}
});

/**
 * Trigger search as soon as a field changes
 */
watch([selectedCategory, textToContain, selectedTags], () => search());
</script>
