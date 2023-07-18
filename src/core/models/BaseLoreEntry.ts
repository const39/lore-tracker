import { Model } from "pinia-orm";
import { Attr, BelongsTo, Num, Str, Uid } from "pinia-orm/dist/decorators";
import { UUID } from "@/core/utils/types";
import { CardCategory } from "../model/cards";
import { Character, Event, Faction, Folder, Location, Note, Quest } from ".";

export interface IBaseLoreEntry {
	readonly id: UUID;
	readonly category: CardCategory;
	position: number;
	tags: UUID[];
}

export const loreEntryEntityName = "loreEntries";

export class BaseLoreEntry extends Model implements IBaseLoreEntry {
	static entity: string | CardCategory = loreEntryEntityName;
	static typeKey = "category";

	@Uid() declare id: UUID;
	@Str("") declare category: CardCategory;
	@Num(0) declare position: number;
	@Attr([]) declare tags: UUID[];
	@Attr(null) declare folderId: UUID | null;

	@BelongsTo(() => Folder, "folderId") declare parent: Folder<BaseLoreEntry> | undefined;

	static types() {
		return {
			[CardCategory.Quest]: Quest,
			[CardCategory.Event]: Event,
			[CardCategory.Character]: Character,
			[CardCategory.Location]: Location,
			[CardCategory.Faction]: Faction,
			[CardCategory.Note]: Note,
		};
	}
}
