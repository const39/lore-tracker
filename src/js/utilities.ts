import { CardCategory, CardTypes, Icon } from "./types";

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
	 * Returns the card's main text (i.e. its prominent field (title, name...) if it's not empty or the description as fallback).
	 * @param card
	 * @returns the main text of the card
	 */
	getText: function(card: CardTypes): string {
		switch (card._category) {
			case CardCategory.Character:
			case CardCategory.Location:
			case CardCategory.Faction:
				return card.name || card.desc;
			case CardCategory.Quest:
				return card.title;
			case CardCategory.Note:
				return card.title || card.desc;
			default:
				return card.desc;
		}
	},
	/**
	 * Returns all text contained in the card as an array of strings.
	 * @param card
	 * @returns all texts of the card
	 */
	getAllText: function(card: CardTypes): string[] {
		switch (card._category) {
			case CardCategory.Character:
			case CardCategory.Location:
			case CardCategory.Faction:
				return [card.name, card.desc];
			case CardCategory.Quest:
				return [card.title, ...card.tasks.map((task) => task.desc)];
			case CardCategory.Note:
				return [card.title, card.desc];
			default:
				return [card.desc];
		}
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
	trim(str: string, c: string) {
		if(c.length != 1) throw new Error(c + ' is not a single character.')

		let start = 0, end = str.length;

		// Trim left
		while(start < str.length && str[start] === c) start++;
		
		// Trim right
		while(end > start && str[end - 1] === c) end--;

		return (start > 0 || end < str.length) ? str.substring(start, end) : str
	},
	sanitizePath: function(path: string): string {
		return '/' + this.trim(path.toLowerCase(), "/");
	},
	joinPaths: function(parent: string, child: string): string {
		return this.sanitizePath(this.sanitizePath(parent) + this.sanitizePath(child));
	},
};
