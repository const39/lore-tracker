import { reactive } from "vue";

interface AlertState {
	isShown: boolean;
	type: AlertTypes;
	title: string;
	text?: string;
}

export type AlertTypes = "success" | "error" | "warning" | "info";

export function useAlert() {
	const alertState = reactive<AlertState>({
		isShown: false,
		type: "info",
		title: "",
	});

	function resetAlert() {
		alertState.isShown = false;
		alertState.type = "info";
		alertState.title = "";
		alertState.text = undefined;
	}

	function setAlert(type: AlertTypes, title: string, text?: string) {
		alertState.isShown = true;
		alertState.type = type;
		alertState.title = title;
		alertState.text = text;
	}

	function setSuccess(title: string, text?: string) {
		setAlert("success", title, text);
	}

	function setError(title: string, text?: string) {
		setAlert("error", title, text);
	}

	function setWarning(title: string, text?: string) {
		setAlert("warning", title, text);
	}

	function setInfo(title: string, text?: string) {
		setAlert("info", title, text);
	}

	return {
		alertState,

		resetAlert,
		setAlert,
		setSuccess,
		setError,
		setWarning,
		setInfo,
	};
}
