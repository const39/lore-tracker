import utilities from "./utilities";

// *********************
// ***** Constants *****
// *********************

export const VERSION = "1.0.0";
export enum LocalStorageKey {
	DATA_KEY = "DATA",
	THEME_KEY = "THEME",
	LANG_KEY = "LANG",
}
export enum Season {
	SPRING = "spring",
	SUMMER = "summer",
	AUTUMN = "autumn",
	WINTER = "winter",
}

// *****************
// ***** Model *****
// *****************
export type ID = number;
export type CardTypes = Quest | Event | Location | Character | Note;
export enum CardCategory {
	Quest = "quest",
	Event = "event",
	Location = "location",
	Character = "character",
	Note = "note",
}

export enum EventType {
	COMBAT = "combat",
	ENCOUNTER = "encounter",
	DISCOVERY = "discovery",
	TRAVEL = "travel",
	OTHER = "other",
}

interface Describable {
	desc: string;
}

export interface Task extends Describable {
	isCompleted: boolean;
}

export interface Card {
	readonly _category: CardCategory;
	readonly id: ID;
	tags: ID[];
}

export interface Quest extends Card {
	readonly _category: CardCategory.Quest;
	title: string;
	tasks: Task[];
}

export interface Event extends Card, Describable {
	readonly _category: CardCategory.Event;
	type: EventType;
	day: number;
}

export interface Location extends Card, Describable {
	readonly _category: CardCategory.Location;
	name: string;
}

export interface Character extends Card, Describable {
	readonly _category: CardCategory.Character;
	name: string;
	race: string;
	classes: string;
	role: string;
	isNPC: boolean;
	isAlive: boolean;
}

export interface Note extends Card, Describable {
	readonly _category: CardCategory.Note;
	title: string;
}

// *****************
// ***** View ******
// *****************
export enum Icon {
	quest = "mdi-star-circle",
	event = "mdi-sword-cross",
	location = "mdi-home",
	character = "mdi-account",
	note = "mdi-note-text",
	combat = "mdi-sword-cross",
	encounter = "mdi-account-group",
	discovery = "mdi-magnify",
	travel = "mdi-horseshoe",
	other = "mdi-help",
	questCompleted = "mdi-check-decagram",
	taskCompleted = "mdi-star-check",
	taskOngoing = "mdi-star-outline",
}

export class Tag {
	id: ID;
	text: string;
	category: string;
	icon: Icon;

	constructor(refObject: CardTypes) {
		this.id = refObject.id;

		switch (refObject._category) {
			case CardCategory.Character:
			case CardCategory.Location:
				this.text = refObject.name;
				break;
			case CardCategory.Quest:
			case CardCategory.Note:
				this.text = refObject.title;
				break;
			default:
				this.text = refObject.desc;
				break;
		}

		this.category = refObject._category;
		this.icon = utilities.getIcon(refObject);
	}
}

// ***********************
// ***** Store/Save ******
// ***********************
export interface CardsStore {
	quests: Quest[];
	events: Event[];
	locations: Location[];
	characters: Character[];
	notes: Note[];
}

export enum CategoryFilter {
	ALL = "all",
	QUEST = "quest",
	EVENT = "event",
	LOCATION = "location",
	CHARACTER = "character",
	NOTE = "note",
}

export interface Filter {
	isEnabled: boolean;
	nbResults: number;
	category: CategoryFilter;
	text: string;
	tags: ID[];
}

export interface SaveFormat {
	name: string;
	days: number;
	season: Season;
	cards: CardsStore;
	quickNote: string;
}

export interface State extends SaveFormat {
	filter: Filter;
}

// ***********************
// ***** Translation *****
// ***********************
export interface Locale {
	pages: {
		home: string;
		timeline: string;
	};

	timeline: {
		campaignStart: string;
		noEvent: string;
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
	};

	fields: {
		name: string;
		title: string;
		desc: string;
		tags: string;
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
	};

	dialogs: {
		addQuest: string;
		addEvent: string;
		addLocation: string;
		addCharacter: string;
		addNote: string;

		editQuest: string;
		editEvent: string;
		editLocation: string;
		editCharacter: string;
		editNote: string;

		deleteTitle: string;
		deleteQuest: string;
		deleteEvent: string;
		deleteLocation: string;
		deleteCharacter: string;
		deleteNote: string;
	};

	search: {
		search: string;
		containing: string;
		in: string;
		cardsShown: string;
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
		copyData: {
			optionName: string;
			success: string;
		};
		deleteData: {
			optionName: string;
			title: string;
			message: string;
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
				toHome: string;
				toTimeline: string;
			};
			content: {
				title: string;
				// showTabPrefix:string,
				showTabQuest: string;
				showTabEvent: string;
				showTabLocation: string;
				showTabCharacter: string;
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