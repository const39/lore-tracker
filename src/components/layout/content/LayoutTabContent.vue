<template>
	<v-container>
		<FolderBreadcrumbs :folder="folder" />
		<FoldersArea :folder="folder" />
		<FilesArea :category="category" :folder="folder" />
	</v-container>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { CardCategory } from "@/core/model/cards";
import { Path } from "@/core/model/fileTree";
import { useCardsStore } from "@/store/cards";
import FilesArea from "./FilesArea.vue";
import FolderBreadcrumbs from "./FolderBreadcrumbs.vue";
import FoldersArea from "./FoldersArea.vue";

const props = defineProps<{ category: CardCategory; folderPath?: Path }>();

const cardsStore = useCardsStore();

const folder = computed(() => {
	const root = cardsStore.getCategoryFolder(props.category);
	// If a path is specified, get the folder it points to
	// Otherwise, keep the root folder as current folder
	const folder = props.folderPath ? root.getFolder(props.folderPath) : root;
	// Return root folder if no folder at specified path was found
	return folder ? folder : root;
});
</script>

