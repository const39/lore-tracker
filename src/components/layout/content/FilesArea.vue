<template>
	<GenericArea
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
		<template #default="{ isDraggable, itemData }">
			<CardContainer :draggable="isDraggable" :item-data="itemData" />
		</template>
	</GenericArea>
</template>

<script lang="ts" setup>
import { useRepo } from "pinia-orm";
import CardContainer from "@/components/cards/CardContainer.vue";
import { Category, LoreEntry } from "@/core/models";
import { LoreEntryRepo } from "@/core/repositories";
import { t as $t } from "@/core/translation";
import { UUID } from "@/core/utils/types";
import { useSidePanel } from "@/store/sidePanel";
import GenericArea from "./GenericArea.vue";

const props = defineProps<{
	items: LoreEntry[];
	category: Category;
	folderId?: UUID;
	loading?: boolean;
	disableActions?: boolean;
}>();

const sidePanel = useSidePanel();

/**
 * Save the new items order.
 * @param movedItems the items with their new position.
 */
function onSort(movedItems: LoreEntry[]) {
	useRepo(LoreEntryRepo).changeOrder(movedItems);
}

function newLoreEntry(): void {
	if (props.folderId) {
		sidePanel.showLoreEntryForm(
			"add",
			LoreEntry.create({ category: props.category, folderId: props.folderId })
		);
	}
}
</script>
