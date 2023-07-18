import { Attr, Str } from "pinia-orm/dist/decorators";
import { LoreEntry, ILoreEntry } from "./LoreEntry";
import { Category } from "./types";

export interface Task {
	isCompleted: boolean;
	desc: string;
}

export interface IQuest extends ILoreEntry {
	readonly category: Category.Quest;
	title: string;
	desc: string;
	tasks: Task[];
}

export class Quest extends LoreEntry implements IQuest {
	static entity = Category.Quest;
	static baseEntity = LoreEntry.entity;

	@Str(Category.Quest) declare category: Category.Quest;
	@Str("") declare title: string;
	@Str("") declare desc: string;
	@Attr([]) declare tasks: Task[];

	// Inherit super class model fields
	static fields() {
		return { ...super.schemas[super.entity] };
	}

	constructor(data?: IQuest) {
		super(data);
	}
}
