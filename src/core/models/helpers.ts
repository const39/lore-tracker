import { Category, ORMClass } from "./types";
import { Campaign, Character, Event, Faction, Folder, Location, LoreEntry, Note, Quest } from ".";

export function getPersistentModels(): ORMClass[] {
	return [Campaign, Folder, LoreEntry];
}

/**
 * Maps each LoreEntry category to its related ORM model subclass.
 */
export const SubModelsMapping = {
	[Category.Quest]: Quest,
	[Category.Event]: Event,
	[Category.Location]: Location,
	[Category.Character]: Character,
	[Category.Faction]: Faction,
	[Category.Note]: Note,
} as const;
