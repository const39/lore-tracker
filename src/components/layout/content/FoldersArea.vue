<template>
	<GenericArea
		v-model:selected="selectedItems"
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
		<template #default="{ itemData, isDraggable, isSelected, toggle }">
			<FolderCard
				:folder="itemData"
				:draggable="isDraggable"
				:selected="isSelected"
				@open-folder="openFolder"
				@click="toggle"
				@dragstart="onDragStart"
			/>
		</template>
	</GenericArea>

	<!-- Custom drag image used when dragging cards -->
	<CardDragImage ref="dragImage" :items="selectedItems" />
</template>

<script lang="ts" setup>
import { useRepo } from "pinia-orm";
import { ref } from "vue";
import { useRouter } from "vue-router";
import CardDragImage from "@/components/cards/CardDragImage.vue";
import FolderCard from "@/components/cards/folder/FolderCard.vue";
import { CustomMIMEType, DragItem, startDrag } from "@/composables/dragAndDrop";
import { Campaign, Category, Folder, Indexable, Orderable } from "@/core/models";
import { FolderRepo } from "@/core/repositories";
import { t as $t } from "@/core/translation";
import { UUID } from "@/core/utils/types";
import { useSidePanel } from "@/store/sidePanel";
import GenericArea from "./GenericArea.vue";

const props = defineProps<{
	items: Folder[];
	campaign: Campaign;
	category: Category;
	folderId?: UUID;
	loading?: boolean;
	disableActions?: boolean;
}>();

const router = useRouter();
const sidePanelStore = useSidePanel();

const selectedItems = ref<Folder[]>([]);
const dragImage = ref<HTMLElement | null>(null);

/**
 * Save the new items order.
 * @param movedItems the items with their new position.
 */
function onSort(movedItems: Array<Indexable & Orderable>) {
	useRepo(FolderRepo).changeOrder(movedItems);
}

/**
 * Callback triggered when the user grabs the cards for a drag & drop
 */
function onDragStart(e: DragEvent) {
	const items: DragItem[] = selectedItems.value.map((item) => ({
		data: item,
		dataType: CustomMIMEType.Folder,
	}));
	startDrag(e, items, {
		dragImage: { image: dragImage, offsetX: -12, offsetY: -8 },
	});
}

function newFolder(): void {
	if (props.folderId)
		sidePanelStore.showFolderForm(
			"add",
			new Folder({
				campaignId: props.campaign.id,
				category: props.category,
				parentId: props.folderId,
			})
		);
}

function showFolderTree() {
	sidePanelStore.showFolderTree();
}

function openFolder(folder: Folder): void {
	router.push({ params: { folderId: folder.id } });
}
</script>
