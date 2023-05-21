<template>
	<!-- Pass dummy draggable-data only to enable draggable state -->
	<BaseCard
		v-if="!editMode"
		:with-options="!editMode"
		:draggable-data="draggable ? 1 : undefined"
		@edit="editMode = true"
		@delete="confirmDelete"
		@move="showFolderTree"
		@click="openFolder(folder)"
	>
		<v-card-title class="pr-0 d-flex align-center">
			<v-badge :content="childrenCount" color="grey">
				<v-icon :icon="Icon.folder" :color="folder.metadata.color" size="x-large" />
			</v-badge>
			<div class="pl-4 pt-2 flex-grow-1 text-subtitle-1">
				{{ folder.metadata.name }}
			</div>
		</v-card-title>
	</BaseCard>
	<FolderForm
		v-else-if="folder.parent"
		:parent="folder.parent"
		:edit="folder"
		@close="editMode = false"
		@submit="editMode = false"
	/>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import BaseCard from "@/components/cards/BaseCard.vue";
import { Icon } from "@/core/icons";
import { CardFolder, getText } from "@/core/model/cards";
import { t as $t } from "@/core/translation";
import { useCardsStore } from "@/store/cards";
import { useGlobalConfirmDialog } from "@/store/confirmDialog";
import { useSidePanel } from "@/store/sidePanel";
import FolderForm from "./FolderForm.vue";

const props = defineProps<{
	folder: CardFolder;
	draggable?: boolean;
}>();

const emit = defineEmits<{
	(e: "open-folder", folder: CardFolder): void;
}>();

const editMode = ref(false);

const cardsStore = useCardsStore();
const sidePanelStore = useSidePanel()
const { showConfirmDialog } = useGlobalConfirmDialog();

function showFolderTree() {
	sidePanelStore.newFolderTree(props.folder, cardsStore.currentFolder);
}

function confirmDelete() {
	showConfirmDialog({
		title: $t("dialogs.deleteFolder"),
		message: `${$t("dialogs.deleteConfirm")} "${getText(props.folder)}" ? ${$t(
			"dialogs.deleteConfirmFolder"
		)}`,
		confirmAction: () => cardsStore.deleteFolder(props.folder),
	});
}

function openFolder(folder: CardFolder) {
	emit("open-folder", folder);
}

const childrenCount = computed(() => {
	return props.folder.subfolders.length + props.folder.files.length;
});
</script>
