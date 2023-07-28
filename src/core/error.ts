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

export interface ILocalisableError {
	/**
	 * @returns the localized error message
	 */
	toLocaleString(): string;
}

export abstract class LocalisableError extends Error implements ILocalisableError {
	abstract toLocaleString(): string;
}

/**
 * Helper function indicating if the specified error follows the {@link LocalisableError} data structure.
 * Acts as a TS type-guard.
 *
 * @param error the object to check
 * @returns true if error is a {@link LocalisableError}, false otherwise.
 */
export function isLocalisableError(error: any): error is LocalisableError {
	return (
		error instanceof LocalisableError || // Actual instance of LocalisableError
		(error instanceof Error && typeof error.toLocaleString === "function") // Generic error that matches the interface's contract
	);
}
