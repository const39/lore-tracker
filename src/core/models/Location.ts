import { Str, Uid } from "pinia-orm/dist/decorators";
import { CardCategory, ID } from "@/core/model/cards";
import { BaseLoreEntry, IBaseLoreEntry } from "./BaseLoreEntry";

export interface ILocation extends IBaseLoreEntry {
	readonly _category: CardCategory.Location;
	name: string;
	desc: string;
}

export class Location extends BaseLoreEntry implements ILocation {
	static entity = CardCategory.Location;
	static baseEntity = BaseLoreEntry.entity;

	@Str(CardCategory.Location) declare _category: CardCategory.Location;
	@Uid() declare id: ID;
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
