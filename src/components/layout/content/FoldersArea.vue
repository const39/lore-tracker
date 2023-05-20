<template>
	<GenericArea
		v-model="cardsStore.currentFolder.subfolders"
		:title="$t('categories.folder') + 's'"
		group="folders"
	>
		<template #actions>
			<v-btn
				class="mx-2"
				icon="mdi-plus"
				density="compact"
				variant="text"
				@click="newFolder"
			/>
		</template>
		<template #default="{ isDraggable, itemData }">
			<FolderCard :draggable="isDraggable" :folder="itemData" @open-folder="openFolder" />
		</template>
	</GenericArea>
	<FolderDialog v-model="showFolderDialog" />
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import FolderCard from "@/components/cards/folder/FolderCard.vue";
import FolderDialog from "@/components/cards/folder/FolderDialog.vue";
import { CardFolder } from "@/core/model/cards";
import { t as $t } from "@/core/translation";
import { useCardsStore } from "@/store/cards";
import GenericArea from "./GenericArea.vue";

const showFolderDialog = ref(false);

const router = useRouter();
const cardsStore = useCardsStore();

function newFolder(): void {
	showFolderDialog.value = true;
}

function openFolder(folder: CardFolder): void {
	router.push({ params: { folderURI: [...folder.absolutePath.rawSegments] } });
}
</script>
