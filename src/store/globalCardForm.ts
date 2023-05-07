import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import { CardCategory, CardFolder, CardTypes, ID, createCard } from "@/core/model/cards";
import utilities from "@/core/utilities";
import { useCardsStore } from "./cards";
import { usePreferencesStore } from "./preferences";

export type FormVariant = "edit" | "add";

export const useGlobalCardForm = defineStore("globalCardForm", () => {
	const variant = ref<FormVariant>("add");
	const parentFolder = ref<CardFolder>();
	const model = ref<CardTypes>();

	const isOpen = computed(() => model.value !== undefined);

	// Enable 'drop' drag and drop when form is open
	const prefStore = usePreferencesStore();
	watch(isOpen, (value) => (prefStore.dragAndDropMode = value ? "drop" : "disabled"));

	function newAddForm(category: CardCategory, inFolder: CardFolder) {
		variant.value = "add";
		parentFolder.value = inFolder;
		model.value = createCard(category);
	}

	function newEditForm(id: ID, inFolder: CardFolder) {
		variant.value = "edit";
		parentFolder.value = inFolder;

		const cardsStore = useCardsStore();
		const data = cardsStore.findFileInCurrentFolder(id);

		// Clone object to keep a backup in case the user cancels their changes
		if (data) model.value = utilities.deepCopy(data) as CardTypes;
	}

	function resetForm() {
		model.value = undefined;
	}

	return {
		variant,
		parentFolder,
		model,

		isOpen,

		newAddForm,
		newEditForm,
		resetForm,
	};
});
