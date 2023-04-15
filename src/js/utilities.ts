import { CardCategory, CardTypes, Icon } from "./types";
import { klona } from "klona/lite";

export default {
	/**
	 * Returns the current timestamp. To be used as a Unique Identifier.
	 * @returns the current timestamp
	 */
	uid: function () {
		return new Date().getTime();
	},
	capitalize: function (str: string) {
		if (typeof str === "string") return str.replace(/^\w/, (c) => c.toUpperCase());
		else "";
	},
	truncate: function (text: string, maxLength: number) {
		if (maxLength > 0 && text.length > maxLength) return `${text.substring(0, maxLength)}...`;
		else return text;
	},
	getIcon: function (content: CardTypes): Icon {
		if (content._category === "event") return Icon[content.type];
		else return Icon[content._category];
	},
	/**
	 * Returns the card's main text (i.e. its prominent field (title, name...) if it's not empty or the description as fallback).
	 * @param card
	 * @returns the main text of the card
	 */
	getText: function (card: CardTypes): string {
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
	getAllText: function (card: CardTypes): string[] {
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
	 * Performs a deep copy of input.
	 * Note: This function only works on literals, natives objects, custom class objects, Date, and RegExp (no Set, Map...).
	 *
	 * @param input the object to copy
	 * @see https://github.com/lukeed/klona
	 */
	deepCopy: function <T>(input: T): T {
		return klona(input);
	},
	sanitizePath: function (leadingSlash: boolean, path: string): string {
		// TODO check for illegal character in URI
		const p = leadingSlash ? "/" + path : path;
		const sanitized = p.trim().toLowerCase().replace(/\/+/g, "/");
		if (!leadingSlash && sanitized.startsWith("/")) return sanitized.slice(1);
		else return sanitized;
	},
	joinPaths: function (leadingSlash: boolean, ...elements: string[]): string {
		return this.sanitizePath(leadingSlash, elements.join("/"));
	},
	pipe: function (...functions: ((arg: any) => any)[]) {
		return (initial: any) => functions.reduce((previous, f) => f(previous), initial);
	},
	isClassInstance(obj: any) {
		return !["Function", "Object", "Array"].includes(obj.constructor.name);
	},
};
