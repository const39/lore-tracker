import { Model } from "pinia-orm";
import { Attr, BelongsTo, Num, Str, Uid } from "pinia-orm/dist/decorators";
import { Constructor, UUID } from "@/core/utils/types";
import { Categorizable, Category, Describable, Indexable, Orderable, Taggable } from "./types";
import { Character, Event, Faction, Folder, Location, Note, Quest } from ".";

export interface ILoreEntry extends Indexable, Orderable, Categorizable, Taggable {
	desc: string;
	folderId: UUID | null;
}

export const loreEntryEntityName = "loreEntries";

export class LoreEntry extends Model implements ILoreEntry, Describable {
	static entity: string | Category = loreEntryEntityName;
	static typeKey = "category";

	@Uid() declare id: UUID;
	@Str("") declare category: Category;
	@Str("") declare desc: string;
	@Num(0) declare position: number;
	@Attr([]) declare tags: UUID[];
	@Attr(null) declare folderId: UUID | null;

	@BelongsTo(() => Folder, "folderId") declare parent: Folder<LoreEntry> | undefined;

	static override types() {
		return {
			[Category.Quest]: Quest,
			[Category.Event]: Event,
			[Category.Character]: Character,
			[Category.Location]: Location,
			[Category.Faction]: Faction,
			[Category.Note]: Note,
		};
	}

	static revive(data: ILoreEntry) {
		const constructor: Constructor<LoreEntry> = this.types()[data.category];
		return new constructor(data);
	}

	getText() {
		return this.desc;
	}
}
