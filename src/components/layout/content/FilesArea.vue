<template>
	<GenericArea
		v-model:selected="selectedItems"
		:items="items"
		:title="$t('categories.file') + 's'"
		:loading="loading"
		group="files"
		@sort="onSort"
	>
		<template #actions>
			<v-btn
				:disabled="disableActions || !folderId"
				class="mx-1"
				icon="mdi-plus"
				density="compact"
				variant="text"
				@click="newLoreEntry"
			/>
		</template>
		<template #default="{ itemData, isDraggable, isSelected, toggle }">
			<LoreEntryCard
				:item-data="itemData"
				:draggable="isDraggable"
				:selected="isSelected"
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
import CardDragImage from "@/components/cards/CardDragImage.vue";
import LoreEntryCard from "@/components/cards/files/LoreEntryCard.vue";
import { CustomMIMEType, DragItem, startDrag } from "@/composables/dragAndDrop";
import { Campaign, Category, Indexable, LoreEntry, Orderable } from "@/core/models";
import { LoreEntryRepo } from "@/core/repositories";
import { t as $t } from "@/core/translation";
import { UUID } from "@/core/utils/types";
import { useSidePanel } from "@/store/sidePanel";
import GenericArea from "./GenericArea.vue";

const props = defineProps<{
	items: LoreEntry[];
	campaign: Campaign;
	category: Category;
	folderId?: UUID;
	loading?: boolean;
	disableActions?: boolean;
}>();

const sidePanel = useSidePanel();

const selectedItems = ref<LoreEntry[]>([]);
const dragImage = ref<HTMLElement | null>(null);

/**
 * Save the new items order.
 * @param movedItems the items with their new position.
 */
function onSort(movedItems: Array<Indexable & Orderable>) {
	useRepo(LoreEntryRepo).changeOrder(movedItems);
}

/**
 * Callback triggered when the user grabs the cards for a drag & drop
 */
function onDragStart(e: DragEvent) {
	const items: DragItem[] = selectedItems.value.map((item) => ({
		data: item,
		dataType: CustomMIMEType.LoreEntry,
	}));
	startDrag(e, items, {
		dragImage: { image: dragImage, offsetX: -12, offsetY: -8 },
	});
}

function newLoreEntry(): void {
	if (props.folderId) {
		sidePanel.showLoreEntryForm(
			"add",
			LoreEntry.create({
				campaignId: props.campaign.id,
				category: props.category,
				folderId: props.folderId,
			})
		);
	}
}
</script>
