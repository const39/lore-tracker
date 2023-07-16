<template>
	<!-- Pass dummy draggable-data only to enable draggable state -->
	<BaseCard
		v-if="!editMode"
		:id="folder.metadata.id"
		ref="refDropZone"
		:with-options="!editMode"
		:draggable="draggable"
		:class="{ 'bg-hovered-surface': status === 'accepted' }"
		@edit="editFolder"
		@delete="confirmDelete"
		@move="showFolderTree"
		@click="openFolder(folder)"
		@dragstart="onDragStart"
	>
		<v-card-title class="d-flex align-center">
			<v-badge :content="childrenCount" color="grey" offset-x="2" offset-y="6">
				<v-icon :icon="Icon.folder" :color="folder.metadata.color" size="x-large" />
			</v-badge>
			<div class="px-4 flex-grow-1 text-subtitle-1">
				{{ folder.metadata.name }}
			</div>
		</v-card-title>
		<v-card-text v-if="folder.metadata.tags?.length" class="pa-3">
			<!-- eslint-disable-next-line vue/no-mutating-props - Editable is false so tags is not mutated -->
			<TagList v-model="folder.metadata.tags" :editable="false" />
		</v-card-text>
	</BaseCard>
	<!-- Custom drag image used when dragging the card -->
	<CardDragImage ref="refDragImage" :item-data="folder" />
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import BaseCard from "@/components/cards/BaseCard.vue";
import TagList from "@/components/cards/tags/TagList.vue";
import {
	CustomMIMEType,
	startDrag,
	useDropZone,
	type DropPayload,
} from "@/composables/dragAndDrop";
import { useTryCatch } from "@/composables/tryCatch";
import { Icon } from "@/core/utils/icons";
import { CardFolder, getText, isCard, isCardFolder } from "@/core/model/cards";
import { t as $t } from "@/core/translation";
import { useCardsStore } from "@/store/cards";
import { useGlobalConfirmDialog } from "@/store/confirmDialog";
import { useSidePanel } from "@/store/sidePanel";
import CardDragImage from "../CardDragImage.vue";

const props = defineProps<{
	folder: CardFolder;
	draggable?: boolean;
}>();

const emit = defineEmits<{
	(e: "open-folder", folder: CardFolder): void;
}>();

const editMode = ref(false);
const refDropZone = ref<HTMLElement | null>(null);
const refDragImage = ref<HTMLElement | null>();

const cardsStore = useCardsStore();
const sidePanelStore = useSidePanel();
const { showConfirmDialog } = useGlobalConfirmDialog();
const { status } = useDropZone(refDropZone, "move", onDropAccepted, {
	acceptMIME: [CustomMIMEType.CardType, CustomMIMEType.CardFolder],
	acceptMode: ["moveToFolder"],
});

/**
 * Callback triggered when the user grabs the cards for a drag & drop
 */
function onDragStart(e: DragEvent) {
	startDrag(e, props.folder, CustomMIMEType.CardFolder, {
		dragImage: { image: refDragImage, offsetX: -12, offsetY: -8 },
	});
}

/**
 * Callback triggered when the user releases the click (i.e. drops the item) in the drop zone
 */
function onDropAccepted(items: DropPayload[]) {
	if (items.length) {
		useTryCatch(() => {
			const { dataType, data: itemToMove } = items[0];

			if (dataType === CustomMIMEType.CardType && isCard(itemToMove)) {
				cardsStore.moveCard(itemToMove, cardsStore.currentFolder, props.folder);
			}

			if (dataType === CustomMIMEType.CardFolder && isCardFolder(itemToMove)) {
				cardsStore.moveFolder(itemToMove, props.folder);
			}
		});
	}
}

function showFolderTree() {
	sidePanelStore.newFolderTree(props.folder, cardsStore.currentFolder);
}

function editFolder() {
	sidePanelStore.newFolderEditForm(props.folder, cardsStore.currentFolder);
}

function confirmDelete() {
	showConfirmDialog({
		title: $t("dialogs.deleteFolder"),
		message: `${$t("dialogs.deleteConfirm")} "${getText(props.folder)}" ? ${$t(
			"dialogs.deleteConfirmFolder"
		)}`,
		confirmAction: () => useTryCatch(() => cardsStore.deleteFolder(props.folder)),
	});
}

function openFolder(folder: CardFolder) {
	emit("open-folder", folder);
}

const childrenCount = computed(() => {
	return props.folder.subfolders.length + props.folder.files.length;
});
</script>
