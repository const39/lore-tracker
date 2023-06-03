export interface LocalisableError {
	/**
	 * @returns the localized error message
	 */
	toLocaleString: () => string;
}

/**
 * Helper function indicating if the specified error follows the {@link LocalisableError} data structure.
 * Acts as a TS type-guard.
 *
 * @param error the object to check
 * @returns true if error is a {@link LocalisableError}, false otherwise.
 */
export function isLocalisableError(error: any): error is LocalisableError {
	return typeof error.toLocaleString === "function";
}
