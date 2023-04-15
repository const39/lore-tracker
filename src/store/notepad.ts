import { FileTree, FileTreeNode, FileTypes, Folder, SerializableState } from "@/js/types";
import utilities from "@/js/utilities";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

function defaultFileTreeNode(): FileTreeNode {
	return {
		folders: [],
		files: [],
	};
}

export const useNotepadStore = defineStore("notepad", () => {
	const fileTree = ref(new FileTree());

	const serializableState = computed(() => ({ notepad: fileTree }));

	function doesFolderExist(path: string) {
		return fileTree.value.has(utilities.sanitizePath(true, path));
	}

	function getFolderContent(path: string) {
		return fileTree.value.get(utilities.sanitizePath(true, path));
	}

	function addFolder(payload: { pathToParent: string; folder: Folder }) {
		const sanitizedPathToParent = utilities.sanitizePath(true, payload.pathToParent);

		// Add the payload folder to its parent's children list
		const parent = fileTree.value.get(sanitizedPathToParent);
		if (parent) parent.folders.push(payload.folder);
		else {
			const node = defaultFileTreeNode();
			node.folders.push(payload.folder);
			fileTree.value.set(sanitizedPathToParent, node);
		}

		// Create new entry in table for the newly created folder
		const path = utilities.joinPaths(true, sanitizedPathToParent, payload.folder.name);
		fileTree.value.set(path, defaultFileTreeNode());
	}

	function updateFolder(payload: { pathToParent: string; folder: Folder }) {
		// TODO
	}

	function deleteFolder(payload: { pathToParent: string; folder: Folder }) {
		const sanitizedPathToParent = utilities.sanitizePath(true, payload.pathToParent);

		// Remove the payload folder from its parent's children list
		const parent = fileTree.value.get(sanitizedPathToParent);
		if (parent) {
			const idx = parent.folders.findIndex((elem) => elem.name === payload.folder.name);
			if (idx != -1) parent.folders.splice(idx);
		}

		// Remove the deleted folder table entry
		const path = utilities.joinPaths(true, sanitizedPathToParent, payload.folder.name);
		fileTree.value.delete(path);
	}

	function addFile(payload: { pathToParent: string; file: FileTypes }) {
		const sanitizedPathToParent = utilities.sanitizePath(true, payload.pathToParent);

		const parent = fileTree.value.get(sanitizedPathToParent);
		if (parent) parent.files.push(payload.file);
		else {
			const node = defaultFileTreeNode();
			node.files.push(payload.file);
			fileTree.value.set(sanitizedPathToParent, node);
		}
	}

	function updateFile(payload: { pathToParent: string; file: FileTypes }) {
		// TODO
	}

	function deleteFile(payload: { pathToParent: string; file: FileTypes }) {
		const sanitizedPathToParent = utilities.sanitizePath(true, payload.pathToParent);

		const parent = fileTree.value.get(sanitizedPathToParent);
		if (parent) {
			const idx = parent.files.findIndex((elem) => elem.id === payload.file.id);
			if (idx != -1) parent.files.splice(idx);
		}
	}

	function $reset() {
		fileTree.value = new FileTree();
	}

	function $hydrate(payload: SerializableState) {
		fileTree.value = payload.notepad;
	}

	return {
		fileTree,
		serializableState,

		doesFolderExist,
		getFolderContent,

		addFolder,
		updateFolder,
		deleteFolder,
		addFile,
		updateFile,
		deleteFile,
		$reset,
		$hydrate,
	};
});
