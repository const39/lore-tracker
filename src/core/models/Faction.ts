import { Str } from "pinia-orm/dist/decorators";
import { BaseLoreEntry, IBaseLoreEntry } from "./BaseLoreEntry";
import { Category } from "./types";

export interface IFaction extends IBaseLoreEntry {
	readonly category: Category.Faction;
	name: string;
	desc: string;
}

export class Faction extends BaseLoreEntry implements IFaction {
	static entity = Category.Faction;
	static baseEntity = BaseLoreEntry.entity;

	@Str(Category.Faction) declare category: Category.Faction;
	@Str("") declare name: string;
	@Str("") declare desc: string;

	// Inherit super class model fields
	static fields() {
		return { ...super.schemas[super.entity] };
	}

	constructor(data?: IFaction) {
		super(data);
	}
}
