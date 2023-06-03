import { defineStore } from "pinia";
import { reactive } from "vue";

interface ConfirmDialogState {
	show: boolean;
	title: string;
	message: string;
	confirmAction?: () => void;
	cancelAction?: () => void;
}

interface Options {
	title: string;
	message: string;
	confirmAction?: () => void;
	cancelAction?: () => void;
}

function getDefaults(): ConfirmDialogState {
	return {
		show: false,
		title: "",
		message: "",
	};
}

export const useGlobalConfirmDialog = defineStore("globalConfirmDialog", () => {
	const _defaults = getDefaults();
	const state = reactive(_defaults);

	function showConfirmDialog(options: Options): void {
		state.show = true;
		state.title = options.title;
		state.message = options.message;
		state.confirmAction = options.confirmAction;
		state.cancelAction = options.cancelAction;
	}

	function closeConfirmDialog(): void {
		state.show = false;
	}

	function confirm() {
		state.confirmAction?.();
		closeConfirmDialog();
	}

	function cancel() {
		state.cancelAction?.();
		closeConfirmDialog();
	}

	return {
		state,
		showConfirmDialog,
		closeConfirmDialog,
		confirm,
		cancel,
	};
});
