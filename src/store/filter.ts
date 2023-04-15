import { CategoryFilter, ID } from "@/js/types";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

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
