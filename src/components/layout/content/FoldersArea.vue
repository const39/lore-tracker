<template>
	<GenericArea
		v-model:selected="selected"
		:items="items"
		:title="$t('data.cardTypes.folder', items.length)"
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
		<template #default="{ itemData, isDraggable, isSelected, toggle, select }">
			<!-- The card is unselected when clicking outside of any .selectable card -->
			<FolderCard
				v-click-outside="{handler: ($e: MouseEvent) => onClickOutside($e, select), include: getSelectableElements}"
				:folder="itemData"
				:draggable="isDraggable"
				:selected="isSelected"
				class="selectable"
				@open-folder="openFolder"
				@click="toggle"
				@dragstart="($e) => onDragStart($e, isSelected)"
			/>
		</template>
	</GenericArea>
</template>

<script lang="ts" setup>
import { useRepo } from "pinia-orm";
import { useRouter } from "vue-router";
import FolderCard from "@/components/cards/folder/FolderCard.vue";
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

const emit = defineEmits<{
	(e: "dragstart", value: DragEvent): void;
}>();

const selected = defineModel<Folder[]>("selected", { required: true }); // v-model:selected

const router = useRouter();
const sidePanelStore = useSidePanel();

function getSelectableElements() {
	return Array.from(document.querySelectorAll(".selectable"));
}
/**
 * Save the new items order.
 * @param movedItems the items with their new position.
 */
function onSort(movedItems: Array<Indexable & Orderable>) {
	useRepo(FolderRepo).changeOrder(movedItems);
}

function onDragStart(e: DragEvent, isSelected?: boolean) {
	if (isSelected) emit("dragstart", e);
}

function onClickOutside(e: MouseEvent, selectFn?: (arg: boolean) => void) {
	if (!e.ctrlKey && selectFn) selectFn(false);
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
