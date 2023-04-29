import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { CardCategory, ID } from "@/core/model/cards";

export const CategoryFilter = {
	ALL: "all",
	QUEST: CardCategory.Quest,
	EVENT: CardCategory.Event,
	LOCATION: CardCategory.Location,
	CHARACTER: CardCategory.Character,
	FACTION: CardCategory.Faction,
	NOTE: CardCategory.Note,
} as const;

export type CategoryFilter = (typeof CategoryFilter)[keyof typeof CategoryFilter];

export interface Filter {
	category: CategoryFilter;
	text: string;
	tags: ID[];
}

export const useFilterStore = defineStore("filter", () => {
	const category = ref<CategoryFilter>(CategoryFilter.ALL);
	const text = ref("");
	const tags = ref<ID[]>([]);

	const isFilterActive = computed(() => {
		// Filter is active if at least one field of the filter is different from the default (blank) filter
		return category.value !== CategoryFilter.ALL || text.value.length || tags.value.length;
	});

	function $reset() {
		category.value = CategoryFilter.ALL;
		text.value = "";
		tags.value = [];
	}

	return { category, text, tags, isFilterActive, $reset };
});
