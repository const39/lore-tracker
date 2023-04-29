import { NotepadSave } from "./model/fileTree";
import { SaveVersion } from "./saves";
import utilities from "./utilities";

// *********************
// ***** Constants *****
// *********************

export const VERSION = "1.2.0";
export enum LocalStorageKey {
	DATA_KEY = "DATA",
	PREFERENCES_KEY = "PREFERENCES",
}
export enum Season {
	SPRING = "spring",
	SUMMER = "summer",
	AUTUMN = "autumn",
	WINTER = "winter",
}

// **************************
// ***** Lore-book data *****
// **************************
export type ID = number;
export type CardTypes = Quest | Event | Location | Character | Faction | Note;
export enum CardCategory {
	Quest = "quest",
	Event = "event",
	Location = "location",
	Character = "character",
	Faction = "faction",
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

export interface Faction extends Card, Describable {
	readonly _category: CardCategory.Faction;
	name: string;
}

export interface Note extends Card, Describable {
	readonly _category: CardCategory.Note;
	title: string;
}

export interface MetaData {
	version: SaveVersion.Latest;
	lastUpdate: string; // ISO date-time format | Format not enforced !
}

export interface CardsStore {
	quest: Quest[];
	event: Event[];
	location: Location[];
	character: Character[];
	faction: Faction[];
	note: Note[];
}

export interface SerializedState {
	// _meta: MetaData;
	name: string;
	days: number;
	season: Season;
	cards: CardsStore;
	notepad: NotepadSave;
	quickNote: string;
}

// ! On each update to to SaveFormat or its type dependencies (i.e. any of the above types)
// *** Update/Create save format converter in saves.ts
// *** Regenerate JSON Schema on each update :
// * => npx ts-json-schema-generator --path .\src\js\types.ts --type SaveFormat --tsconfig tsconfig_schema-generation.json -o .\src\schemas\save_format_<SAVE-VERSION>.json
export interface SaveFormat extends SerializedState {
	_meta: MetaData;
}

// ***************************
// ***** Store-specific ******
// ***************************
export const CategoryFilter = {
	ALL: "all",
	QUEST: CardCategory.Quest,
	EVENT: CardCategory.Event,
	LOCATION: CardCategory.Location,
	CHARACTER: CardCategory.Character,
	FACTION: CardCategory.Faction,
	NOTE: CardCategory.Note,
} as const;

export enum Order {
	DEFAULT = "default",
	ALPHANUMERIC = "alphanumeric",
}

export type CategoryFilter = (typeof CategoryFilter)[keyof typeof CategoryFilter];

export interface Filter {
	category: CategoryFilter;
	text: string;
	tags: ID[];
}

// *****************
// ***** View ******
// *****************
export enum Icon {
	quest = "mdi-star-circle",
	event = "mdi-sword-cross",
	location = "mdi-home",
	character = "mdi-account",
	faction = "mdi-crown",
	note = "mdi-note-text",
	combat = "mdi-sword-cross",
	encounter = "mdi-account-group",
	discovery = "mdi-magnify",
	travel = "mdi-horseshoe",
	other = "mdi-help",
	questCompleted = "mdi-check-decagram",
	taskCompleted = "mdi-star-check",
	taskOngoing = "mdi-star-outline",
	folder = "mdi-folder",
}

export class Tag {
	id: ID;
	text: string;
	category: CardCategory;
	icon: Icon;

	constructor(refObject: CardTypes) {
		this.id = refObject.id;
		this.text = utilities.getText(refObject);
		this.category = refObject._category;
		this.icon = utilities.getIcon(refObject);
	}
}
