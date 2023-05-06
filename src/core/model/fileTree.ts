import { MD5 } from "object-hash";
import { ID } from "@/core/model/cards";
import { deserializeMap, mergeMaps, serializeMap } from "../utilities";

export interface FolderMetadata {
	id: ID;
	name: string;
	color: string;
}

export type Indexable = { id: ID };

interface IFolder<Metadata extends FolderMetadata, File extends Indexable> {
	metadata: Metadata;
	parent?: Folder<Metadata, File>;
	files: File[];
	subfolders: Folder<Metadata, File>[];
}

type Key = string;

interface FlatFolder<M extends FolderMetadata, T extends Indexable>
	extends Omit<IFolder<M, T>, "parent" | "subfolders"> {
	parent?: Key;
	subfolders: Key[];
}

type FlatTree<M extends FolderMetadata, T extends Indexable> = Map<Key, FlatFolder<M, T>>;

export type SerializedFolder<M extends FolderMetadata, T extends Indexable> = Record<
	Key,
	FlatFolder<M, T>
>;

export class Path {
	static readonly ILLEGAL_CHARS_REGEX = /(\/|\\|:|\||<|>|\?|"|\*|%)+/g;

	readonly rawSegments: ReadonlyArray<string>;

	constructor(...segments: Array<string | Path>) {
		let segs: string[] = [];
		if (segments) {
			segs = segments
				.flatMap((s) => (typeof s === "string" ? Path.sanitize(s) : s.rawSegments))
				.filter((s) => s.trim().length > 0);
		}
		this.rawSegments = Object.freeze(segs);
	}

	static fromURI(uri: string) {
		// Remove consecutive forward slashes
		const clean = uri.replace(/\/+/g, "/");
		return new Path(...clean.split("/"));
	}

	static sanitize(segment: string) {
		// 1. Trim any leading or trailing whitespace
		// 2. Convert to lower case
		// 3. Remove any illegal characters
		return segment.trim().toLowerCase().replace(Path.ILLEGAL_CHARS_REGEX, "");
	}

	get length() {
		return this.rawSegments.length;
	}

	get pathSegments() {
		return this.rawSegments.map((s) => new Path(s));
	}

	isRoot() {
		return this.rawSegments.length < 1;
	}

	getHead() {
		return new Path(...this.rawSegments.slice(0, -1));
	}

	getTail() {
		return new Path(...this.rawSegments.slice(1));
	}

	getStart() {
		return new Path(this.rawSegments[0]);
	}

	getEnd() {
		return new Path(this.rawSegments.slice(-1)[0]);
	}

	toString(options?: { leadingSlash?: boolean }) {
		const { leadingSlash = true } = options ?? {};
		const joined = this.rawSegments.join("/");
		return leadingSlash ? "/" + joined : joined;
	}
}

export class Folder<Metadata extends FolderMetadata, File extends Indexable>
	implements IFolder<Metadata, File>
{
	constructor(
		public metadata: Metadata,
		public parent?: Folder<Metadata, File>,
		public files: File[] = [],
		public subfolders: Folder<Metadata, File>[] = []
	) {}

	get absolutePath(): Path {
		return this.parent ? new Path(this.parent.absolutePath, this.metadata.name) : new Path();
	}

	get relativePath(): Path {
		return new Path(this.metadata.name);
	}

	// ** File **

	addFile(file: File, where: "head" | "tail" = "head") {
		where === "head" ? this.files.unshift(file) : this.files.push(file);
	}

	getFile(id: ID) {
		return this.files.find((f) => f.id === id);
	}

	deleteFile(id: ID) {
		const idx = this.files.findIndex((f) => f.id === id);
		if (idx !== -1) this.files.splice(idx, 1);
	}

	// ** Folder **

	hasFolder(path: Path) {
		return this.getFolder(path) !== undefined;
	}

	getFolder(path: Path): Folder<Metadata, File> | undefined {
		if (path.isRoot()) return this;
		else if (path.length === 1) {
			return this.subfolders.find((folder) => folder.metadata.name === path.rawSegments[0]);
		} else {
			for (const folder of this.subfolders) {
				const maybeFolder = folder.getFolder(path.getTail());
				if (maybeFolder !== undefined) return maybeFolder;
			}
		}
		return undefined;
	}

	addFolder(folder: Folder<Metadata, File>, parentPath?: Path, where: "head" | "tail" = "head") {
		if (!parentPath || parentPath.isRoot())
			where === "head" ? this.subfolders.unshift(folder) : this.subfolders.push(folder);
		else {
			const parent = this.getFolder(parentPath);
			if (!parent)
				throw new Error(
					`Cannot create folder on inexistant parent. Tried to create folder on parent at path ${parentPath}.`
				);
			else
				where === "head"
					? parent.subfolders.unshift(folder)
					: parent.subfolders.push(folder);
		}
	}

	deleteFolder(path: Path) {
		if (path.isRoot()) {
			throw new Error(
				`Folder cannot delete itself. Tried to delete folder at path ${this.absolutePath}.`
			);
		} else if (path.length === 1) {
			const idx = this.subfolders.findIndex((f) => f.metadata.name === path.rawSegments[0]);
			if (idx !== -1) this.subfolders.splice(idx, 1);
		} else {
			this.deleteFolder(path.getTail());
		}
	}

	// This method is intended to be private, but we cannot enforce it because TS clashes with Vue's reactivity system when dealing with private properties
	// @see https://github.com/vuejs/core/issues/2981
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

	serialize() {
		const { map } = this._flatten();
		return serializeMap(map);
	}

	static deserialize<Metadata extends FolderMetadata, File extends Indexable>(
		serialized: Record<Key, FlatFolder<Metadata, File>>
	) {
		const flatMap = deserializeMap(serialized);

		const revive = (
			flatFolder: FlatFolder<Metadata, File>,
			revivedParent?: Folder<Metadata, File>
		): Folder<Metadata, File> => {
			const folder = new this(flatFolder.metadata, revivedParent, flatFolder.files);
			folder.subfolders = flatFolder.subfolders.map((hash) =>
				revive(flatMap.get(hash)!, folder)
			);
			return folder;
		};

		// Get root node (i.e. the node with no parent)
		const root = [...flatMap.values()].find((flatFolder) => flatFolder.parent === undefined);
		if (!root) return undefined;

		return revive(root);
	}
}
