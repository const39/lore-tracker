import { defineStore } from "pinia";
import { reactive } from "vue";
import { StateTypes, isStateType } from "@/core/error";
import { Icon } from "@/core/utils/icons";

interface SnackbarState {
	show: boolean;
	message: string;
	timeout: number;
	color: StateTypes | string;
	icon?: string;
}

interface Options {
	/**
	 * The snackbar's message
	 */
	message: string;
	/**
	 * Optional. The snackbar's color
	 */
	timeout?: number;
	/**
	 * Optional. The snackbar's visibility duration (in ms). Set to -1 or leave to undefined for indefinite.
	 */
	color?: StateTypes | string;
	/**
	 * Optional. The snackbar's icon. Set to true to use the color's icon (if color is one of the {@link StateTypes}) or to a string for a custom icon.
	 */
	icon?: string | boolean;
}

function getDefaults(): SnackbarState {
	return {
		show: false,
		message: "",
		timeout: -1,
		color: "primary",
		icon: undefined,
	};
}

export const useGlobalSnackbar = defineStore("globalSnackbar", () => {
	const _defaults = getDefaults();
	const state = reactive(_defaults);

	/**
	 * Show the global snackbar.
	 *
	 * @param message The snackbar's message
	 * @param color Optional. The snackbar's color
	 * @param timeout Optional. The snackbar's visibility duration (in ms). Set to -1 or leave to undefined for indefinite.
	 * @param icon Optional. The snackbar's icon. Set to true to use the color's icon (if color is one of the {@link StateTypes}) or to a string for a custom icon.
	 */
	function showSnackbar(
		message: string,
		color?: StateTypes | string,
		timeout?: number,
		icon?: string | boolean
	): void;

	/**
	 * Show the global snackbar.
	 */
	function showSnackbar(options: Options): void;

	// Function implementation
	function showSnackbar(
		messageOrOptions: string | Options,
		color?: StateTypes | string,
		timeout?: number,
		icon: string | boolean = true
	): void {
		if (typeof messageOrOptions === "object") {
			const { message, color, timeout, icon } = messageOrOptions;
			showSnackbar(message, color, timeout, icon);
		} else {
			state.show = true;
			state.message = messageOrOptions;
			state.color = color ?? _defaults.color;
			state.timeout = timeout ?? _defaults.timeout;
			if (typeof icon === "boolean" && icon === true && isStateType(color)) {
				state.icon = Icon[color];
			} else if (typeof icon === "string" || icon === undefined) {
				state.icon = icon;
			}
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
