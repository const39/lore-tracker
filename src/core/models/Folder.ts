import { Model } from "pinia-orm";
import { Attr, BelongsTo, HasMany, Num, Str, Uid } from "pinia-orm/dist/decorators";
import { getRandomColor } from "../utils/colors";
import { Icon } from "../utils/icons";
import { OptionalExceptFor, UUID } from "../utils/types";
import { LoreEntry } from "./LoreEntry";
import {
	Categorizable,
	Category,
	Describable,
	HasIcon,
	Indexable,
	Orderable,
	Taggable,
} from "./types";

/**
 * Data structure contract a Folder class should implement.
 */
interface IFolder extends Indexable, Orderable, Categorizable, Taggable {
	name: string;
	color: string;
	parentId: UUID | null;
}

type MinimalFolder = OptionalExceptFor<IFolder, "category">;

export const folderEntityName = "folders";

export class Folder<File extends LoreEntry = LoreEntry>
	extends Model
	implements IFolder, Describable, HasIcon
{
	static entity = folderEntityName;

	@Uid() declare id: UUID;
	@Str("") declare category: Category;
	@Str("") declare name: string;
	@Str(getRandomColor()) declare color: string;
	@Num(0) declare position: number;
	@Attr([]) declare tags: UUID[];
	@Attr(null) declare parentId: UUID | null;

	@BelongsTo(() => Folder, "parentId") declare parent: Folder<File> | undefined;
	@HasMany(() => LoreEntry, "folderId") declare files: File[];
	@HasMany(() => Folder, "parentId") declare subfolders: Folder<File>[];

	constructor(data: MinimalFolder, ...args: any[]) {
		// Generate a random color if none is given
		const d = data?.color ? data : { ...data, color: getRandomColor() };
		super(d, ...args);
	}

	static revive(data: MinimalFolder) {
		return new Folder(data);
	}

	static createRootFolder(category: Category) {
		return new Folder({ category, name: `${category}-root` });
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
