import { Model } from "pinia-orm";
import { Attr, BelongsTo, Num, Str, Uid } from "pinia-orm/dist/decorators";
import { Constructor, OptionalExceptFor, UUID } from "@/core/utils/types";
import { Icon } from "../utils/icons";
import {
	Categorizable,
	Category,
	Describable,
	HasIcon,
	Indexable,
	Orderable,
	Taggable,
} from "./types";
import { Character, Event, Faction, Folder, Location, Note, Quest } from ".";

export interface ILoreEntry extends Indexable, Orderable, Categorizable, Taggable {
	desc: string;
	folderId: UUID | null;
}

export type MinimalLoreEntry = OptionalExceptFor<ILoreEntry, "category" | "folderId">;

export const loreEntryEntityName = "loreEntries";

export class LoreEntry extends Model implements ILoreEntry, Describable, HasIcon {
	static entity: string | Category = loreEntryEntityName;
	static typeKey = "category";

	@Uid() declare id: UUID;
	@Str("") declare category: Category;
	@Str("") declare desc: string;
	@Num(-1) declare position: number; // Defaults to -1. Means 'next position'.
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

	// TODO remove
	static revive(data: MinimalLoreEntry) {
		return LoreEntry.create(data);
	}

	static create(data: MinimalLoreEntry) {
		const constructor: Constructor<LoreEntry> = this.types()[data.category];
		return new constructor(data);
	}

	getText(): string {
		return this.desc;
	}

	getAllText(): string[] {
		return [this.desc];
	}

	getIcon(): Icon {
		return Icon[this.category];
	}
}
