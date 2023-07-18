import { Str } from "pinia-orm/dist/decorators";
import { BaseLoreEntry, IBaseLoreEntry } from "./BaseLoreEntry";
import { Category } from "./types";

export interface INote extends IBaseLoreEntry {
	readonly category: Category.Note;
	title: string;
	desc: string;
}

export class Note extends BaseLoreEntry implements INote {
	static entity = Category.Note;
	static baseEntity = BaseLoreEntry.entity;

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
