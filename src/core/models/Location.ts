import { Str } from "pinia-orm/dist/decorators";
import { ILoreEntry, LoreEntry, MinimalLoreEntry } from "./LoreEntry";
import { Category } from "./types";

interface ILocation extends ILoreEntry {
	readonly category: Category.Location;
	name: string;
}

type MinimalLocation = MinimalLoreEntry & Partial<ILocation>;

export class Location extends LoreEntry implements ILocation {
	static entity = Category.Location;
	static baseEntity = LoreEntry.entity;

	@Str(Category.Location) declare category: Category.Location;
	@Str("") declare name: string;

	// Inherit super class model fields
	static fields() {
		return { ...super.schemas[super.entity] };
	}

	constructor(data: MinimalLocation, ...args: any[]) {
		super(data, ...args);
	}

	getText() {
		if (this.name.trim()) return this.name;
		return super.getText();
	}

	getAllText() {
		return [...super.getAllText(), this.name];
	}
}
