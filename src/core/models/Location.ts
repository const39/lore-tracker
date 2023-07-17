import { Str } from "pinia-orm/dist/decorators";
import { CardCategory } from "@/core/model/cards";
import { BaseLoreEntry, IBaseLoreEntry } from "./BaseLoreEntry";

export interface ILocation extends IBaseLoreEntry {
	readonly category: CardCategory.Location;
	name: string;
	desc: string;
}

export class Location extends BaseLoreEntry implements ILocation {
	static entity = CardCategory.Location;
	static baseEntity = BaseLoreEntry.entity;

	@Str(CardCategory.Location) declare category: CardCategory.Location;
	@Str("") declare name: string;
	@Str("") declare desc: string;

	// Inherit super class model fields
	static fields() {
		return { ...super.schemas[super.entity] };
	}

	constructor(data?: ILocation) {
		super(data);
	}
}
