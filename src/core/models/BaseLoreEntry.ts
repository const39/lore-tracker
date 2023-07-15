import { Model } from "pinia-orm";
import { Attr, BelongsTo, Str, Uid } from "pinia-orm/dist/decorators";
import { CardCategory, ID } from "../model/cards";
import { Character, Event, Faction, Folder, Location, Note, Quest } from ".";

export interface IBaseLoreEntry {
	readonly _category: CardCategory;
	readonly id: ID;
	tags: ID[];
}

export class BaseLoreEntry extends Model implements IBaseLoreEntry {
	static entity: string | CardCategory = "lore-entity";
	static typeKey = "_category";

	@Uid() declare id: ID;
	@Str("") declare _category: CardCategory;
	@Attr([]) declare tags: ID[];
	@Attr(null) declare folderId: ID | null;

	@BelongsTo(() => Folder, 'folderId') declare parent: Folder<BaseLoreEntry> | undefined;

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
