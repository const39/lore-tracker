<template>
	<GenericArea
		:items="items"
		:title="$t('categories.folder') + 's'"
		:loading="loading"
		group="folders"
		@sort="onSort"
	>
		<template #actions>
			<v-btn
				:disabled="disableActions || !folderId"
				class="m1-2"
				icon="mdi-plus"
				density="compact"
				variant="text"
				@click="newFolder"
			/>
			<v-btn
				:disabled="disableActions"
				class="mx-1"
				icon="mdi-file-tree"
				density="compact"
				variant="text"
				@click="showFolderTree"
			/>
		</template>
		<template #default="{ isDraggable, itemData }">
			<FolderCard :draggable="isDraggable" :folder="itemData" @open-folder="openFolder" />
		</template>
	</GenericArea>
</template>

<script lang="ts" setup>
import { useRepo } from "pinia-orm";
import { useRouter } from "vue-router";
import FolderCard from "@/components/cards/folder/FolderCard.vue";
import { Category, Folder, Indexable, Orderable } from "@/core/models";
import { FolderRepo } from "@/core/repositories";
import { t as $t } from "@/core/translation";
import { UUID } from "@/core/utils/types";
import { useSidePanel } from "@/store/sidePanel";
import GenericArea from "./GenericArea.vue";

const props = defineProps<{
	items: Folder[];
	category: Category;
	folderId?: UUID;
	loading?: boolean;
	disableActions?: boolean;
}>();

const router = useRouter();
const sidePanelStore = useSidePanel();

/**
 * Save the new items order.
 * @param movedItems the items with their new position.
 */
function onSort(movedItems: Array<Indexable & Orderable>) {
	useRepo(FolderRepo).changeOrder(movedItems);
}

function newFolder(): void {
	if (props.folderId)
		sidePanelStore.showFolderForm(
			"add",
			new Folder({ category: props.category, parentId: props.folderId })
		);
}

function showFolderTree() {
	sidePanelStore.showFolderTree();
}

function openFolder(folder: Folder): void {
	router.push({ params: { folderId: folder.id } });
}
</script>
