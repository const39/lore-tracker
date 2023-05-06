import { Icon, getIcon } from "../icons";
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
};

export type CardTypeBasedOnCategory<T extends CardCategory> = CardTypesMapping[T];

// Runtime type
export type CardsStore = {
	[Category in CardCategory]: Folder<CardTypeBasedOnCategory<Category>>;
};

// Serialized type
export type CardsStoreSerialized = {
	[Category in CardCategory]: SerializedFolder<CardTypeBasedOnCategory<Category>>;
};

export class Tag {
	id: ID;
	text: string;
	category: CardCategory;
	icon: Icon;

	constructor(refObject: CardTypes) {
		this.id = refObject.id;
		this.text = getText(refObject);
		this.category = refObject._category;
		this.icon = getIcon(refObject);
	}
}

/**
 * Returns the card's main text (i.e. its prominent field (title, name...) if it's not empty or the description as fallback).
 * @param card
 * @returns the main text of the card
 */
export function getText(card: CardTypes | CardFolder): string {
	if ("_category" in card) {
		switch (card._category) {
			case CardCategory.Character:
			case CardCategory.Location:
			case CardCategory.Faction:
				return card.name || card.desc;
			case CardCategory.Quest:
				return card.title;
			case CardCategory.Note:
				return card.title || card.desc;
			default:
				return card.desc;
		}
	} else return card.metadata.name;
}

/**
 * Returns all text contained in the card as an array of strings.
 * @param card
 * @returns all texts of the card
 */
export function getAllText(card: CardTypes | CardFolder): string[] {
	if ("_category" in card) {
		switch (card._category) {
			case CardCategory.Character:
			case CardCategory.Location:
			case CardCategory.Faction:
				return [card.name, card.desc];
			case CardCategory.Quest:
				return [card.title, ...card.tasks.map((task) => task.desc)];
			case CardCategory.Note:
				return [card.title, card.desc];
			default:
				return [card.desc];
		}
	} else return [card.metadata.name];
}
