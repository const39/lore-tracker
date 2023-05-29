export interface LocalisableError {
	toLocaleString: () => string;
}

export function isLocalisableError(error: any): error is LocalisableError {
	return typeof error.toLocaleString === "function";
}
