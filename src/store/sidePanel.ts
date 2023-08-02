import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { Folder, LoreEntry } from "@/core/models";

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

interface RelatedCardsState {
	status: "related-cards";
	relatedTo: LoreEntry | Folder;
}

type FormState = FileFormState | FolderFormState;
type FolderTreeState = FolderTreeMoveState | FolderTreeNavState;

export type SidePanelState = FormState | FolderTreeState | RelatedCardsState | undefined;

export const useSidePanel = defineStore("sidePanel", () => {
	const state = ref<SidePanelState>();

	const isOpen = computed(() => !!state.value);

	function _preventOverwrite() {
		if (isOpen.value) throw new Error("Side panel is already open.");
	}

	function close() {
		state.value = undefined;
	}

	function showLoreEntryForm<T extends LoreEntry>(variant: FormVariant, model: T) {
		_preventOverwrite();
		// Show side panel with form inside it
		state.value = {
			status: "file-form",
			variant,
			baseModel: model,
		};
	}

	function showFolderForm(variant: FormVariant, model: Folder) {
		_preventOverwrite();
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

	function showRelatedCards(relatedTo: LoreEntry | Folder) {
		_preventOverwrite();
		state.value = {
			status: "related-cards",
			relatedTo,
		};
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

		// * Related cards
		showRelatedCards,
	};
});
