import { Model } from "pinia-orm";
import { Attr, BelongsTo, Num, Str, Uid } from "pinia-orm/dist/decorators";
import { UUID } from "@/core/utils/types";
import { Categorizable, Category, Indexable, Orderable, Taggable } from "./types";
import { Character, Event, Faction, Folder, Location, Note, Quest } from ".";

export interface ILoreEntry extends Indexable, Orderable, Categorizable, Taggable {
	folderId: UUID | null;
}

export const loreEntryEntityName = "loreEntries";

export class LoreEntry extends Model implements ILoreEntry {
	static entity: string | Category = loreEntryEntityName;
	static typeKey = "category";

	@Uid() declare id: UUID;
	@Str("") declare category: Category;
	@Num(0) declare position: number;
	@Attr([]) declare tags: UUID[];
	@Attr(null) declare folderId: UUID | null;

	@BelongsTo(() => Folder, "folderId") declare parent: Folder<LoreEntry> | undefined;

	static types() {
		return {
			[Category.Quest]: Quest,
			[Category.Event]: Event,
			[Category.Character]: Character,
			[Category.Location]: Location,
			[Category.Faction]: Faction,
			[Category.Note]: Note,
		};
	}
}
