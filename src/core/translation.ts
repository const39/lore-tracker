import en from "@/locale/en";
import fr from "@/locale/fr";
import { usePreferencesStore } from "@/store/preferences";

export interface Locale {
	pages: {
		loreBook: string;
		timeline: string;
	};

	notFound: {
		title: string;
		message: string;
	};

	timeline: {
		campaignStart: string;
		noEvent: string;
		ascOrder: string;
		descOrder: string;
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

		folder: string;
		file: string;
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
		search: string;
		selectors: {
			customOrder: string;
			alphanumericOrder: string;
			largeTabDensity: string;
			comfortableTabDensity: string;
			compactTabDensity: string;
			cardDragAndDrop: string;
		};
	};

	sidePanel: {
		moveCard: string;
		folderList: string;
		openFolder: string;
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
		illegalCharacters: string;
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

		editFolder: string;
		editQuest: string;
		editEvent: string;
		editLocation: string;
		editCharacter: string;
		editFaction: string;
		editNote: string;

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

	actions: {
		close: string;
		save: string;
		yes: string;
		no: string;
		edit: string;
		delete: string;
		moveTo: string;
		quickNote: string;
		dropCardHere: string;
	};

	messages: {
		success: {
			saveFileImportSuccessful: string;
			newCardStored: string;
			newCardStoredInFolder: string;
		};
		errors: {
			corruptedSave: string;
			loadBackup: string;
			saveFileImportCancelled: string;
			saveFileImportFailed: string;
			folderNotFound: {
				title: string;
				message: string;
			};
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
				toggleSort: string;
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