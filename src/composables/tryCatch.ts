import { isLocalisableError } from "@/core/error";
import { t as $t } from "@/core/translation/translation";
import { useGlobalSnackbar } from "@/store/snackbar";

export function useTryCatch(onTry: () => void, onCatch?: (e: any) => void, onFinally?: () => void) {
	const snackbar = useGlobalSnackbar();

	try {
		onTry();
	} catch (error) {
		console.error(error);

		// Try to get the locale-based error message, or fallback to a generic one if it is not available.
		const message = isLocalisableError(error)
			? error.toLocaleString()
			: $t("messages.errors.genericError");

		snackbar.showSnackbar({ message, color: "error", timeout: 7000 });

		onCatch?.(error);
	} finally {
		onFinally?.();
	}
}
