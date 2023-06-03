<template>
	<BaseCard
		:id="id"
		:draggable="draggable"
		:highlight="isHighlighted"
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
import { useDebounceFn } from "@vueuse/core";
import { computed, defineAsyncComponent, ref, watch } from "vue";
import { useRoute } from "vue-router";
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

const isHighlighted = ref(false);
const refDragImage = ref<HTMLElement | null>();

const route = useRoute();
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
	sidePanelStore.newEditForm(props.itemData.id, cardsStore.currentFolder);
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

const id = computed(() => props.itemData.id + "-card");

const contentComponent = computed(() => {
	const componentName = "Content" + utilities.capitalize(props.itemData._category);
	return defineAsyncComponent({
		loader: () => import(`./files/content/${componentName}.vue`),
	});
});

/**
 * Scroll this card into view if the URL's hash contains its ID.
 * This function is debounced to only trigger after a certain delay and avoid multiple calls in rapid succession.
 */
const scrollIntoViewIfSelected = useDebounceFn(() => {
	if (route.hash === `#${id.value}`) {
		// Find the card's underlying DOM element to scroll it into view
		const el = document.querySelector(`[id="${id.value}"]`);
		el?.scrollIntoView({ behavior: "smooth", block: "center" });

		// Highlight the selected card for 3s
		isHighlighted.value = true;
		setTimeout(() => (isHighlighted.value = false), 3000);
	}
}, 700);

watch(
	() => route.hash,
	() => scrollIntoViewIfSelected(),
	{ immediate: true }
);
</script>
