import { Model } from "pinia-orm";
import { Attr, BelongsTo, HasMany, Num, Str, Uid } from "pinia-orm/dist/decorators";
import { CardCategory } from "../model/cards";
import { UUID } from "../utils/types";
import { BaseLoreEntry, IBaseLoreEntry } from "./BaseLoreEntry";

/**
 * Minimal data structure that a Folder class should implement.
 */
export interface IFolder<File extends IBaseLoreEntry> {
	readonly id: UUID;
	readonly category: CardCategory;
	name: string;
	color: string;
	position: number;
	tags: UUID[];
	parent?: IFolder<File>;
	files: File[];
	subfolders: IFolder<File>[];
}

export const folderEntityName = "folders";

export class Folder<File extends IBaseLoreEntry> extends Model implements IFolder<File> {
	static entity = folderEntityName;

	@Uid() declare id: UUID;
	@Str("") declare category: CardCategory;
	@Str("") declare name: string;
	@Str("") declare color: string;
	@Num(0) declare position: number;
	@Attr([]) declare tags: UUID[];
	@Attr(null) declare parentId: UUID | null;

	@BelongsTo(() => Folder, "parentId") declare parent: Folder<File> | undefined;
	@HasMany(() => BaseLoreEntry, "folderId") declare files: File[];
	@HasMany(() => Folder, "parentId") declare subfolders: Folder<File>[];

	constructor(data?: IFolder<File>) {
		super(data);
	}
}
