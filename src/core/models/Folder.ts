import { Attr, BelongsTo, HasMany, Num, Str, Uid } from "pinia-orm/dist/decorators";
import { IndexedDBAdapter, database } from "../persistence";
import { getRandomColor } from "../utils/colors";
import { Icon } from "../utils/icons";
import { OptionalExceptFor, UUID } from "../utils/types";
import { Campaign } from "./Campaign";
import { LoreEntry } from "./LoreEntry";
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

/**
 * Data structure contract a Folder class should implement.
 */
export interface IFolder extends Indexable, Orderable, Categorizable, Taggable {
	name: string;
	color: string;
	parentId: UUID | undefined;
	campaignId: UUID | undefined;
}

type MinimalFolder = OptionalExceptFor<IFolder, "category" | "campaignId">;

export class Folder<File extends LoreEntry = LoreEntry>
	extends PersistentModel
	implements IFolder, Describable, HasIcon
{
	static entity = StoreName.Folder;
	static persistenceBackend = new IndexedDBAdapter<Folder>(database, StoreName.Folder);

	@Uid() declare id: UUID;
	@Str("") declare category: Category;
	@Str("") declare name: string;
	@Str(getRandomColor()) declare color: string;
	@Num(-1) declare position: number; // Defaults to -1. Means 'next position'.
	@Attr([]) declare tags: UUID[];
	@Attr(undefined) declare parentId: UUID | undefined;
	@Attr(undefined) declare campaignId: UUID | undefined;

	@BelongsTo(() => Folder, "parentId") declare parent: Folder<File> | undefined;
	@HasMany(() => LoreEntry, "folderId") declare files: File[];
	@HasMany(() => Folder, "parentId") declare subfolders: Folder<File>[];
	@BelongsTo(() => Campaign, "campaignId") declare campaign: Campaign | undefined;

	constructor(data: MinimalFolder, ...args: any[]) {
		// Generate a random color if none is given
		const d = data?.color ? data : { ...data, color: getRandomColor() };
		super(d, ...args);
	}

	/**
	 * Revive a folder record to an actual Folder instance.
	 */
	static revive(data: Record<string, any>) {
		// Ensure the record matches the minimal expected data
		if ("category" in data && Object.values(Category).includes(data.category))
			return new Folder(data as MinimalFolder);
		throw new Error("Item does not match the expected Folder data structure.");
	}

	static createRootFolder(campaign: Campaign, category: Category) {
		return new Folder({ campaignId: campaign.id, category, name: `${category}-root` });
	}

	getText() {
		return this.name;
	}

	getAllText() {
		return [this.name];
	}

	getIcon() {
		return Icon.folder;
	}

	isRoot() {
		return this.parentId === null;
	}
}
