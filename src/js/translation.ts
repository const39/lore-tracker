// TODO language change not fully implemented yet

import { LocalStorageKey } from "./types";
import en from "../locale/en";
import fr from "../locale/fr";

export enum SupportedLanguages {
	FRENCH = "fr",
	ENGLISH = "en",
}

const locales: any = { fr, en };
const fallback = SupportedLanguages.ENGLISH;
const current = getLanguage();

function setLanguage(lang: SupportedLanguages) {
	localStorage.setItem(LocalStorageKey.LANG_KEY, lang);
}

function getLanguage(): SupportedLanguages {
	const val = localStorage.getItem(LocalStorageKey.LANG_KEY) as any;
	return Object.values(SupportedLanguages).includes(val) ? val as SupportedLanguages : fallback;
}

function getNestedProperty(object: any, property: string): string {
	const props = property.split(".");
	let currentVal = object;
	let i = 0;
	do {
		if (currentVal) currentVal = currentVal[props[i]];
		i++;
	} while (currentVal && i < props.length);

	return currentVal || "";
}

export default {
	t: function(key: string): string {
		const text = getNestedProperty(locales[current], key) || getNestedProperty(locales[fallback], key);
		if (text) return text;
		else {
			if (process.env.NODE_ENV === "production") return "";
			else
				throw new Error(
					`LocaleError: Key '${key}' not found in current locale '${current}' nor in fallback locale '${fallback}.'`
				);
		}
	},
	setLanguage,
	getLanguage,
};
