import { Num, Str } from "pinia-orm/dist/decorators";
import { BaseLoreEntry, IBaseLoreEntry } from "./BaseLoreEntry";
import { Category } from "./types";

export enum EventType {
	COMBAT = "combat",
	ENCOUNTER = "encounter",
	DISCOVERY = "discovery",
	TRAVEL = "travel",
	OTHER = "other",
}

export interface IEvent extends IBaseLoreEntry {
	readonly category: Category.Event;
	type: EventType;
	day: number;
	desc: string;
}

export class Event extends BaseLoreEntry implements IEvent {
	static entity = Category.Event;
	static baseEntity = BaseLoreEntry.entity;

	@Str(Category.Event) declare category: Category.Event;
	@Str("") declare desc: string;
	@Str(EventType.OTHER) declare type: EventType;
	@Num(1) declare day: number;

	// Inherit super class model fields
	static fields() {
		return { ...super.schemas[super.entity] };
	}

	constructor(data?: IEvent) {
		super(data);
	}
}
