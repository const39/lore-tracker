import { UnionOfTupleValues } from "./utils/types";

export const StateTypes = ["error", "warning", "success", "info"] as const;
export type StateTypes = UnionOfTupleValues<typeof StateTypes>;

/**
 * Helper function indicating if the specified arg is a {@link StateTypes}.
 * Acts as a TS type-guard.
 *
 * @param arg the object to check
 * @returns true if arg is a {@link StateTypes}, false otherwise.
 */
export function isStateType(arg: any): arg is StateTypes {
	return StateTypes.includes(arg);
}

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
