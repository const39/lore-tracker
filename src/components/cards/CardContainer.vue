<template>
	<BaseCard
		:id="itemData.id"
		:draggable="draggable"
		with-options
		@edit="showForm"
		@delete="confirmDelete"
		@move="moveLoreEntry"
		@dragstart="onDragStart"
	>
		<!-- Dynamic Card content component -->
		<component :is="contentComponent" :item-data="itemData" />
	</BaseCard>
	<!-- Custom drag image used when dragging the card -->
	<CardDragImage ref="refDragImage" :item-data="itemData" />
</template>

<script lang="ts" setup>
import { useRepo } from "pinia-orm";
import { computed, defineAsyncComponent, ref } from "vue";
import { CustomMIMEType, startDrag } from "@/composables/dragAndDrop";
import { LoreEntry } from "@/core/models";
import { LoreEntryRepo } from "@/core/repositories";
import { t as $t } from "@/core/translation";
import utilities from "@/core/utils/functions";
import { useGlobalConfirmDialog } from "@/store/confirmDialog";
import { useSidePanel } from "@/store/sidePanel";
import BaseCard from "./BaseCard.vue";
import CardDragImage from "./CardDragImage.vue";

const props = defineProps<{ itemData: LoreEntry; draggable?: boolean }>();

const refDragImage = ref<HTMLElement | null>();

const loreEntryRepo = useRepo(LoreEntryRepo);

const sidePanelStore = useSidePanel();
const { showConfirmDialog } = useGlobalConfirmDialog();

/**
 * Callback triggered when the user grabs the cards for a drag & drop
 */
function onDragStart(e: DragEvent) {
	startDrag(e, props.itemData, CustomMIMEType.LoreEntry, {
		dragImage: { image: refDragImage, offsetX: -12, offsetY: -8 },
	});
}

function showForm() {
	sidePanelStore.showLoreEntryForm("edit", props.itemData);
}

function moveLoreEntry() {
	sidePanelStore.showFolderTree(props.itemData);
}

function confirmDelete() {
	showConfirmDialog({
		title: $t(`dialogs.delete${utilities.capitalize(props.itemData.category)}`),
		message: $t(`dialogs.deleteConfirm`) + `"${props.itemData.getText()}" ?`,
		confirmAction: () => loreEntryRepo.delete(props.itemData.id),
	});
}

const contentComponent = computed(() => {
	const componentName = "Content" + utilities.capitalize(props.itemData.category);
	return defineAsyncComponent({
		loader: () => import(`./files/content/${componentName}.vue`),
	});
});
</script>
