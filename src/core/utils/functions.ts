import { klona } from "klona/lite";
import { nanoid } from "nanoid";
import { UUID } from "./types";

/**
 * Generate a UUID.
 */
export function uuid(): UUID {
	return nanoid();
}

/**
 * Capitalize the specified string.
 */
export function capitalize(str: string) {
	if (typeof str === "string") return str.replace(/^\w/, (c) => c.toUpperCase());
	else "";
}

/**
 * Truncate text to the specified length (if necessary). Appends an ellipsis ('...') to the truncated text.
 */
export function truncate(text: string, maxLength: number) {
	if (maxLength > 0 && text.length > maxLength) return `${text.substring(0, maxLength)}...`;
	else return text;
}

/**
 * Performs a deep copy of input.
 * Note: This function only works on literals, natives objects, custom class objects, Date, and RegExp (no Set, Map...).
 *
 * @param input the object to copy
 * @see https://github.com/lukeed/klona
 */
export function deepCopy<T>(input: T): T {
	return klona(input);
}

/**
 * Create a pipeline of functions.
 * @param functions the functions to pipe, in order (from left to right)
 * @returns a pipeline function
 */
export function pipe(...functions: ((arg: any) => any)[]) {
	return (initial: any) => functions.reduce((previous, f) => f(previous), initial);
}

/**
 * Run fn asynchronously.
 * @param fn the function to run
 * @returns a Promise that resolves when fn returns.
 */
export function defer<T>(fn: () => T) {
	return new Promise<T>((resolve) => setTimeout(() => resolve(fn()), 0));
}

export default {
	uuid,
	capitalize,
	truncate,
	deepCopy,
	pipe,
	defer,
};
