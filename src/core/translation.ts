import en from "@/locale/en";
import fr from "@/locale/fr";
import { usePreferencesStore } from "@/store/preferences";

export interface Locale {
	pages: {
		loreBook: string;
		timeline: string;
		notepad: string;
	};

	notFound: {
		title: string;
		message: string;
	};

	timeline: {
		campaignStart: string;
		noEvent: string;
	};

	notepad: {
		types: {
			folder: string;
			file: string;
		};
		folder: {
			childElements: string;
		};
		folderNotFound: {
			title: string;
			message: string;
		};
	};

	eventTypes: {
		combat: string;
		encounter: string;
		discovery: string;
		travel: string;
		other: string;
	};

	categories: {
		all: string;
		quest: string;
		event: string;
		location: string;
		character: string;
		faction: string;
		note: string;
	};

	status: {
		day: string;
		seasons: {
			spring: string;
			summer: string;
			autumn: string;
			winter: string;
		};
		action: string;
		cardCount: string;
		selectors: {
			customOrder: string;
			alphanumericOrder: string;
			largeTabDensity: string;
			comfortableTabDensity: string;
			compactTabDensity: string;
		};
	};

	fields: {
		category: string;
		name: string;
		title: string;
		desc: string;
		tags: string;
		noTag: string;
		mdSupport: string;
		otherCounter: string;
		tasks: string;
		noTask: string;
		ongoing: string;
		completed: string;
		eventType: string;
		eventDay: string;
		race: string;
		class: string;
		role: string;
		npc: string;
		player: string;
		alive: string;
		dead: string;
		unknownRace: string;
		unknownClass: string;
		unknownRole: string;
		requiredField: string;
		dayNotValid: string;
		nameAlreadyUsed: string;
	};

	dialogs: {
		addFolder: string;
		addQuest: string;
		addEvent: string;
		addLocation: string;
		addCharacter: string;
		addFaction: string;
		addNote: string;

		deleteFolder: string;
		deleteQuest: string;
		deleteEvent: string;
		deleteLocation: string;
		deleteCharacter: string;
		deleteFaction: string;
		deleteNote: string;
		deleteConfirm: string;
		deleteConfirmFolder: string;
	};

	search: {
		search: string;
		containing: string;
		taggedWith: string;
		cardsMatching: string;
		sortDisabled: string;
	};

	actions: {
		close: string;
		save: string;
		yes: string;
		no: string;
		edit: string;
		delete: string;
		quickNote: string;
		changeCategory: string;
	};

	messages: {
		success: {
			saveFileImportSuccessful: string;
		};
		errors: {
			corruptedSave: string;
			loadBackup: string;
			saveFileImportCancelled: string;
			saveFileImportFailed: string;
		};
		info: {
			updateNotifTitle: string;
			updateNotifMessage: string;
		};
	};

	options: {
		themes: {
			optionName: string;
			light: string;
			dark: string;
		};
		lang: {
			optionName: string;
		};
		save: {
			optionName: string;
			downloadText: string;
			uploadText: string;
			uploadInputLabel: string;
			uploadInputHint: string;
			deleteText: string;
			deleteDialogTitle: string;
			deleteDialogMessage: string;
		};
		about: {
			optionName: string;
			title: string;
			link: string;
		};
		hotkeys: {
			optionName: string;
			title: string;
			pages: {
				title: string;
				toLoreBook: string;
				toNotepad: string;
				toTimeline: string;
			};
			content: {
				title: string;
				// showTabPrefix:string,
				showTabQuest: string;
				showTabEvent: string;
				showTabLocation: string;
				showTabCharacter: string;
				showTabFaction: string;
				showTabNote: string;
			};
			misc: {
				title: string;
				openSearch: string;
				openOptions: string;
			};
		};
	};
}

export enum SupportedLanguages {
	FRENCH = "fr",
	ENGLISH = "en",
}

const locales = { fr, en };
const fallback = SupportedLanguages.ENGLISH;

export function getNestedProperty(object: any, property: string): string {
	const props = property.split(".");
	let currentVal = object;
	let i = 0;
	do {
		if (currentVal) currentVal = currentVal[props[i]];
		i++;
	} while (currentVal && i < props.length);

	return currentVal || "";
}

export function t(key: string): string {
	const prefStore = usePreferencesStore();
	const current = prefStore.language;

	const text =
		getNestedProperty(locales[current], key) || getNestedProperty(locales[fallback], key);
	if (text) return text;
	else {
		if (process.env.NODE_ENV === "production") return "";
		else
			throw new Error(
				`LocaleError: Key '${key}' not found in current locale '${current}' nor in fallback locale '${fallback}.'`
			);
	}
}

export default { t };
