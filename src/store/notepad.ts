import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { createRootFolder, File, Folder, Path } from "@/core/model/fileTree";
import { SerializedState } from ".";

export const useNotepadStore = defineStore("notepad", () => {
	const fileTree = ref(createRootFolder());

	const serializableState = computed(() => ({ notepad: fileTree.value.serialize() }));

	function hasFolder(path: Path) {
		return fileTree.value.hasFolder(path);
	}

	function getFolder(path: Path) {
		return fileTree.value.getFolder(path);
	}

	function addFolder(folder: Folder, pathToParent: Path) {
		fileTree.value.addFolder(folder, pathToParent);
	}

	function updateFolder(payload: { pathToParent: string; folder: Folder }) {
		// TODO
	}

	function deleteFolder(pathToParent: Path) {
		fileTree.value.deleteFolder(pathToParent);
	}

	function addFile(pathToParent: Path, file: File) {
		const folder = fileTree.value.getFolder(pathToParent);
		folder?.addFile(file);
	}

	function updateFile(payload: { pathToParent: string; file: File }) {
		// TODO
	}

	function deleteFile(pathToParent: Path, file: File) {
		const folder = fileTree.value.getFolder(pathToParent);
		folder?.deleteFile(file);
	}

	function $reset() {
		fileTree.value = createRootFolder();
	}

	function $hydrate(payload: SerializedState) {
		fileTree.value = Folder.deserialize(payload.notepad) ?? createRootFolder();
	}

	return {
		fileTree,
		serializableState,

		hasFolder,
		getFolder,

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
