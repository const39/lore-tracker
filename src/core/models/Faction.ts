import { Str } from "pinia-orm/dist/decorators";
import { ILoreEntry, LoreEntry, MinimalLoreEntry } from "./LoreEntry";
import { Category } from "./types";

interface IFaction extends ILoreEntry {
	readonly category: Category.Faction;
	name: string;
}

type MinimalFaction = MinimalLoreEntry & Partial<IFaction>;

export class Faction extends LoreEntry implements IFaction {
	static entity = Category.Faction;
	static baseEntity = LoreEntry.entity;

	@Str(Category.Faction) declare category: Category.Faction;
	@Str("") declare name: string;

	// Inherit super class model fields
	static fields() {
		return { ...super.schemas[super.entity] };
	}

	constructor(data: MinimalFaction, ...args: any[]) {
		super(data, ...args);
	}

	getText() {
		if (this.name.trim()) return this.name;
		return super.getText();
	}
}
