import { Attr, Str } from "pinia-orm/dist/decorators";
import { CardCategory } from "@/core/model/cards";
import { BaseLoreEntry, IBaseLoreEntry } from "./BaseLoreEntry";

export interface Task {
	isCompleted: boolean;
	desc: string;
}

export interface IQuest extends IBaseLoreEntry {
	readonly category: CardCategory.Quest;
	title: string;
	desc: string;
	tasks: Task[];
}

export class Quest extends BaseLoreEntry implements IQuest {
	static entity = CardCategory.Quest;
	static baseEntity = BaseLoreEntry.entity;

	@Str(CardCategory.Quest) declare category: CardCategory.Quest;
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
