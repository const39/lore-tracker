import { Model } from "pinia-orm";
import { Attr, BelongsTo, HasMany, Str, Uid } from "pinia-orm/dist/decorators";
import { ID } from "@/core/model/cards";
import { BaseLoreEntry, IBaseLoreEntry } from "./BaseLoreEntry";

/**
 * Minimal data structure that a Folder class should implement.
 */
export interface IFolder<File extends IBaseLoreEntry> {
	id: ID;
	name: string;
	color: string;
	tags: ID[];
	parent?: IFolder<File>;
	files: File[];
	subfolders: IFolder<File>[];
}

export class Folder<File extends IBaseLoreEntry> extends Model implements IFolder<File> {
	static entity = "folder";

	@Uid() declare id: ID;
	@Str("") declare name: string;
	@Str("") declare color: string;
	@Attr([]) declare tags: ID[];
	@Attr(null) declare parentId: ID | null;

	@BelongsTo(() => Folder, "parentId") declare parent: Folder<File> | undefined;
	@HasMany(() => BaseLoreEntry, "folderId") declare files: File[];
	@HasMany(() => Folder, "parentId") declare subfolders: Folder<File>[];

	constructor(data?: IFolder<File>) {
		super(data);
	}
}
