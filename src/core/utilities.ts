import { klona } from "klona/lite";

// Map utility functions
export type SerializedMap<K extends string | number, V> = Record<K, V>;

export function mergeMaps<K, V>(a: Map<K, V>, b: Map<K, V>) {
	for (const [k, v] of b.entries()) {
		a.set(k, v);
	}
}

export function serializeMap<K extends string | number, V>(map: Map<K, V>): SerializedMap<K, V> {
	const result = Object.create(null);
	for (const [key, value] of map.entries()) result[key] = value;
	return result;
}

export function deserializeMap<K extends string | number, V>(obj: SerializedMap<K, V>): Map<K, V> {
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

export function capitalize(str: string) {
	if (typeof str === "string") return str.replace(/^\w/, (c) => c.toUpperCase());
	else "";
}

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
