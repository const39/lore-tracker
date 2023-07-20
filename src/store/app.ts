import { defineStore } from "pinia";
import { ref } from "vue";
import { Category, Folder } from "@/core/models";

export const useAppStore = defineStore("appStore", () => {
	const currentCategory = ref<Category>();
	const currentFolder = ref<Folder>();

	return {
		currentCategory,
		currentFolder,
	};
});
