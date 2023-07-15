import { Bool, Str } from "pinia-orm/dist/decorators";
import { CardCategory } from "../model/cards";
import { BaseLoreEntry, IBaseLoreEntry } from "./BaseLoreEntry";

export interface ICharacter extends IBaseLoreEntry {
	readonly _category: CardCategory.Character;
	name: string;
	race: string;
	classes: string;
	role: string;
	isNPC: boolean;
	isAlive: boolean;
	desc: string;
}

export class Character extends BaseLoreEntry implements ICharacter {
	static entity = CardCategory.Character;
	static baseEntity = BaseLoreEntry.entity;

	@Str(CardCategory.Character) declare _category: CardCategory.Character;
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
