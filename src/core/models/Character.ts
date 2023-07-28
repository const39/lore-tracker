import { Bool, Str } from "pinia-orm/dist/decorators";
import { ILoreEntry, LoreEntry, MinimalLoreEntry } from "./LoreEntry";
import { Category } from "./types";

interface ICharacter extends ILoreEntry {
	readonly category: Category.Character;
	name: string;
	race: string;
	classes: string;
	role: string;
	isNPC: boolean;
	isAlive: boolean;
}

type MinimalCharacter = MinimalLoreEntry & Partial<ICharacter>;

export class Character extends LoreEntry implements ICharacter {
	static entity = Category.Character;
	static baseEntity = LoreEntry.entity;

	@Str(Category.Character) declare category: Category.Character;
	@Str("") declare name: string;
	@Str("") declare race: string;
	@Str("") declare classes: string;
	@Str("") declare role: string;
	@Bool(true) declare isNPC: boolean;
	@Bool(true) declare isAlive: boolean;

	// Inherit super class model fields
	static fields() {
		return { ...super.schemas[super.entity] };
	}

	constructor(data: MinimalCharacter, ...args: any[]) {
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
