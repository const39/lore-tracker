import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { Folder, LoreEntry } from "@/core/models";
import { useDragAndDropMode } from "./dragAndDropMode";

type FormVariant = "add" | "edit";

interface FileFormState {
	status: "file-form";
	variant: FormVariant;
	baseModel: LoreEntry;
}

interface FolderFormState {
	status: "folder-form";
	variant: "add" | "edit";
	baseModel: Folder;
}

interface FolderTreeMoveState {
	status: "folder-tree";
	variant: "card-move";
	itemToMove: LoreEntry | Folder;
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

	function showLoreEntryForm<T extends LoreEntry>(variant: FormVariant, model: T) {
		_preventOverwrite();
		// Enable 'drop' drag and drop when form is open
		_dndStore.setMode("link");
		// Show side panel with form inside it
		state.value = {
			status: "file-form",
			variant,
			baseModel: model,
		};
	}

	function showFolderForm(variant: FormVariant, model: Folder) {
		_preventOverwrite();
		// Enable 'drop' drag and drop when form is open
		_dndStore.setMode("link");
		// Show side panel with form inside it
		state.value = {
			status: "folder-form",
			variant,
			baseModel: model,
		};
	}

	function showFolderTree(itemToMove?: LoreEntry | Folder) {
		_preventOverwrite();
		if (itemToMove) {
			state.value = {
				status: "folder-tree",
				variant: "card-move",
				itemToMove,
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

		// * Forms
		showLoreEntryForm,
		showFolderForm,

		// * File tree
		showFolderTree,
	};
});
