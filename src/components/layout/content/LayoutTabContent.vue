<template>
	<v-container>
		<FolderBreadcrumbs />
		<FoldersArea />
		<FilesArea />
	</v-container>
</template>

<script lang="ts" setup>
import { watch } from "vue";
import { CardCategory } from "@/core/model/cards";
import { Path } from "@/core/model/fileTree";
import { useCardsStore } from "@/store/cards";
import FilesArea from "./FilesArea.vue";
import FolderBreadcrumbs from "./FolderBreadcrumbs.vue";
import FoldersArea from "./FoldersArea.vue";

const props = defineProps<{ category: CardCategory; folderPath?: Path }>();

const cardsStore = useCardsStore();

watch(
	props,
	({ category, folderPath }) => {
		cardsStore.setCurrentFolder(category, folderPath);
	},
	{ immediate: true }
);
</script>
