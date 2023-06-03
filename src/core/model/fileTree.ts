import { MD5 } from "object-hash";
import { ID } from "@/core/model/cards";
import { t as $t } from "@/core/translation";
import { LocalisableError } from "../error";
import { deserializeMap, mergeMaps, serializeMap } from "../utilities";

export interface FolderMetadata {
	id: ID;
	name: string;
	color: string;
}

export type Indexable = { id: ID };

/**
 * Minimal data structure that a Folder class should implement.
 */
interface IFolder<Metadata extends FolderMetadata, File extends Indexable> {
	metadata: Metadata;
	parent?: Folder<Metadata, File>;
	files: File[];
	subfolders: Folder<Metadata, File>[];
}

/**
 * Data type of the keys used to index a FlatFolder.
 */
type Key = string;

/**
 * Structure of a flattened Folder object.
 */
interface FlatFolder<M extends FolderMetadata, T extends Indexable>
	extends Omit<IFolder<M, T>, "parent" | "subfolders"> {
	parent?: Key;
	subfolders: Key[];
}

/**
 * A Map describing a flattened Folder tree structure.
 */
type FlatTree<M extends FolderMetadata, T extends Indexable> = Map<Key, FlatFolder<M, T>>;

/**
 * An entry in a serialized {@link FlatTree}.
 * TODO: maybe remove the Map intermediary in the serialization process (do Folder -> object literal, instead of Folder -> Map -> object literal)
 */
export type SerializedFolder<M extends FolderMetadata, T extends Indexable> = Record<
	Key,
	FlatFolder<M, T>
>;

/**
 * Various error codes related to File and Folder processing.
 */
export enum FileErrorCodes {
	InvalidOperation,
	FolderNotFound,
	NameAlreadyUsed,
}

/**
 * Error related to File and Folder processing.
 * @see FileErrorCodes
 */
export class FileError extends Error implements LocalisableError {
	constructor(public code: FileErrorCodes, message?: string) {
		super(message);
	}

	override toLocaleString() {
		switch (this.code) {
			case FileErrorCodes.InvalidOperation:
				return $t("messages.errors.files.invalidOperation.title");
			case FileErrorCodes.FolderNotFound:
				return $t("messages.errors.files.folderNotFound.title");
			case FileErrorCodes.NameAlreadyUsed:
				return $t("messages.errors.files.nameAlreadyUsed.title");
		}
	}
}

/**
 * Immutable data structure that acts as a file system-like pointer to a {@link Folder}.
 */
export class Path {
	static readonly ILLEGAL_CHARS_REGEX = /(\/|\\|:|\||<|>|\?|"|\*|%)+/g;

	readonly rawSegments: ReadonlyArray<string>;

	/**
	 * Create a new Path from strings or other Path segments.
	 */
	constructor(...segments: Array<string | Path>) {
		let segs: string[] = [];
		if (segments) {
			segs = segments
				.flatMap((s) => (typeof s === "string" ? Path.sanitize(s) : s.rawSegments))
				.filter((s) => s.length > 0);
		}
		this.rawSegments = Object.freeze(segs);
	}

	/**
	 * Create a new Path from a URI string.
	 * @param uri the URI to create the path from
	 */
	static fromURI(uri: string) {
		// Remove consecutive forward slashes
		const clean = uri.replace(/\/+/g, "/");
		return new Path(...clean.split("/"));
	}

	/**
	 * Sanitize segment to allow it to be used as a path fragment.
	 * This process specifically removes any illegal character from the string.
	 *
	 * @param segment the string to sanitize
	 * @returns the sanitized string
	 */
	static sanitize(segment: string) {
		// 1. Trim any leading or trailing whitespace
		// 2. Convert to lower case
		// 3. Remove any illegal characters
		return segment.trim().toLowerCase().replace(Path.ILLEGAL_CHARS_REGEX, "");
	}

	/**
	 * Number of segments in this Path.
	 */
	get length() {
		return this.rawSegments.length;
	}

	/**
	 * Returns an array where each one of this path's fragments are Path objects themselves.
	 */
	get pathSegments() {
		return this.rawSegments.map((s) => new Path(s));
	}

	/**
	 * Indicates if this Path points to the root of a Folder tree (i.e. it has no fragment).
	 *
	 * @returns true if this Path is root
	 *
	 * @example
	 * Path.fromURI('/').isRoot() // true
	 * Path.fromURI('/foo').isRoot() // false
	 *
	 */
	isRoot() {
		return this.rawSegments.length < 1;
	}

	/**
	 * Get the head slice of this Path.
	 *
	 * @example
	 * Path.fromURI('/foo/bar/baz').getHead() // Path('/foo/bar')
	 */
	getHead() {
		return new Path(...this.rawSegments.slice(0, -1));
	}

	/**
	 * Get the tail slice of this Path.
	 *
	 * @example
	 * Path.fromURI('/foo/bar/baz').getTail() // Path('/bar/baz')
	 */
	getTail() {
		return new Path(...this.rawSegments.slice(1));
	}

	/**
	 * Get the first fragment of this Path.
	 *
	 * @example
	 * Path.fromURI('/foo/bar/baz').getStart() // Path('/foo')
	 */
	getStart() {
		return new Path(this.rawSegments[0]);
	}

	/**
	 * Get the last fragment of this Path.
	 *
	 * @example
	 * Path.fromURI('/foo/bar/baz').getEnd() // Path('/baz')
	 */
	getEnd() {
		return new Path(this.rawSegments.slice(-1)[0]);
	}

	/**
	 * Get the string representation of this Path.
	 *
	 * @param options
	 * 	- leadingSlash: whether to including the leading slash. Defaults to true.
	 */
	toString(options?: { leadingSlash?: boolean }) {
		const { leadingSlash = true } = options ?? {};
		const joined = this.rawSegments.join("/");
		return leadingSlash ? "/" + joined : joined;
	}
}

/**
 * Folder tree structure.
 * Each node stores a list of files along with its own metadata.
 */
export class Folder<Metadata extends FolderMetadata, File extends Indexable>
	implements IFolder<Metadata, File>
{
	/**
	 * Create a new Folder.
	 * @param metadata this folder's metadata
	 * @param parent this folder's parent. If left empty, this folder will be the root of the folder tree.
	 * @param files Optional. A list of files stored inside this folder.
	 * @param subfolders Optional. A list of subfolders (i.e. the child nodes of this tree node).
	 */
	constructor(
		public metadata: Metadata,
		public parent?: Folder<Metadata, File>,
		public files: File[] = [],
		public subfolders: Folder<Metadata, File>[] = []
	) {}

	/**
	 * The absolute path pointing to this folder.
	 *
	 * If this folder is the tree root, the path is a root path as well.
	 */
	get absolutePath(): Path {
		return this.parent ? new Path(this.parent.absolutePath, this.metadata.name) : new Path();
	}

	// ** File-related methods **

	/**
	 * Add a file inside this folder.
	 *
	 * @param file the file to add
	 * @param where whether to add the file at the head or tail of the file list. Default to "head".
	 */
	addFile(file: File, where: "head" | "tail" = "head") {
		where === "head" ? this.files.unshift(file) : this.files.push(file);
	}

	/**
	 * Get a file inside this folder by its ID.
	 * @param id the file's ID
	 * @returns the file if it is found inside this folder, undefined otherwise.
	 */
	getFile(id: ID): File | undefined {
		return this.getFolderWithFile(id)?.file;
	}

	/**
	 * Delete a file from this folder.
	 *
	 * If no such file is found in the folder, this function has no effect.
	 *
	 * @param id the file's ID
	 */
	deleteFile(id: ID) {
		const idx = this.files.findIndex((f) => f.id === id);
		if (idx !== -1) this.files.splice(idx, 1);
	}

	// ** Folder-related methods **

	/**
	 * Check if a Folder exists in the sub-tree formed by this folder.
	 * @param id the ID of the folder to search
	 * @returns true if the folder exists somewhere in the sub-tree, false otherwise
	 */
	hasFolder(id: ID): boolean;

	/**
	 * Check if a Folder exists in the sub-tree formed by this folder.
	 * @param path a Path pointing to the folder to search
	 * @returns true if the folder exists somewhere in the sub-tree, false otherwise
	 */
	hasFolder(path: Path): boolean;

	hasFolder(arg: Path | ID) {
		if (arg instanceof Path) return this.getFolderByPath(arg) !== undefined;
		return this.getFolderByID(arg) !== undefined;
	}

	/**
	 * Get a Folder by its ID in the sub-tree formed by this folder.
	 * @param id the ID of the folder to get
	 * @returns the Folder if it is found somewhere in the sub-tree, undefined otherwise
	 */
	getFolderByID(id: ID): Folder<Metadata, File> | undefined {
		// Search through this folder's children
		const res = this.subfolders.find((folder) => folder.metadata.id === id);
		if (res) return res;

		// Search recursively in all subfolders until we find it (DFS algorithm)
		for (const folder of this.subfolders) {
			const maybeFolder = folder.getFolderByID(id);
			if (maybeFolder !== undefined) return maybeFolder;
		}
		return undefined;
	}

	/**
	 * Get a Folder by its ID in the sub-tree formed by this folder.
	 * @param path a Path pointing to the folder to get
	 * @returns the Folder if it is found somewhere in the sub-tree, undefined otherwise
	 */
	getFolderByPath(path: Path): Folder<Metadata, File> | undefined {
		// If path points to the current folder, stop search
		if (path.isRoot()) return this;
		else if (path.length === 1) {
			// Search through this folder's children
			return this.subfolders.find(
				(folder) => folder.metadata.name.toLowerCase() === path.rawSegments[0]
			);
		} else {
			// Search recursively in all subfolders until we find it (DFS algorithm)
			for (const folder of this.subfolders) {
				const maybeFolder = folder.getFolderByPath(path.getTail());
				if (maybeFolder !== undefined) return maybeFolder;
			}
		}
		return undefined;
	}

	/**
	 * Get the first Folder (in the sub-tree formed by this folder) which contains a file with the specified ID.
	 * @param fileID the file's ID
	 * @returns the Folder if it is found somewhere in the sub-tree, undefined otherwise
	 */
	getFolderWithFile(fileID: ID): { folder: Folder<Metadata, File>; file: File } | undefined {
		// Search file in this folder
		const maybeFile = this.files.find((file) => file.id === fileID);
		if (maybeFile) return { folder: this, file: maybeFile };

		// If the file is not in this folder, search recursively in all subfolders until we find it (DFS algorithm)
		for (const folder of this.subfolders) {
			const res = folder.getFolderWithFile(fileID);
			if (res) return res;
		}
		return undefined;
	}

	/**
	 * Walk up the tree starting from this folder up to the root folder to retrace this folder's hierarchy.
	 *
	 * @returns the list of this folder's parents, from the highest one to this folder (included).
	 */
	getHierarchy() {
		const hierarchy = [];
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		let folder: Folder<Metadata, File> | undefined = this;
		do {
			hierarchy.push(folder);
			folder = folder.parent;
		} while (folder !== undefined);

		// Reverse the list to get the result in root > target order
		return hierarchy.reverse();
	}

	/**
	 * Add a subfolder to this folder.
	 *
	 * @param folder the folder to add
	 * @param where whether to add the folder at the head or tail of the subfolder list. Default to "head".
	 *
	 * @throws {FileError} if the specified folder is one of children of this folder
	 */
	addFolder(folder: Folder<Metadata, File>, where: "head" | "tail" = "head") {
		if (folder.hasFolder(this.metadata.id))
			throw new FileError(
				FileErrorCodes.InvalidOperation,
				`Cannot add a folder to one of its own children. Tried to add folder ${folder.metadata.name} in parent ${this.metadata.name}.`
			);

		where === "head" ? this.subfolders.unshift(folder) : this.subfolders.push(folder);
		folder.parent = this;
	}

	/**
	 * Delete a subfolder of this folder.
	 *
	 * @param folder the folder to delete
	 *
	 * @throws {FileError} if the specified subfolder does not exist
	 */
	deleteFolder(folder: Folder<Metadata, File>) {
		const idx = this.subfolders.findIndex((f) => f.metadata.id === folder.metadata.id);
		if (idx !== -1) {
			folder.parent = undefined;
			this.subfolders.splice(idx, 1);
		} else
			throw new FileError(
				FileErrorCodes.FolderNotFound,
				`Cannot delete nonexistent folder. Tried to delete subfolder ${folder.metadata.name} in parent ${this.metadata.name}.`
			);
	}

	/**
	 * Move this folder to another folder.
	 *
	 * @param to the destination folder
	 *
	 * @throws {FileError} if the move operation could not be performed
	 */
	moveFolder(to: Folder<Metadata, File>) {
		if (this === to)
			throw new FileError(
				FileErrorCodes.InvalidOperation,
				`Cannot move a folder into itself. Tried to move folder ${this.metadata.name}.`
			);
		if (to.hasFolder(new Path(this.metadata.name)))
			throw new FileError(
				FileErrorCodes.NameAlreadyUsed,
				`Cannot move folder named ${this.metadata.name} to ${to.absolutePath}: a folder with the same name already exists.`
			);
		if (this.hasFolder(to.metadata.id))
			throw new FileError(
				FileErrorCodes.InvalidOperation,
				`Cannot move a folder into one of its children. Tried to move folder ${this.metadata.name} in parent ${to.metadata.name}.`
			);
		this.parent?.deleteFolder(this);
		to.addFolder(this);
	}

	// This method is intended to be private, but we cannot enforce it because TS clashes with Vue's reactivity system when dealing with private properties
	// @see https://github.com/vuejs/core/issues/2981
	/**
	 * ! This is intended to be a private method. Do not use outside this class. Use {@link serialize()} instead.
	 *
	 * Flatten this folder.
	 *
	 * @param parentHash the object hash of this folder's parent, if any
	 * @returns the flattened structure of the sub-tree formed by this Folder node, along with its object hash.
	 */
	_flatten(parentHash?: Key) {
		const map: FlatTree<Metadata, File> = new Map<Key, FlatFolder<Metadata, File>>();
		const objHash = MD5(this);

		const childrenHashes: Key[] = [];
		for (const subfolder of this.subfolders) {
			// Safeguard to prevent subfolder to be undefined
			// -> Because this method is called immediately after ANY change to the folder data by the serialization system,
			// 	  subfolder may still be in the subfolders as an undefined value (typically after a folder deletion)
			if (subfolder) {
				const { map: res, hash } = subfolder._flatten(objHash);
				mergeMaps(map, res);
				childrenHashes.push(hash);
			}
		}

		const flatFolder: FlatFolder<Metadata, File> = {
			metadata: this.metadata,
			files: this.files,
			parent: parentHash,
			subfolders: childrenHashes,
		};

		if (!map.has(objHash)) map.set(objHash, flatFolder);

		return {
			map,
			hash: objHash,
		};
	}

	/**
	 * Serialize this Folder's circular tree structure to a serializable flat Map structure.
	 *
	 * @returns a serialized representation of the sub-tree formed by this Folder node
	 */
	serialize() {
		const { map } = this._flatten();
		return serializeMap(map);
	}

	/**
	 * Re-create a Folder sub-tree from a serialized flat folder.
	 *
	 * @param serialized the serialized flat folder structure
	 * @returns the root Folder of the revived sub-tree
	 */
	static deserialize<Metadata extends FolderMetadata, File extends Indexable>(
		serialized: SerializedFolder<Metadata, File>
	) {
		// Object literal -> Map
		const flatMap = deserializeMap(serialized);

		/**
		 * Recursive reviver function.
		 *
		 * @param flatFolder the folder to revive
		 * @param revivedParent the revived folder's parent
		 * @returns a revived sub-tree with the specified folder as root
		 */
		const revive = (
			flatFolder: FlatFolder<Metadata, File>,
			revivedParent?: Folder<Metadata, File>
		): Folder<Metadata, File> => {
			const folder = new this(flatFolder.metadata, revivedParent, flatFolder.files);
			folder.subfolders = flatFolder.subfolders.map((hash) => {
				return revive(flatMap.get(hash)!, folder);
			});
			return folder;
		};

		// Get root node (i.e. the node with no parent)
		const root = [...flatMap.values()].find((flatFolder) => flatFolder.parent === undefined);
		if (!root) return undefined;

		// Start recursive revival from the tree root
		return revive(root);
	}
}
