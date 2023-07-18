import { Bool, Str } from "pinia-orm/dist/decorators";
import { LoreEntry, ILoreEntry } from "./LoreEntry";
import { Category } from "./types";

export interface ICharacter extends ILoreEntry {
	readonly category: Category.Character;
	name: string;
	race: string;
	classes: string;
	role: string;
	isNPC: boolean;
	isAlive: boolean;
	desc: string;
}

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
	@Str("") declare desc: string;

	// Inherit super class model fields
	static fields() {
		return { ...super.schemas[super.entity] };
	}

	constructor(data?: ICharacter) {
		super(data);
	}
}
