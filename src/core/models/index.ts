import { ICharacter } from "./Character";
import { IEvent } from "./Event";
import { IFaction } from "./Faction";
import { ILocation } from "./Location";
import { INote } from "./Note";
import { IQuest } from "./Quest";

export type ILoreEntry = IQuest | ICharacter | ILocation | IEvent | IFaction | INote;

export * from "./BaseLoreEntry";
export * from "./Character";
export * from "./Campaign";
export * from "./Event";
export * from "./Faction";
export * from "./Folder";
export * from "./Location";
export * from "./Note";
export * from "./Quest";
