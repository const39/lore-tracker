import { Num, Str } from "pinia-orm/dist/decorators";
import { CardCategory, EventType } from "@/core/model/cards";
import { BaseLoreEntry, IBaseLoreEntry } from "./BaseLoreEntry";

export interface IEvent extends IBaseLoreEntry {
	readonly category: CardCategory.Event;
	type: EventType;
	day: number;
	desc: string;
}

export class Event extends BaseLoreEntry implements IEvent {
	static entity = CardCategory.Event;
	static baseEntity = BaseLoreEntry.entity;

	@Str(CardCategory.Event) declare category: CardCategory.Event;
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
