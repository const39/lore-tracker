import { Attr, Str } from "pinia-orm/dist/decorators";
import { BaseLoreEntry, IBaseLoreEntry } from "./BaseLoreEntry";
import { Category } from "./types";

export interface Task {
	isCompleted: boolean;
	desc: string;
}

export interface IQuest extends IBaseLoreEntry {
	readonly category: Category.Quest;
	title: string;
	desc: string;
	tasks: Task[];
}

export class Quest extends BaseLoreEntry implements IQuest {
	static entity = Category.Quest;
	static baseEntity = BaseLoreEntry.entity;

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
