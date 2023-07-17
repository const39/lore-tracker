import { Model } from "pinia-orm";
import { Constructor } from "../utils/types";
import { BaseLoreEntry } from "./BaseLoreEntry";
import { Campaign } from "./Campaign";
import { ICharacter } from "./Character";
import { IEvent } from "./Event";
import { IFaction } from "./Faction";
import { Folder } from "./Folder";
import { ILocation } from "./Location";
import { INote } from "./Note";
import { IQuest } from "./Quest";

export type ILoreEntry = IQuest | ICharacter | ILocation | IEvent | IFaction | INote;
export type ORMClass = Constructor<Model> & { entity: string };
export type ORMInstance = Model;

export function getPersistentModels(): ORMClass[] {
	return [Campaign, Folder, BaseLoreEntry];
}

export * from "./BaseLoreEntry";
export * from "./Campaign";
export * from "./Character";
export * from "./Event";
export * from "./Faction";
export * from "./Folder";
export * from "./Location";
export * from "./Note";
export * from "./Quest";
