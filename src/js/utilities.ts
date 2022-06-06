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
};
