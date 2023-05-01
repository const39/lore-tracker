import { defineStore } from "pinia";
import { reactive } from "vue";

interface SnackbarState {
	show: boolean;
	message: string;
	timeout: number;
	color: string;
}

interface Options {
	message: string;
	timeout?: number;
	color?: string;
}

function getDefaults(): SnackbarState {
	return {
		show: false,
		message: "",
		timeout: -1,
		color: "primary",
	};
}

export const useGlobalSnackbar = defineStore("globalSnackbar", () => {
	const _defaults = getDefaults();
	const state = reactive(_defaults);

	function showSnackbar(message: string, color?: string, timeout?: number): void;
	function showSnackbar(options: Options): void;
	function showSnackbar(
		messageOrOptions: string | Options,
		color?: string,
		timeout?: number
	): void {
		if (typeof messageOrOptions === "object") {
			const { message, color, timeout } = messageOrOptions;
			showSnackbar(message, color, timeout);
		} else {
			state.show = true;
			state.message = messageOrOptions;
			state.color = color ?? _defaults.color;
			state.timeout = timeout ?? _defaults.timeout;
		}
	}

	function closeSnackbar() {
		state.show = false;
	}

	return {
		state,
		showSnackbar,
		closeSnackbar,
	};
});
