import { MD5 } from "object-hash";
import { ID, Note } from "../types";
import utilities, { deserializeMap, mergeMaps, SerializedMap, serializeMap } from "../utilities";

export type File = Note;

export interface FolderMetadata {
	id: ID;
	name: string;
	color: string;
}

type Key = string;
type FlatFolder = Omit<Folder, "parent" | "subfolders"> & { parent?: Key; subfolders: Key[] };
type FlatTree = Map<Key, FlatFolder>;

export type NotepadState = Folder; // Runtime type
export type NotepadSave = SerializedMap<Key, FlatFolder>; // Serialized type

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

export class Folder {
	constructor(
		public metadata: FolderMetadata,
		public parent?: Folder,
		public files: File[] = [],
		public subfolders: Folder[] = []
	) {}

	get path(): Path {
		return this.parent
			? new Path(this.parent.path, this.metadata.name)
			: new Path(this.metadata.name);
	}

	// ** File **

	addFile(file: File) {
		this.files.push(file);
	}

	deleteFile(file: File) {
		const idx = this.files.findIndex((f) => f.id === file.id);
		if (idx !== -1) this.files.splice(idx, 1);
	}

	// ** Folder **

	hasFolder(path: Path) {
		return this.getFolder(path) !== undefined;
	}

	getFolder(path: Path): Folder | undefined {
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

	addFolder(folder: Folder, parentPath?: Path) {
		if (!parentPath || parentPath.isRoot()) this.subfolders.push(folder);
		else {
			const parent = this.getFolder(parentPath);
			if (!parent)
				throw new Error(
					`Cannot create folder on inexistant parent. Tried to create folder on parent at path ${parentPath}.`
				);
			else parent.subfolders.push(folder);
		}
	}

	deleteFolder(path: Path) {
		if (path.isRoot()) {
			throw new Error(
				`Folder cannot delete itself. Tried to delete folder at path ${this.path}.`
			);
		} else if (path.length === 1) {
			const idx = this.subfolders.findIndex((f) => f.metadata.name === path.rawSegments[0]);
			if (idx !== -1) this.subfolders.splice(idx, 1);
		} else {
			this.deleteFolder(path.getTail());
		}
	}

	private flatten(parentHash?: Key) {
		const map: FlatTree = new Map<Key, FlatFolder>();
		const objHash = MD5(this);

		const childrenHashes: Key[] = [];
		for (const subfolder of this.subfolders) {
			const { map: res, hash } = subfolder.flatten(objHash);
			mergeMaps(map, res);
			childrenHashes.push(hash);
		}

		const flatFolder = { ...this } as FlatFolder;

		flatFolder.parent = parentHash;
		flatFolder.subfolders = childrenHashes;

		if (!map.has(objHash)) map.set(objHash, flatFolder);

		return {
			map,
			hash: objHash,
		};
	}

	serialize() {
		const { map } = this.flatten();
		return serializeMap(map);
	}

	static deserialize(serialized: NotepadSave) {
		const flatMap = deserializeMap<Key, FlatFolder>(serialized);

		function revive(flatFolder: FlatFolder, revivedParent?: Folder): Folder {
			const folder = new Folder(flatFolder.metadata, revivedParent, flatFolder.files);
			folder.subfolders = flatFolder.subfolders.map((hash) =>
				revive(flatMap.get(hash)!, folder)
			);
			return folder;
		}

		// Get root node (i.e. the node with no parent)
		const root = [...flatMap.values()].find((flatFolder) => flatFolder.parent === undefined);
		if (!root) return undefined;

		return revive(root);
	}
}

export function createRootFolder(): Folder {
	const meta: FolderMetadata = {
		id: utilities.uid(),
		name: "",
		color: "#ffffff",
	};
	return new Folder(meta);
}
