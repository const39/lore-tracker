import utilities from "@/js/utilities";

export function deepUnref<T>(arg: T): T {
	return utilities.deepCopy(arg)
}
