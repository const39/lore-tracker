import { Str } from "pinia-orm/dist/decorators";
import { LoreEntry, ILoreEntry } from "./LoreEntry";
import { Category } from "./types";

export interface INote extends ILoreEntry {
	readonly category: Category.Note;
	title: string;
	desc: string;
}

export class Note extends LoreEntry implements INote {
	static entity = Category.Note;
	static baseEntity = LoreEntry.entity;

	@Str(Category.Note) declare category: Category.Note;
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
