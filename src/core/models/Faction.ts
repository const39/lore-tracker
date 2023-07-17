import { Str } from "pinia-orm/dist/decorators";
import { CardCategory } from "@/core/model/cards";
import { BaseLoreEntry, IBaseLoreEntry } from "./BaseLoreEntry";

export interface IFaction extends IBaseLoreEntry {
	readonly category: CardCategory.Faction;
	name: string;
	desc: string;
}

export class Faction extends BaseLoreEntry implements IFaction {
	static entity = CardCategory.Faction;
	static baseEntity = BaseLoreEntry.entity;

	@Str(CardCategory.Faction) declare category: CardCategory.Faction;
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
