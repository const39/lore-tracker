import { usePreferencesStore } from "@/store/preferences";
import en from "./locale/en";
import fr from "./locale/fr";

export interface Locale {
	pages: {
		campaigns: string;
		loreBook: string;
		timeline: string;
	};

	notFound: {
		title: string;
		message: string;
	};

	campaign: {
		name: string;
		table: {
			title: string;
			subtitle: string;
			progress: string;
			entryCount: string;
			lastUpdate: string;
			empty: string;
		};
		state: {
			day: string;
			entry: string;
			seasons: {
				spring: string;
				summer: string;
				autumn: string;
				winter: string;
			};
		};
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
		action: string;
		search: string;
		selectors: {
			customOrder: string;
			alphanumericOrder: string;
			largeTabDensity: string;
			comfortableTabDensity: string;
			compactTabDensity: string;
		};
	};

	sidePanel: {
		moveCard: string;
		folderList: string;
		openFolder: string;
	};

	dragAndDrop: {
		desc: string;
		modes: {
			disabled: string;
			moveToFolder: string;
			sort: string;
			link: string;
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
		illegalCharacters: string;
		nameAlreadyUsed: string;
		maxCharacterCount: string;
	};

	dialogs: {
		addCampaign: string;
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

		deleteCampaign: string;
		deleteFolder: string;
		deleteQuest: string;
		deleteEvent: string;
		deleteLocation: string;
		deleteCharacter: string;
		deleteFaction: string;
		deleteNote: string;
		deleteConfirm: string;
		deleteConfirmFolder: string;
		deleteConfirmCampaign: string;
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
			genericError: string;
			corruptedSave: string;
			loadBackup: string;
			saveFileImportCancelled: string;
			saveFileImportFailed: string;
			campaign: {
				campaignNotFound: {
					title: string;
					action: string;
				};
			};
			files: {
				invalidOperation: {
					title: string;
				};
				folderNotFound: {
					title: string;
					action: string;
				};
				nameAlreadyUsed: {
					title: string;
				};
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
			hold: string;
			content: {
				title: string;
				showTabQuest: string;
				showTabEvent: string;
				showTabLocation: string;
				showTabCharacter: string;
				showTabFaction: string;
				showTabNote: string;
			};
			misc: {
				title: string;
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
