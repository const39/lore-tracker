import { defineStore } from "pinia";
import { useRepo } from "pinia-orm";
import { computed, ref } from "vue";
import { Category, Describable } from "@/core/models";
import { FolderRepo, LoreEntryRepo } from "@/core/repositories";

export interface Filter {
	text?: string;
}

export const useFilterStore = defineStore("filter", () => {
	const rules = ref<Filter>({});

	const isFilterActive = computed(() => !!rules.value.text?.trim());

	function _getPredicate(item: Describable) {
		let predicate = true;
		if (rules.value.text) {
			const str = rules.value.text;
			predicate &&= item.getAllText().some((text) => text.toLowerCase().includes(str));
		}
		return predicate;
	}

	function filterLoreEntries(category: Category) {
		return useRepo(LoreEntryRepo).where("category", category).get().filter(_getPredicate);
	}

	function filterFolders(category: Category) {
		return useRepo(FolderRepo).where("category", category).get().filter(_getPredicate);
	}

	function $reset() {
		rules.value = {};
	}

	return { rules, isFilterActive, filterLoreEntries, filterFolders, $reset };
});
