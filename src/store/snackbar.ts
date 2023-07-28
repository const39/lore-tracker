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
	location?: "bottom" | "top";
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
	/**
	 * Optional. The snackbar's location. Defaults to "bottom".
	 */
	location?: "bottom" | "top";
}

function getDefaults(): SnackbarState {
	return {
		show: false,
		message: "",
		timeout: -1,
		color: "primary",
		icon: undefined,
		location: "bottom",
	};
}

export const useGlobalSnackbar = defineStore("globalSnackbar", () => {
	const _defaults = getDefaults();
	const state = reactive(_defaults);

	function _getIcon(icon: Options["icon"], color: Options["color"]) {
		if (typeof icon === "boolean" && icon === true && isStateType(color)) {
			return Icon[color];
		} else if (typeof icon === "string" || icon === undefined) {
			return icon;
		}
	}

	function showSnackbar(options: Options) {
		const {
			message,
			timeout = _defaults.timeout,
			color = _defaults.color,
			icon,
			location = _defaults.location,
		} = options;

		state.show = true;
		state.message = message;
		state.timeout = timeout;
		state.color = color;
		state.icon = _getIcon(icon, color);
		state.location = location;
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
