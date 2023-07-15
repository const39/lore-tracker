import { Attr, Str, Uid } from "pinia-orm/dist/decorators";
import { CardCategory, ID } from "@/core/model/cards";
import { BaseLoreEntry, IBaseLoreEntry } from "./BaseLoreEntry";

export interface Task {
	isCompleted: boolean;
	desc: string;
}

export interface IQuest extends IBaseLoreEntry {
	readonly _category: CardCategory.Quest;
	title: string;
	desc: string;
	tasks: Task[];
}

export class Quest extends BaseLoreEntry implements IQuest {
	static entity = CardCategory.Quest;
	static baseEntity = BaseLoreEntry.entity;

	@Str(CardCategory.Quest) declare _category: CardCategory.Quest;
	@Uid() declare id: ID;
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
