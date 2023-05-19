import { useCampaignInfoStore } from "@/store/campaignInfo";
import { Icon, getIcon } from "../icons";
import utilities from "../utilities";
import { Folder, FolderMetadata, SerializedFolder } from "./fileTree";

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

export type CardTypesMapping = {
	[CardCategory.Quest]: Quest;
	[CardCategory.Event]: Event;
	[CardCategory.Location]: Location;
	[CardCategory.Character]: Character;
	[CardCategory.Faction]: Faction;
	[CardCategory.Note]: Note;
};

export type CardTypeBasedOnCategory<T extends CardCategory> = CardTypesMapping[T];

export interface CardFolderMetadata extends FolderMetadata {
	_category: CardCategory;
}

export class CardFolder extends Folder<CardFolderMetadata, CardTypes> {}

// Runtime type
export type CardsStore = {
	[Category in CardCategory]: Folder<CardFolderMetadata, CardTypeBasedOnCategory<Category>>;
};

// Serialized type
export type CardsStoreSerialized = {
	[Category in CardCategory]: SerializedFolder<
		CardFolderMetadata,
		CardTypeBasedOnCategory<Category>
	>;
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

export function isCard(maybeCard: any): maybeCard is CardTypes {
	return Object.values(CardCategory).includes(maybeCard._category);
}

export function isCardFolder(maybeFolder: any): maybeFolder is CardFolder {
	return maybeFolder instanceof CardFolder;
}

export function createCard(category: CardCategory): CardTypes {
	const campaignInfoStore = useCampaignInfoStore();
	switch (category) {
		case CardCategory.Quest:
			return {
				_category: CardCategory.Quest,
				id: utilities.uid(),
				tags: [],
				title: "",
				tasks: [],
			};
		case CardCategory.Event:
			return {
				_category: CardCategory.Event,
				id: utilities.uid(),
				desc: "",
				tags: [],
				type: EventType.OTHER,
				day: campaignInfoStore.days,
			};
		case CardCategory.Location:
			return {
				_category: CardCategory.Location,
				id: utilities.uid(),
				desc: "",
				tags: [],
				name: "",
			};
		case CardCategory.Character:
			return {
				_category: CardCategory.Character,
				id: utilities.uid(),
				desc: "",
				tags: [],
				name: "",
				race: "",
				classes: "",
				role: "",
				isAlive: true,
				isNPC: true,
			};
		case CardCategory.Faction:
			return {
				_category: CardCategory.Faction,
				id: utilities.uid(),
				desc: "",
				tags: [],
				name: "",
			};
		case CardCategory.Note:
			return {
				_category: CardCategory.Note,
				id: utilities.uid(),
				desc: "",
				tags: [],
				title: "",
			};
	}
}

export function createRootFolder<T extends CardCategory>(
	category: T,
	files?: CardTypeBasedOnCategory<T>[]
) {
	const meta: CardFolderMetadata = {
		id: utilities.uid(),
		_category: category,
		color: "#ffffff",
		name: `${category}-root`,
	};
	return new CardFolder(meta, undefined, files);
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
