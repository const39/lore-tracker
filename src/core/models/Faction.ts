import { Str } from "pinia-orm/dist/decorators";
import { LoreEntry, ILoreEntry } from "./LoreEntry";
import { Category } from "./types";

export interface IFaction extends ILoreEntry {
	readonly category: Category.Faction;
	name: string;
}

export class Faction extends LoreEntry implements IFaction {
	static entity = Category.Faction;
	static baseEntity = LoreEntry.entity;

	@Str(Category.Faction) declare category: Category.Faction;
	@Str("") declare name: string;

	// Inherit super class model fields
	static fields() {
		return { ...super.schemas[super.entity] };
	}

	constructor(data?: IFaction) {
		super(data);
	}

	getText() {
		if (this.name.trim()) return this.name;
		return super.getText();
	}
}
