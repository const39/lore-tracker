import { Str } from "pinia-orm/dist/decorators";
import { ILoreEntry, LoreEntry, MinimalLoreEntry } from "./LoreEntry";
import { Category } from "./types";

interface INote extends ILoreEntry {
	readonly category: Category.Note;
	title: string;
}

type MinimalNote = MinimalLoreEntry & Partial<INote>;

export class Note extends LoreEntry implements INote {
	static entity = Category.Note;
	static baseEntity = LoreEntry.entity;

	@Str(Category.Note) declare category: Category.Note;
	@Str("") declare title: string;

	// Inherit super class model fields
	static fields() {
		return { ...super.schemas[super.entity] };
	}

	constructor(data: MinimalNote, ...args: any[]) {
		super(data, ...args);
	}

	getText() {
		if (this.title.trim()) return this.title;
		return super.getText();
	}
}
