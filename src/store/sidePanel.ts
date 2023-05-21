import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { CardCategory, CardFolder, CardTypes, ID, createCard } from "@/core/model/cards";
import utilities from "@/core/utilities";
import { useCardsStore } from "./cards";
import { usePreferencesStore } from "./preferences";

export type FormVariant = "edit" | "add";
export type FolderTreeVariant = "card-move" | "nav";
export type SidePanel = "closed" | "form" | "folder-tree";

export const useSidePanel = defineStore("sidePanel", () => {
	const _prefStore = usePreferencesStore();

	const formState = reactive({
		variant: ref<FormVariant>("add"),
		parentFolder: ref<CardFolder>(),
		model: ref<CardTypes>(),
	});

	const folderTreeState = reactive({
		variant: ref<FolderTreeVariant>("nav"),
		parentFolder: ref<CardFolder>(),
		itemToMove: ref<CardTypes | CardFolder>(),
	});

	const sidePanelStatus = ref<SidePanel>("closed");

	function _resetSidePanel() {
		sidePanelStatus.value = "closed";
		_prefStore.dragAndDropMode = "disabled";
	}

	function _showForm() {
		// Show side panel with form inside it
		sidePanelStatus.value = "form";
		// Enable 'drop' drag and drop when form is open
		_prefStore.dragAndDropMode = "drop";
	}

	function newAddForm(category: CardCategory, inFolder: CardFolder) {
		formState.variant = "add";
		formState.parentFolder = inFolder;
		formState.model = createCard(category);
		_showForm();
	}

	function newEditForm(id: ID, inFolder: CardFolder) {
		formState.variant = "edit";
		formState.parentFolder = inFolder;

		const cardsStore = useCardsStore();
		const data = cardsStore.findFileInFolder(id, cardsStore.currentFolder);

		// Clone object to keep a backup in case the user cancels their changes
		if (data) formState.model = utilities.deepCopy(data) as CardTypes;
		_showForm();
	}

	function resetForm() {
		formState.model = undefined;
		formState.parentFolder = undefined;
		_resetSidePanel();
	}

	function newFolderTree(): void;
	function newFolderTree(itemToMove: CardTypes | CardFolder, inFolder: CardFolder): void;
	function newFolderTree(itemToMove?: CardTypes | CardFolder, inFolder?: CardFolder) {
		if (itemToMove && inFolder) {
			folderTreeState.itemToMove = itemToMove;
			folderTreeState.parentFolder = inFolder;
			folderTreeState.variant = "card-move";
		} else {
			folderTreeState.variant = "nav";
		}
		sidePanelStatus.value = "folder-tree";
	}

	function resetFolderTree() {
		folderTreeState.itemToMove = undefined;
		folderTreeState.parentFolder = undefined;
		_resetSidePanel();
	}

	return {
		sidePanelStatus,

		// * Form
		// State
		formState,
		// Actions
		newAddForm,
		newEditForm,
		resetForm,

		// * File tree
		// State
		folderTreeState,
		// Actions
		newFolderTree,
		resetFolderTree,
	};
});
