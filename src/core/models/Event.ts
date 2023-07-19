import { Num, Str } from "pinia-orm/dist/decorators";
import { LoreEntry, ILoreEntry } from "./LoreEntry";
import { Category } from "./types";

export enum EventType {
	COMBAT = "combat",
	ENCOUNTER = "encounter",
	DISCOVERY = "discovery",
	TRAVEL = "travel",
	OTHER = "other",
}

export interface IEvent extends ILoreEntry {
	readonly category: Category.Event;
	type: EventType;
	day: number;
}

export class Event extends LoreEntry implements IEvent {
	static entity = Category.Event;
	static baseEntity = LoreEntry.entity;

	@Str(Category.Event) declare category: Category.Event;
	@Str(EventType.OTHER) declare type: EventType;
	@Num(1) declare day: number;

	// Inherit super class model fields
	static fields() {
		return { ...super.schemas[super.entity] };
	}

	constructor(data?: IEvent, ...args: any[]) {
		super(data, ...args);
	}
}
