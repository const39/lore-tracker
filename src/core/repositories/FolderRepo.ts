import { Category, Folder } from "../models";
import { UUID } from "../utils/types";
import BaseRepo, { QueryOptions } from "./BaseRepo";
import LoreEntryRepo from "./LoreEntryRepo";

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
		// Type assertion is there because root folders SHOULD have been created on app startup (see App.vue)
		return this.createQuery(options).where("name", `${category}-root`).first()!;
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

	getFiles(folder: Folder) {
		return this.repo(LoreEntryRepo).where("folderId", folder.id).get();
	}

	getChildrenCount(folder: Folder) {
		return this.getSubfolders(folder).length + this.getFiles(folder).length;
	}

	createRootFolder(category: Category) {
		return this.save(new Folder({ category, name: `${category}-root` }));
	}
}
