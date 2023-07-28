import { Icon } from "../utils/icons";
import { UUID } from "../utils/types";
import { Categorizable, Category, Describable, HasIcon, Indexable } from "./types";

export class Tag {
	constructor(
		public id: UUID,
		public category: Category,
		public text: string,
		public icon: Icon
	) {}

	static from(from: Indexable & Categorizable & Describable & HasIcon) {
		return new Tag(from.id, from.category, from.getText(), from.getIcon());
	}
}
