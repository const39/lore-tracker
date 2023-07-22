import { Category, Folder } from "../models";
import { UUID } from "../utils/types";
import BaseRepo, { QueryOptions } from "./BaseRepo";

export default class FolderRepo extends BaseRepo<Folder> {
	use = Folder;

	count() {
		return this.all().length;
	}

	getFolder(id: UUID, category?: Category, options?: QueryOptions) {
		if (category) {
			return this.createQuery(options).whereId(id).where("category", category).first();
		} else {
			return this.createQuery(options).find(id);
		}
	}

	getRootFolder(category: Category, options?: QueryOptions) {
		// Get the root folder
		const rootFolder = this.createQuery(options).where("name", `${category}-root`).first();
		// If the root folder of this category does not exist yet, create and return it
		return rootFolder ?? this.createRootFolder(category);
	}

	/**
	 * Walk up the specified folder's parent relation up to the root folder to retrace its hierarchy.
	 *
	 * @returns the list of the folder's parents, from the highest one to this folder (included).
	 */
	getHierarchy(from: Folder) {
		const hierarchy = [];
		let folder: Folder | undefined = from;
		do {
			hierarchy.push(folder);
			folder = folder.parent;
		} while (folder);

		// Reverse the list to get the result in root > target order
		return hierarchy.reverse();
	}

	getSiblings(folder: Folder, options?: QueryOptions) {
		return this.createQuery(options).where("parentId", folder.parentId).get();
	}

	getSubfolders(folder: Folder, options?: QueryOptions) {
		return this.createQuery(options).where("parentId", folder.id).get();
	}

	createRootFolder(category: Category) {
		return this.save(new Folder({ category, name: `${category}-root` }));
	}
}
