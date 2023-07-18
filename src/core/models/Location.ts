import { Str } from "pinia-orm/dist/decorators";
import { LoreEntry, ILoreEntry } from "./LoreEntry";
import { Category } from "./types";

export interface ILocation extends ILoreEntry {
	readonly category: Category.Location;
	name: string;
	desc: string;
}

export class Location extends LoreEntry implements ILocation {
	static entity = Category.Location;
	static baseEntity = LoreEntry.entity;

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
