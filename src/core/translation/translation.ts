import { usePreferencesStore } from "@/store/preferences";
import { getNestedProperty } from "../utils/functions";
import log from "../utils/log";
import en from "./locale/en";
import fr from "./locale/fr";

type SimplePlural = [string, string]; // Singular + Plural
type CompletePlural = [string, string, string]; // None + Singular + Plural

type DynamicMessageValues = Record<string, any>;
type DynamicMessage<T = DynamicMessageValues> = (values: T) => string;

type Message = string | DynamicMessage;
type Plural = SimplePlural | CompletePlural;

type LocaleEntry = Message | Plural;

interface PluralOptions {
	includeCount?: boolean;
}

export interface Locale {
	pages: {
		notFound: {
			title: string;
			message: string;
		};
		campaigns: {
			name: string;
			title: string;
			subtitle: string;
			table: {
				progress: string;
				entryCount: string;
				lastUpdate: string;
				empty: string;
			};
		};
		timeline: {
			name: string;
			title: string;
			content: {
				campaignStart: string;
				noEvent: string;
				ascOrder: string;
				descOrder: string;
			};
		};
		loreBook: {
			name: string;
			banner: {
				statusAction: string;
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
				relatedCards: string;
				noRelatedCards: string;
			};
			quickNote: {
				name: string;
			};
			fields: {
				labels: {
					category: string;
					name: string;
					title: string;
					desc: string;
					tags: string;
					noTag: string;
					mdSupport: string;
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
				};
				content: {
					unknownRace: string;
					unknownClass: string;
					unknownRole: string;
				};
				errors: {
					requiredField: string;
					dayNotValid: string;
					illegalCharacters: string;
					nameAlreadyUsed: string;
					maxCharacterCount: DynamicMessage<{ n: string }>;
				};
			};
		};
	};

	data: {
		campaign: {
			name: CompletePlural;
			day: string;
			entryCount: CompletePlural;
			seasons: {
				spring: string;
				summer: string;
				autumn: string;
				winter: string;
			};
		};
		categories: {
			quest: CompletePlural;
			event: CompletePlural;
			location: CompletePlural;
			character: CompletePlural;
			faction: CompletePlural;
			note: CompletePlural;
		};
		eventTypes: {
			combat: string;
			encounter: string;
			discovery: string;
			travel: string;
			other: string;
		};
		cardTypes: {
			folder: CompletePlural;
			file: CompletePlural;
		};
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
		showRelated: string;
		edit: string;
		delete: string;
		moveTo: string;
		dropCardHere: string;
		dragSort: string;
		multipleDragItems: string;
	};

	messages: {
		success: {
			saveFileImportSuccessful: string;
			newCardStored: string;
			newCardStoredInFolder: string;
		};
		errors: {
			genericError: string;
			save: {
				corruptedSave: string;
				loadBackup: string;
				saveFileImportCancelled: string;
				saveFileImportFailed: string;
			};
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
			sidePanel: {
				formAlreadyOpen: {
					title: string;
				};
			};
		};
		info: {
			updateNotif: {
				title: string;
				message: string;
			};
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
				showTab: DynamicMessage<{ category: string }>;
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

/**
 * Get the entry at the specified path in the current locale schema.
 * If the property is not found in the current locale schema, this functions looks for it in the fallback schema.
 *
 * @param key the dotted property path (e.g. 'foo.bar.baz')
 * @returns the locale entry, either from the current or fallback schema, or an empty string if it is not found in any schema.
 */
function getLocaleEntry(key: string): LocaleEntry {
	const prefStore = usePreferencesStore();
	const current = prefStore.language;

	// Get entry from current locale
	let entry = getNestedProperty(locales[current], key);
	if (entry) return entry;

	// Log warning if entry is not found in current locale
	log.warn(
		`LocaleError: Key '${key}' not found in current locale '${current}'. Using fallback locale '${fallback}'...`,
		{ devOnly: true }
	);

	// Get entry from fallback locale
	entry = getNestedProperty(locales[fallback], key);
	if (entry) return entry;

	// Log warning if entry is not found in any locale
	log.warn(`LocaleError: Key '${key}' not found in fallback locale '${current}'.`, {
		devOnly: true,
	});

	return "";
}

function pluralize(rawMessage: Plural, n: number, options?: PluralOptions): string {
	const indices =
		rawMessage.length > 2 ? { none: 0, one: 1, multiple: 2 } : { one: 0, multiple: 1 };
	const isCompletePlural = indices.none !== undefined;

	let result;

	// Get the plural form
	if (n > 1) result = rawMessage[indices.multiple];
	// Get the singular form
	else if (n === 1) result = rawMessage[indices.one];
	// Get the 'none' form
	else if (n === 0 && isCompletePlural) result = rawMessage[indices.none];

	// If no form is found for the specified n fallback to the first form
	if (!result) {
		result = rawMessage[indices.one];
		// Log a warning in dev mode
		log.warn(`No pluralized form found for n=${n} with message '${rawMessage}'`, {
			devOnly: true,
		});
	}

	// Include the count in the result string if:
	// - specified in options
	// - n is not null
	// - the 'none' form has not been used
	return options?.includeCount && n !== 0 && isCompletePlural ? `${n} ${result}` : result;
}

/**
 * Get the message located at the given key in the current locale.
 * 
 * @param key the message key, as a dotted property path (e.g. 'foo.bar.baz')
 * 
 * @returns the localized message
 */
export function t(key: string): string;

/**
 * Get the message located at the given key in the current locale and customize it with the specified values.
 * 
 * @param key the message key, as a dotted property path (e.g. 'foo.bar.baz')
 * @param values values to include in the message at the interpolation slots specified in the locale entry 
 * 
 * @returns the localized message, with inserted values
 */
export function t(key: string, values?: DynamicMessageValues): string;

/**
 * Get the message located at the given key in the current locale in its pluralized version.
 * 
 * @param key the message key, as a dotted property path (e.g. 'foo.bar.baz')
 * @param n the amount used to choose the pluralization variant of the message, based on the following rules:
 * - n = 0: use the 'none' version (if supported by the message)
 * - n = 1: use the 'singular' version
 * - n >= 2: use the 'plural' version
 * 
 * @returns the localized message, pluralized based on the given amount
 */
export function t(key: string, n: number, pluralOptions?: PluralOptions): string;

// Overload implementation:
export function t(
	key: string,
	nOrValues?: number | DynamicMessageValues,
	valuesOrOptions?: DynamicMessageValues | PluralOptions
): string {
	const entry = getLocaleEntry(key);

	// If plural form is available, get the one for the specified n
	if (Array.isArray(entry)) {
		const n = typeof nOrValues === "number" ? nOrValues : 1;
		return pluralize(entry, n, valuesOrOptions);
	} else if (typeof nOrValues === "number") {
		log.warn(`LocaleError: Key '${key}' does not support pluralization.`, { devOnly: true });
	}

	// If message is dynamic, call its function with the specified params
	if (typeof entry === "function") {
		const vals =
			typeof nOrValues === "object" ? nOrValues : { n: nOrValues, ...valuesOrOptions };
		return entry(vals);
	}

	// If the message is raw, return it as is
	return entry;
}
