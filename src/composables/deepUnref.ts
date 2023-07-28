import utilities from "@/core/utils/functions";

export function deepUnref<T>(arg: T): T {
	return utilities.deepCopy(arg);
}
