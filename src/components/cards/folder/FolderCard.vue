<template>
	<!-- Pass dummy draggable-data only to enable draggable state -->
	<BaseCard
		v-if="!editMode"
		:id="folder.id"
		:selected="selected"
		:with-options="!editMode"
		:draggable="draggable"
		:class="{ 'bg-hovered-surface': status === 'accepted' }"
		@edit="editFolder"
		@delete="confirmDelete"
		@move="moveFolder"
		@dblclick="openFolder(folder)"
		@dragstart="($event) => $emit('dragstart', $event)"
	>
		<v-card-title class="d-flex align-center">
			<v-badge :content="childrenCount" color="grey" offset-x="2" offset-y="6">
				<v-icon :icon="Icon.folder" :color="folder.color" size="x-large" />
			</v-badge>
			<div class="px-4 flex-grow-1 text-subtitle-1">
				{{ folder.name }}
			</div>
		</v-card-title>
		<v-card-text v-if="folder.tags?.length" class="pa-3">
			<!-- eslint-disable-next-line vue/no-mutating-props - Editable is false so tags is not mutated -->
			<TagList v-model="folder.tags" :editable="false" />
		</v-card-text>
	</BaseCard>
</template>

<script lang="ts" setup>
import { useRepo } from "pinia-orm";
import { computed, ref } from "vue";
import BaseCard from "@/components/cards/BaseCard.vue";
import TagList from "@/components/cards/tags/TagList.vue";
import { CustomMIMEType, useDropZone, DragItem } from "@/composables/dragAndDrop";
import { useTryCatch } from "@/composables/tryCatch";
import { Folder, LoreEntry } from "@/core/models";
import { FolderRepo, LoreEntryRepo } from "@/core/repositories";
import { t as $t } from "@/core/translation";
import { Icon } from "@/core/utils/icons";
import { useGlobalConfirmDialog } from "@/store/confirmDialog";
import { useSidePanel } from "@/store/sidePanel";

const props = defineProps<{
	folder: Folder;
	selected?: boolean;
	draggable?: boolean;
}>();

const emit = defineEmits<{
	(e: "open-folder", folder: Folder): void;
	(e: "dragstart", value: DragEvent): void;
}>();

const editMode = ref(false);
const refDropZone = ref<HTMLElement | null>(null);

const loreEntryRepo = useRepo(LoreEntryRepo);
const folderRepo = useRepo(FolderRepo);

const sidePanelStore = useSidePanel();
const { showConfirmDialog } = useGlobalConfirmDialog();
const { status } = useDropZone(refDropZone, "move", onDropAccepted, {
	acceptMIME: [CustomMIMEType.LoreEntry, CustomMIMEType.Folder],
	acceptMode: ["moveToFolder"],
});

const childrenCount = computed(() => folderRepo.getChildrenCount(props.folder));

/**
 * Callback triggered when the user releases the click (i.e. drops the item) in the drop zone
 */
function onDropAccepted(items: DragItem[]) {
	if (items.length) {
		useTryCatch(() => {
			items.forEach(({ data: itemToMove, dataType }) => {
				if (dataType === CustomMIMEType.Folder && itemToMove instanceof Folder) {
					folderRepo.update({ id: itemToMove.id, parentId: props.folder.id });
				}

				if (dataType === CustomMIMEType.LoreEntry && itemToMove instanceof LoreEntry) {
					loreEntryRepo.update({ id: itemToMove.id, folderId: props.folder.id });
				}
			});
		});
	}
}

function moveFolder() {
	sidePanelStore.showFolderTree(props.folder);
}

function editFolder() {
	sidePanelStore.showFolderForm("edit", props.folder);
}

function confirmDelete() {
	showConfirmDialog({
		title: $t("dialogs.deleteFolder"),
		message: `${$t("dialogs.deleteConfirm")} "${props.folder.getText()}" ? ${$t(
			"dialogs.deleteConfirmFolder"
		)}`,
		confirmAction: () => useTryCatch(() => folderRepo.delete(props.folder.id)),
	});
}

function openFolder(folder: Folder) {
	emit("open-folder", folder);
}
</script>
