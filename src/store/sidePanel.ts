import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { getRandomColor } from "@/core/utils/colors";
import { CardCategory, CardFolder, CardTypes, ID, createCard } from "@/core/model/cards";
import utilities from "@/core/utils/functions";
import { useCardsStore } from "./cards";
import { useDragAndDropMode } from "./dragAndDropMode";

interface FileFormState {
	status: "file-form";
	variant: "add" | "edit";
	data: {
		parentFolder: CardFolder;
		baseModel: CardTypes;
	};
}

interface FolderFormState {
	status: "folder-form";
	variant: "add" | "edit";
	data: {
		parentFolder: CardFolder;
		folderToEdit: CardFolder;
	};
}

interface FolderTreeMoveState {
	status: "folder-tree";
	variant: "card-move";
	data: {
		parentFolder: CardFolder;
		itemToMove: CardTypes | CardFolder;
	};
}

interface FolderTreeNavState {
	status: "folder-tree";
	variant: "nav";
}

type FormState = FileFormState | FolderFormState;
type FolderTreeState = FolderTreeMoveState | FolderTreeNavState;

export type SidePanelState = FormState | FolderTreeState | undefined;

export const useSidePanel = defineStore("sidePanel", () => {
	const _dndStore = useDragAndDropMode();

	const state = ref<SidePanelState>();

	const isOpen = computed(() => !!state.value);

	function _preventOverwrite() {
		if (isOpen.value) throw new Error("Side panel is already open.");
	}

	function close() {
		state.value = undefined;
		_dndStore.setMode("disabled");
	}

	function newFileAddForm(category: CardCategory, inFolder: CardFolder) {
		_preventOverwrite();
		// Enable 'drop' drag and drop when form is open
		_dndStore.setMode("link");
		// Show side panel with form inside it
		state.value = {
			status: "file-form",
			variant: "add",
			data: {
				baseModel: createCard(category),
				parentFolder: inFolder,
			},
		};
	}

	function newFileEditForm(id: ID, inFolder: CardFolder) {
		_preventOverwrite();
		const cardsStore = useCardsStore();
		const data = cardsStore.findFileInFolder(id, cardsStore.currentFolder);
		if (!data)
			throw new Error(`Cannot edit card with ID ${id}. Cause: the card could not be found.`);

		// Enable 'drop' drag and drop when form is open
		_dndStore.setMode("link");
		// Show side panel with form inside it
		state.value = {
			status: "file-form",
			variant: "edit",
			data: {
				baseModel: data,
				parentFolder: inFolder,
			},
		};
	}

	function newFolderAddForm(category: CardCategory, inFolder: CardFolder) {
		_preventOverwrite();
		// Enable 'drop' drag and drop when form is open
		_dndStore.setMode("link");
		// Show side panel with form inside it
		state.value = {
			status: "folder-form",
			variant: "add",
			data: {
				folderToEdit: new CardFolder(
					{
						id: utilities.uid(),
						_category: category,
						name: "",
						color: getRandomColor(),
						tags: [],
					},
					inFolder
				),
				parentFolder: inFolder,
			},
		};
	}

	function newFolderEditForm(toEdit: CardFolder, inFolder: CardFolder) {
		_preventOverwrite();
		// Enable 'drop' drag and drop when form is open
		_dndStore.setMode("link");
		// Show side panel with form inside it
		state.value = {
			status: "folder-form",
			variant: "edit",
			data: {
				folderToEdit: toEdit,
				parentFolder: inFolder,
			},
		};
	}

	function newFolderTree(): void;
	function newFolderTree(itemToMove: CardTypes | CardFolder, inFolder: CardFolder): void;
	function newFolderTree(itemToMove?: CardTypes | CardFolder, inFolder?: CardFolder) {
		_preventOverwrite();
		if (itemToMove && inFolder) {
			state.value = {
				status: "folder-tree",
				variant: "card-move",
				data: {
					itemToMove,
					parentFolder: inFolder,
				},
			};
		} else {
			state.value = {
				status: "folder-tree",
				variant: "nav",
			};
		}
	}

	return {
		state,
		isOpen,
		close,

		// * File form
		newFileAddForm,
		newFileEditForm,

		// * Folder form
		newFolderAddForm,
		newFolderEditForm,

		// * File tree
		newFolderTree,
	};
});
