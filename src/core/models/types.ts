import { Model } from "pinia-orm";
import { Constructor, UUID } from "../utils/types";

export enum Category {
	Quest = "quest",
	Event = "event",
	Location = "location",
	Character = "character",
	Faction = "faction",
	Note = "note",
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
}

export interface HasIcon {
	getIcon(): string;
}

export interface ORMClass<T = Model> extends Constructor<T>, Revivable<T> {
	entity: string;
}

export type ORMInstance = Model;
