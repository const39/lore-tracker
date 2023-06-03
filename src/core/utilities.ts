import { klona } from "klona/lite";

// Type utilities
export type UnionOfTupleValues<T extends Readonly<string[] | number[] | symbol[]>> = T[number];

// Map utility functions

/**
 * Merge mapB onto mapA.
 *
 * In case of conflicting keys, the second map's values prevail.
 *
 * @param a the base Map
 * @param b the map to merge
 */
export function mergeMaps<K, V>(a: Map<K, V>, b: Map<K, V>) {
	for (const [k, v] of b.entries()) {
		a.set(k, v);
	}
}

/**
 * Convert a Map to a literal object.
 */
export function serializeMap<K extends string | number, V>(map: Map<K, V>) {
	const result: Record<K, V> = Object.create(null);
	for (const [key, value] of map.entries()) result[key] = value;
	return result;
}

/**
 * Convert a literal object to a Map.
 */
export function deserializeMap<K extends string | number, V>(obj: Record<K, V>): Map<K, V> {
	const map = new Map<K, V>();
	for (const key in obj) {
		const k = key as keyof typeof obj;
		map.set(k, obj[k]);
	}
	return map;
}

/**
 * Returns the current timestamp. To be used as a Unique Identifier.
 * @returns the current timestamp
 */
export function uid() {
	return new Date().getTime();
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

export default {
	mergeMaps,
	serializeMap,
	deserializeMap,
	uid,
	capitalize,
	truncate,
	deepCopy,
	pipe,
};
