import { Attr, BelongsTo, Num, Str, Uid } from "pinia-orm/dist/decorators";
import { Constructor, OptionalExceptFor, UUID } from "@/core/utils/types";
import { IndexedDBAdapter, database } from "../persistence";
import { Icon } from "../utils/icons";
import { PersistentModel } from "./PersistentModel";
import {
	Categorizable,
	Category,
	Describable,
	HasIcon,
	Indexable,
	Orderable,
	StoreName,
	Taggable,
} from "./types";
import { Campaign, Character, Event, Faction, Folder, Location, Note, Quest } from ".";

export interface ILoreEntry extends Indexable, Orderable, Categorizable, Taggable {
	desc: string;
	folderId: UUID | undefined;
	campaignId: UUID | undefined;
}

export type MinimalLoreEntry = OptionalExceptFor<ILoreEntry, "category" | "folderId">;

export class LoreEntry extends PersistentModel implements ILoreEntry, Describable, HasIcon {
	static entity: string | Category = StoreName.LoreEntry;
	static persistenceBackend = new IndexedDBAdapter<LoreEntry>(database, StoreName.LoreEntry);
	static typeKey = "category";

	@Uid() declare id: UUID;
	@Str("") declare category: Category;
	@Str("") declare desc: string;
	@Num(-1) declare position: number; // Defaults to -1. Means 'next position'.
	@Attr([]) declare tags: UUID[];
	@Attr(undefined) declare folderId: UUID | undefined;
	@Attr(undefined) declare campaignId: UUID | undefined;

	@BelongsTo(() => Folder, "folderId") declare parent: Folder<LoreEntry> | undefined;
	@BelongsTo(() => Campaign, "campaignId") declare campaign: Campaign | undefined;

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

	/**
	 * Revive a lore entry record to an actual LoreEntry instance.
	 */
	static revive(data: Record<string, any>) {
		// Ensure the record matches the minimal expected data
		if ("category" in data && Object.values(Category).includes(data.category))
			return LoreEntry.create(data as MinimalLoreEntry);
		throw new Error("Item does not match the expected LoreEntry data structure.");
	}

	/**
	 * Create a LoreEntry instance using the correct subclass constructor based on the 'category' discriminator field.
	 *
	 * @param data the data of the lore entry to create
	 * @returns an instance of a subclass of LoreEntry
	 *
	 * @see {@link LoreEntry.types()}: the mapping between the discriminator value and the subclass constructor
	 */
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
