import { Model } from "pinia-orm";
import { Attr, BelongsTo, HasMany, Num, Str, Uid } from "pinia-orm/dist/decorators";
import { UUID } from "../utils/types";
import { LoreEntry, ILoreEntry } from "./LoreEntry";
import { Category } from "./types";

/**
 * Minimal data structure that a Folder class should implement.
 */
export interface IFolder<File extends ILoreEntry> {
	readonly id: UUID;
	readonly category: Category;
	name: string;
	color: string;
	position: number;
	tags: UUID[];
	parent?: IFolder<File>;
	files: File[];
	subfolders: IFolder<File>[];
}

export const folderEntityName = "folders";

export class Folder<File extends ILoreEntry> extends Model implements IFolder<File> {
	static entity = folderEntityName;

	@Uid() declare id: UUID;
	@Str("") declare category: Category;
	@Str("") declare name: string;
	@Str("") declare color: string;
	@Num(0) declare position: number;
	@Attr([]) declare tags: UUID[];
	@Attr(null) declare parentId: UUID | null;

	@BelongsTo(() => Folder, "parentId") declare parent: Folder<File> | undefined;
	@HasMany(() => LoreEntry, "folderId") declare files: File[];
	@HasMany(() => Folder, "parentId") declare subfolders: Folder<File>[];

	constructor(data?: IFolder<File>) {
		super(data);
	}
}
