import { CardTypes, Icon } from "./types";

export default {
	/**
	 * Returns the current timestamp. To be used as a Unique Identifier.
	 * @returns the current timestamp
	 */
	uid: function() {
		return new Date().getTime();
	},
	capitalize: function(str: string) {
		if (typeof str === "string") return str.replace(/^\w/, (c) => c.toUpperCase());
		else "";
	},
	truncate: function(text: string, maxLength: number) {
		if (maxLength > 0 && text.length > maxLength) return `${text.substring(0, maxLength)}...`;
		else return text;
	},
	getIcon: function(content: CardTypes): Icon {
		if (content._category === "event") return Icon[content.type];
		else return Icon[content._category];
	},
	/**
	 * Attempts a deep copy of the specified object literal.
	 * 
	 * Note: This function is expected to only work on object literals and only with primitive types (no Set, Date...). 
	 * 
	 * @param obj the object to copy
	 * @returns a deep copy of obj
	 * @throws an Error if obj is not an object literal 
	 */
	deepCopy: function(obj: object): object {
		if (!Array.isArray(obj) && typeof obj === "object") {
			// If object has nested object values, use the JSON serialize/deserialize technique
			// Otherwise, clone object
			if (Object.values(obj).some((val) => typeof val === "object")) return JSON.parse(JSON.stringify(obj));
			else return { ...obj };
		} else throw new Error("Argument ${obj} is not an object literal.");
	},
};
