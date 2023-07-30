import { LocalisableError } from "@/core/error";
import { Folder, LoreEntry } from "@/core/models";
import { t as $t } from "@/core/translation/translation";
import { Maybe, UUID } from "@/core/utils/types";
import { PartialModel, QueryOptions } from "./BaseRepo";
import CardRepo from "./CardRepo";
import LoreEntryRepo from "./LoreEntryRepo";

export class InvalidFileOperationError extends LocalisableError {
	override toLocaleString(): string {
		return $t("messages.errors.files.invalidOperation.title");
	}
}

export class FolderNotFoundError extends LocalisableError {
	override toLocaleString(): string {
		return $t("messages.errors.files.folderNotFound.title");
	}
}

export class FolderNameAlreadyUsedError extends LocalisableError {
	override toLocaleString(): string {
		return $t("messages.errors.files.nameAlreadyUsed.title");
	}
}

export default class FolderRepo extends CardRepo<Folder> {
	use = Folder;

	/**
	 * Add a new folder.
	 * @param item the folder to add
	 * @returns the folder model
	 *
	 * @throws {InvalidFileOperationError} if the specified folder is a subfolder of one of its subfolders (circular reference)
	 */
	override add(item: Folder<LoreEntry>): Folder {
		if (item.parentId) {
			// Abort if the folder is a subfolder of one of its subfolders (circular reference)
			const subfolders = this.getSubfolders(item);
			if (subfolders.some((f) => f.id === item.parentId))
				throw new InvalidFileOperationError(
					`Cannot add a folder to one of its own children. Tried to add folder ${item.id} (${item.name}) in parent ${item.parentId}.`
				);
		}

		return super.add(item);
	}

	/**
	 * Update an existing folder.
	 * @param item the folder to update
	 * @returns the folder model
	 *
	 * @throws {InvalidFileOperationError} if a circular reference between the folder and its parent is detected
	 * @throws {FolderNameAlreadyUsedError} if the folder has the same name as one of the subfolders of its new parent
	 */
	override update(item: PartialModel<Folder>): Folder {
		if (item.parentId) {
			// Abort if the folder is a parent of itself (circular reference)
			if (item.id === item.parentId)
				throw new InvalidFileOperationError(
					`Cannot move a folder into itself. Tried to move folder ${item.id} (${item.name}).`
				);

			// Abort if the folder has the same name as one of the subfolders of its new parent
			const subfolders = this.getSubfolders(item.id);
			const name = item.name?.toLowerCase().trim();
			if (name && subfolders.some((f) => f.name.toLowerCase().trim() === name))
				throw new FolderNameAlreadyUsedError(
					`Cannot move folder named ${item.name} to parent ${item.parentId}: a folder with the same name already exists under the parent folder.`
				);

			// Abort if the folder is a subfolder of one of its subfolders (circular reference)
			if (subfolders.some((f) => f.id === item.parentId))
				throw new InvalidFileOperationError(
					`Cannot move a folder to one of its own children. Tried to move folder ${item.id} (${item.name}) in parent ${item.parentId}.`
				);
		}

		return super.update(item);
	}

	/**
	 * Delete an existing folder.
	 * This will also recursively delete all the folder's children (files and subfolders alike).
	 *
	 * @param id the ID of the folder to delete
	 */
	override delete(id: UUID): void {
		// Delete the folder
		super.delete(id);
		// Delete its children (files and folders alike)
		this.repo(LoreEntryRepo).where("folderId", id).delete();
		this.getSubfolders(id).forEach((subfolder) => this.delete(subfolder.id));
	}

	getFolder(id: UUID, options?: QueryOptions) {
		return this.createQuery(options).find(id);
	}

	/**
	 * Walk up the specified folder's parent relation up to the root folder to retrace its hierarchy.
	 *
	 * @returns the list of the folder's parents, from the highest one to this folder (included).
	 */
	getHierarchy(from: Folder) {
		const hierarchy = [];
		// Load the folder with its parent relation
		let folder: Maybe<Folder> = this.getFolder(from.id, { withRelations: true });
		while (folder) {
			hierarchy.push(folder);
			if (folder.parent)
				folder = this.getFolder(folder.parent.id, { withRelations: true });
			else break;
		}

		// Reverse the list to get the result in root > target order
		return hierarchy.reverse();
	}

	getSiblings(folder: Folder, options?: QueryOptions) {
		return this.createQuery(options).where("parentId", folder.parentId).get();
	}

	getSubfolders(folderOrId: Folder | UUID, options?: QueryOptions) {
		const id = typeof folderOrId === "object" ? folderOrId.id : folderOrId;
		return this.createQuery(options).where("parentId", id).get();
	}

	getFiles(folder: Folder) {
		return this.repo(LoreEntryRepo).where("folderId", folder.id).get();
	}

	getChildrenCount(folder: Folder) {
		return this.getSubfolders(folder).length + this.getFiles(folder).length;
	}
}
