import { Model } from "pinia-orm";
import { Icon } from "@/core/utils/icons";
import { Constructor, UUID } from "@/core/utils/types";

export enum Category {
	Quest = "quest",
	Event = "event",
	Location = "location",
	Character = "character",
	Faction = "faction",
	Note = "note",
}

export enum StoreName {
	Campaign = "campaigns",
	Folder = "folders",
	LoreEntry = "loreEntries",
}

export interface Orderable {
	position: number;
}

export interface Indexable {
	readonly id: UUID;
}

export interface Categorizable {
	readonly category: Category;
}

export interface Taggable {
	tags: UUID[];
}

export interface Revivable<T> {
	revive(data: Record<UUID, any>): T;
}

export interface Describable {
	getText(): string;
	getAllText(): string[];
}

export interface HasIcon {
	getIcon(): Icon;
}

export interface ORMClass<T = Model> extends Constructor<T>, Revivable<T> {
	entity: string;
}

export type ORMInstance = Model;
