import { defineStore } from "pinia";
import { useRepo } from "pinia-orm";
import { computed } from "vue";
import { useRoute } from "vue-router";
import { Category, Folder } from "@/core/models";
import { FolderRepo } from "@/core/repositories";
import { UUID } from "@/core/utils/types";

export const useAppStore = defineStore("appStore", () => {
	const _route = useRoute();
	const _folderRepo = useRepo(FolderRepo);

	const currentCategory = computed<Category | undefined>(() => {
		let { category = undefined } = _route.params;
		if (Array.isArray(category)) category = category[0];
		return category as Category | undefined;
	});

	const currentFolderId = computed<UUID | undefined>(() => {
		let { folderId = undefined } = _route.params;
		if (Array.isArray(folderId)) folderId = folderId[0];
		return folderId as UUID | undefined;
	});

	const currentFolder = computed<Folder | null>(() => {
		const folderId = currentFolderId.value;
		const category = currentCategory.value;
		if (!category) return null;
		// If a folderId is specified, get that folder. Otherwise, get the category's root folder
		return folderId
			? _folderRepo.getFolder(folderId, category)
			: _folderRepo.getRootFolder(category);
	});

	return {
		currentCategory,
		currentFolderId,
		currentFolder,
	};
});
