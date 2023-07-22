import { Attr, Str } from "pinia-orm/dist/decorators";
import { ILoreEntry, LoreEntry, MinimalLoreEntry } from "./LoreEntry";
import { Category } from "./types";

export interface Task {
	isCompleted: boolean;
	desc: string;
}

interface IQuest extends ILoreEntry {
	readonly category: Category.Quest;
	title: string;
	tasks: Task[];
}

type MinimalQuest = MinimalLoreEntry & Partial<IQuest>;

export class Quest extends LoreEntry implements IQuest {
	static entity = Category.Quest;
	static baseEntity = LoreEntry.entity;

	@Str(Category.Quest) declare category: Category.Quest;
	@Str("") declare title: string;
	@Attr([]) declare tasks: Task[];

	// Inherit super class model fields
	static fields() {
		return { ...super.schemas[super.entity] };
	}

	constructor(data: MinimalQuest, ...args: any[]) {
		super(data, ...args);
	}

	getText() {
		if (this.title.trim()) return this.title;
		return super.getText();
	}
}
