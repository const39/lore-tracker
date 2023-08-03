import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { Folder, LoreEntry } from "@/core/models";
import { t as $t } from "@/core/translation";
import { useGlobalSnackbar } from "./snackbar";

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
	const _snackbar = useGlobalSnackbar();

	const state = ref<SidePanelState>();

	const isOpen = computed(() => !!state.value);

	function _preventOverwrite() {
		if (state.value?.status === "file-form" || state.value?.status === "folder-form") {
			_snackbar.showSnackbar({
				message: $t("messages.errors.sidePanel.formAlreadyOpen.title"),
				color: "error",
				timeout: 5000,
			});
			throw new Error("Cannot open side panel: form already open.");
		}
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
