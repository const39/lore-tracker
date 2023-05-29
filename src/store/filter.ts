import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { CardFolder, CardFolderMetadata, CardTypes, getAllText } from "@/core/model/cards";
import utilities from "@/core/utilities";

export interface Filter {
	text?: string;
}

export const useFilterStore = defineStore("filter", () => {
	const rules = ref<Filter>({});

	const isFilterActive = computed(() => !!rules.value.text?.trim());

	function _getItemPredicate(item: CardTypes | CardFolder) {
		let predicate = true;
		if (rules.value.text) {
			const str = rules.value.text;
			predicate &&= getAllText(item).some((text) => text.toLowerCase().includes(str));
		}
		return predicate;
	}

	function filter(toFilter: CardFolder) {
		const filteredFiles = toFilter.files.filter((item) => _getItemPredicate(item));

		const filteredFolders = toFilter.subfolders.filter((item) => _getItemPredicate(item));

		const meta: CardFolderMetadata = {
			id: utilities.uid(),
			_category: toFilter.metadata._category,
			color: "#ffffff",
			name: "search-results",
		};
		return new CardFolder(meta, undefined, filteredFiles, filteredFolders);
	}

	function $reset() {
		rules.value = {};
	}

	return { rules, isFilterActive, filter, $reset };
});
