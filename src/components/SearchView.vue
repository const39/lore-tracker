<template>
	<div>
		<v-btn @click="open = !open">
			<v-icon>mdi-magnify</v-icon>
			{{ $t("search.search") }}
		</v-btn>
		<v-navigation-drawer v-if="open" app right width="320" class="pa-2">
			<v-row class="d-flex mx-2 my-5">
				<span class="text-h5 text--primary">{{ $t("search.search") }}</span>
				<v-spacer></v-spacer>
				<v-btn icon @click="open = false">
					<v-icon>mdi-close</v-icon>
				</v-btn>
			</v-row>
			<v-subheader>{{ $t("fields.category") }}</v-subheader>
			<v-select outlined dense class="mx-2" v-model="selectedCategory" :items="categories">
				<template v-slot:selection="{ item }">
					<v-icon left small> {{ icons[item] }} </v-icon>
					{{ $t(`categories.${item}`) }}
				</template>
				<template v-slot:item="{ item }">
					<v-icon left small> {{ icons[item] }} </v-icon>
					{{ $t(`categories.${item}`) }}
				</template>
			</v-select>
			<v-subheader>{{ $t("search.containing") }}</v-subheader>
			<v-textarea outlined dense class="mx-2" v-model="textToContain"></v-textarea>
			<v-subheader>{{ $t("search.taggedWith") }}</v-subheader>
			<TagListPanel class="mx-2" v-model="selectedTags" />
			<span class="mx-2 grey--text text-caption">{{ resultsNumber + $t("search.cardsMatching") }}</span>
			<br />
			<span class="mx-2 grey--text text-caption">{{ $t("search.sortDisabled") }}</span>
		</v-navigation-drawer>
	</div>
</template>

<script lang="ts" setup>
import { t as $t } from "@/js/translation";
import { CategoryFilter, Icon as icons } from "@/js/types";
import { useStore } from "@/store";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import TagListPanel from "./cards/tags/TagListPanel.vue";

const open = ref(false);
const categories = ref(Object.values(CategoryFilter));
const selectedCategory = ref<CategoryFilter>(CategoryFilter.ALL);
const textToContain = ref("");
const selectedTags = ref([]);

const store = useStore();

function search() {
	store.updateFilter({
		category: selectedCategory.value,
		text: textToContain.value,
		tags: selectedTags.value,
	});
}

/**
 * Open/close the Search view when pressing Ctrl+K
 */
function hotkey(e: KeyboardEvent) {
	if (e.code === "KeyK" && e.ctrlKey) open.value = !open.value;
}

const style = computed(() => {
	return open.value ? "display: block;" : "display: none;";
});

const resultsNumber = computed(() => {
	let count = 0;
	const cards = store.getCards;
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
		store.resetFilter();
	}
});

/**
 * Trigger search as soon as a field changes
 */
watch([selectedCategory, textToContain, selectedTags], () => search());

onMounted(() => {
	document.addEventListener("keydown", hotkey);
});

onBeforeUnmount(() => {
	document.removeEventListener("keydown", hotkey);
});
</script>
