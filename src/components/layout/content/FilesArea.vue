<template>
	<GenericArea
		v-model:selected="selected"
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
		<template #default="{ itemData, isDraggable, isSelected, toggle, select }">
			<!-- Selection toggle is enabled on ctrl-click only -->
			<LoreEntryCard
				v-click-outside="($e: MouseEvent) => onClickOutside($e, select)"
				:item-data="itemData"
				:draggable="isDraggable"
				:selected="isSelected"
				@click.ctrl="toggle"
				@dragstart="($e) => onDragStart($e, isSelected)"
			/>
		</template>
	</GenericArea>
</template>

<script lang="ts" setup>
import { useRepo } from "pinia-orm";
import { computed } from "vue";
import LoreEntryCard from "@/components/cards/files/LoreEntryCard.vue";
import { Campaign, Category, Indexable, LoreEntry, Orderable } from "@/core/models";
import { LoreEntryRepo } from "@/core/repositories";
import { t as $t } from "@/core/translation";
import { UUID } from "@/core/utils/types";
import { useSidePanel } from "@/store/sidePanel";
import GenericArea from "./GenericArea.vue";

const props = defineProps<{
	selected: LoreEntry[]; // v-model:selected
	items: LoreEntry[];
	campaign: Campaign;
	category: Category;
	folderId?: UUID;
	loading?: boolean;
	disableActions?: boolean;
}>();

const emit = defineEmits<{
	(e: "update:selected", value: LoreEntry[]): void;
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

const sidePanel = useSidePanel();

/**
 * Save the new items order.
 * @param movedItems the items with their new position.
 */
function onSort(movedItems: Array<Indexable & Orderable>) {
	useRepo(LoreEntryRepo).changeOrder(movedItems);
}

function onDragStart(e: DragEvent, isSelected: boolean) {
	if (isSelected) emit("dragstart", e);
}

function onClickOutside(e: MouseEvent, selectFn: (arg: boolean) => void) {
	if (!e.ctrlKey) selectFn(false);
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
