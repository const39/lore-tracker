import { Str } from "pinia-orm/dist/decorators";
import { BaseLoreEntry, IBaseLoreEntry } from "./BaseLoreEntry";
import { Category } from "./types";

export interface ILocation extends IBaseLoreEntry {
	readonly category: Category.Location;
	name: string;
	desc: string;
}

export class Location extends BaseLoreEntry implements ILocation {
	static entity = Category.Location;
	static baseEntity = BaseLoreEntry.entity;

	@Str(Category.Location) declare category: Category.Location;
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
