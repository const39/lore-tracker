import utilities from "@/core/utilities";

export function deepUnref<T>(arg: T): T {
	return utilities.deepCopy(arg);
}
