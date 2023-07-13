<template>
	<BaseCard
		:id="itemData.id"
		:draggable="draggable"
		with-options
		@edit="showForm"
		@delete="confirmDelete"
		@move="showFolderTree"
		@click="showForm"
		@dragstart="onDragStart"
	>
		<!-- Dynamic Card content component -->
		<component :is="contentComponent" :item-data="itemData" />
	</BaseCard>
	<!-- Custom drag image used when dragging the card -->
	<CardDragImage ref="refDragImage" :item-data="itemData" />
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, ref } from "vue";
import { CustomMIMEType, startDrag } from "@/composables/dragAndDrop";
import { CardTypes, getText } from "@/core/model/cards";
import { t as $t } from "@/core/translation";
import utilities from "@/core/utilities";
import { useCardsStore } from "@/store/cards";
import { useGlobalConfirmDialog } from "@/store/confirmDialog";
import { useSidePanel } from "@/store/sidePanel";
import BaseCard from "./BaseCard.vue";
import CardDragImage from "./CardDragImage.vue";

const props = defineProps<{ itemData: CardTypes; draggable?: boolean }>();

const refDragImage = ref<HTMLElement | null>();

const cardsStore = useCardsStore();
const sidePanelStore = useSidePanel();
const { showConfirmDialog } = useGlobalConfirmDialog();

/**
 * Callback triggered when the user grabs the cards for a drag & drop
 */
function onDragStart(e: DragEvent) {
	startDrag(e, props.itemData, CustomMIMEType.CardType, {
		dragImage: { image: refDragImage, offsetX: -12, offsetY: -8 },
	});
}

function showForm() {
	sidePanelStore.newFileEditForm(props.itemData.id, cardsStore.currentFolder);
}

function showFolderTree() {
	sidePanelStore.newFolderTree(props.itemData, cardsStore.currentFolder);
}

function confirmDelete() {
	showConfirmDialog({
		title: $t(`dialogs.delete${utilities.capitalize(props.itemData._category)}`),
		message: $t(`dialogs.deleteConfirm`) + `"${getText(props.itemData)}" ?`,
		confirmAction: () => cardsStore.deleteCard(props.itemData),
	});
}

const contentComponent = computed(() => {
	const componentName = "Content" + utilities.capitalize(props.itemData._category);
	return defineAsyncComponent({
		loader: () => import(`./files/content/${componentName}.vue`),
	});
});
</script>
