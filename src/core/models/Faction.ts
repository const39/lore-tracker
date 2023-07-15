import { Attr, Str, Uid } from "pinia-orm/dist/decorators";
import { CardCategory, ID } from "@/core/model/cards";
import { BaseLoreEntry, IBaseLoreEntry } from "./BaseLoreEntry";

export interface IFaction extends IBaseLoreEntry {
	readonly _category: CardCategory.Faction;
	name: string;
	desc: string;
}

export class Faction extends BaseLoreEntry implements IFaction {
	static entity = CardCategory.Faction;
	static baseEntity = BaseLoreEntry.entity;

	@Str(CardCategory.Faction) declare _category: CardCategory.Faction;
	@Uid() declare id: ID;
	@Str("") declare name: string;
	@Str("") declare desc: string;
	@Attr([]) declare tags: ID[];

	// Inherit super class model fields
	static fields() {
		return { ...super.schemas[super.entity] };
	}

	constructor(data?: IFaction) {
		super(data);
	}
}
