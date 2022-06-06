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
export type CardTypes = Objective | Event | Location | Character | Note;
export enum CardCategory {
	Objective = "objective",
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

export interface Card {
	readonly _category: CardCategory;
	readonly id: ID;
	desc: string;
	tags: ID[];
}

export interface Objective extends Card {
	readonly _category: CardCategory.Objective;
	isCompleted: boolean;
}

export interface Event extends Card {
	readonly _category: CardCategory.Event;
	type: EventType;
	day: number; // perte du check > 0
}

export interface Location extends Card {
	readonly _category: CardCategory.Location;
	name: string;
}

export interface Character extends Card {
	readonly _category: CardCategory.Character;
	name: string;
	race: string;
	classes: string;
	role: string;
	isNPC: boolean;
	isAlive: boolean;
}

export interface Note extends Card {
	readonly _category: CardCategory.Note;
	title: string;
}

// *****************
// ***** View ******
// *****************
export enum Icon {
	objective = "mdi-star-circle",
	event = "mdi-sword-cross",
	location = "mdi-home",
	character = "mdi-account",
	note = "mdi-note-text",
	completed = "mdi-check-decagram",
	combat = "mdi-sword-cross",
	encounter = "mdi-account-group",
	discovery = "mdi-magnify",
	travel = "mdi-horseshoe",
	other = "mdi-help",
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
	objectives: Objective[];
	events: Event[];
	locations: Location[];
	characters: Character[];
	notes: Note[];
}

export enum CategoryFilter {
	ALL = "all",
	OBJECTIVE = "objective",
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