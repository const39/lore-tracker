<template>
	<GenericArea
		v-model:selected="selected"
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
		<template #default="{ itemData, isDraggable, isSelected, toggle, select }">
			<!-- Selection toggle is enabled on ctrl-click only -->
			<!-- FIXME: remove @expect-error after Vuetify update -->
			<!-- @vue-expect-error TS raises error on the isDraggable and isSelected props due to a type mismatch in Vuetify -->
			<FolderCard
				v-click-outside="($e: MouseEvent) => onClickOutside($e, select)"
				:folder="itemData"
				:draggable="isDraggable"
				:selected="isSelected"
				@open-folder="openFolder"
				@click.ctrl="toggle"
				@dragstart="($e) => onDragStart($e, isSelected)"
			/>
		</template>
	</GenericArea>
</template>

<script lang="ts" setup>
import { useRepo } from "pinia-orm";
import { computed } from "vue";
import { useRouter } from "vue-router";
import FolderCard from "@/components/cards/folder/FolderCard.vue";
import { Campaign, Category, Folder, Indexable, Orderable } from "@/core/models";
import { FolderRepo } from "@/core/repositories";
import { t as $t } from "@/core/translation";
import { UUID } from "@/core/utils/types";
import { useSidePanel } from "@/store/sidePanel";
import GenericArea from "./GenericArea.vue";

const props = defineProps<{
	selected: Folder[]; // v-model:selected
	items: Folder[];
	campaign: Campaign;
	category: Category;
	folderId?: UUID;
	loading?: boolean;
	disableActions?: boolean;
}>();

const emit = defineEmits<{
	(e: "update:selected", value: Folder[]): void;
	(e: "dragstart", value: DragEvent): void;
}>();

const selected = computed({
	get() {
		return props.selected;
	},
	set(value) {
		emit("update:selected", value);
	},
});

const router = useRouter();
const sidePanelStore = useSidePanel();

/**
 * Save the new items order.
 * @param movedItems the items with their new position.
 */
function onSort(movedItems: Array<Indexable & Orderable>) {
	useRepo(FolderRepo).changeOrder(movedItems);
}

function onDragStart(e: DragEvent, isSelected: boolean) {
	if (isSelected) emit("dragstart", e);
}

function onClickOutside(e: MouseEvent, selectFn: (arg: boolean) => void) {
	if (!e.ctrlKey) selectFn(false);
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
