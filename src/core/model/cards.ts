import { Icon } from "../constants";
import utilities from "../utilities";
import { Folder, SerializedFolder } from "./fileTree";

export type ID = number;

export enum CardCategory {
	Quest = "quest",
	Event = "event",
	Location = "location",
	Character = "character",
	Faction = "faction",
	Note = "note",
}

interface BaseCard {
	readonly _category: CardCategory;
	readonly id: ID;
	tags: ID[];
}

export interface Task {
	isCompleted: boolean;
	desc: string;
}

export interface Quest extends BaseCard {
	readonly _category: CardCategory.Quest;
	title: string;
	tasks: Task[];
}

export enum EventType {
	COMBAT = "combat",
	ENCOUNTER = "encounter",
	DISCOVERY = "discovery",
	TRAVEL = "travel",
	OTHER = "other",
}

export interface Event extends BaseCard {
	readonly _category: CardCategory.Event;
	desc: string;
	type: EventType;
	day: number;
}

export interface Location extends BaseCard {
	readonly _category: CardCategory.Location;
	name: string;
	desc: string;
}

export interface Character extends BaseCard {
	readonly _category: CardCategory.Character;
	name: string;
	race: string;
	classes: string;
	role: string;
	isNPC: boolean;
	isAlive: boolean;
	desc: string;
}

export interface Faction extends BaseCard {
	readonly _category: CardCategory.Faction;
	name: string;
	desc: string;
}

export interface Note extends BaseCard {
	readonly _category: CardCategory.Note;
	title: string;
	desc: string;
}

export type CardTypes = Quest | Event | Location | Character | Faction | Note;

export class CardFolder extends Folder<CardTypes> {}

export type CardTypesMapping = {
	[CardCategory.Quest]: Quest;
	[CardCategory.Event]: Event;
	[CardCategory.Location]: Location;
	[CardCategory.Character]: Character;
	[CardCategory.Faction]: Faction;
	[CardCategory.Note]: Note;
}

export type CardTypeBasedOnCategory<T extends CardCategory> = CardTypesMapping[T]


// Runtime type
export interface CardsStore {
	[CardCategory.Quest]: Folder<Quest>;
	[CardCategory.Event]: Folder<Event>;
	[CardCategory.Location]: Folder<Location>;
	[CardCategory.Character]: Folder<Character>;
	[CardCategory.Faction]: Folder<Faction>;
	[CardCategory.Note]: Folder<Note>;
}

// Serialized type
export interface CardsStoreSerialized {
	[CardCategory.Quest]: SerializedFolder<Quest>;
	[CardCategory.Event]: SerializedFolder<Event>;
	[CardCategory.Location]: SerializedFolder<Location>;
	[CardCategory.Character]: SerializedFolder<Character>;
	[CardCategory.Faction]: SerializedFolder<Faction>;
	[CardCategory.Note]: SerializedFolder<Note>;
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
