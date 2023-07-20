import { Category, Folder, LoreEntry } from "../models";
import { UUID } from "../utils/types";
import BaseRepo from "./BaseRepo";

export default class FolderRepo extends BaseRepo<Folder<LoreEntry>> {
	use = Folder;

	count() {
		return this.all().length;
	}

	getFolder(id: UUID, category?: Category, options?: QueryOptions) {
		const res = this.createQuery(options).find(id);
		if (category) {
			return res?.category === category ? res : undefined;
		} else {
			return res;
		}
	}

	getRootFolder(category: Category, options?: QueryOptions) {
		return this.createQuery(options).where("name", `${category}-root`).first();
	}

	/**
	 * Walk up the specified folder's parent relation up to the root folder to retrace its hierarchy.
	 *
	 * @returns the list of the folder's parents, from the highest one to this folder (included).
	 */
	getHierarchy(from: Folder<LoreEntry>) {
		const hierarchy = [];
		let folder: Folder<LoreEntry> | undefined = from;
		do {
			hierarchy.push(folder);
			folder = folder.parent;
		} while (folder);

		// Reverse the list to get the result in root > target order
		return hierarchy.reverse();
	}
}