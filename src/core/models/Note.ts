import { Str } from "pinia-orm/dist/decorators";
import { CardCategory } from "@/core/model/cards";
import { BaseLoreEntry, IBaseLoreEntry } from "./BaseLoreEntry";

export interface INote extends IBaseLoreEntry {
	readonly category: CardCategory.Note;
	title: string;
	desc: string;
}

export class Note extends BaseLoreEntry implements INote {
	static entity = CardCategory.Note;
	static baseEntity = BaseLoreEntry.entity;

	@Str(CardCategory.Note) declare category: CardCategory.Note;
	@Str("") declare title: string;
	@Str("") declare desc: string;

	// Inherit super class model fields
	static fields() {
		return { ...super.schemas[super.entity] };
	}

	constructor(data?: INote) {
		super(data);
	}
}
