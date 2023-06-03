<template>
	<FolderTree
		v-model="selected"
		:root-folders="rootFolder"
		:open-at="cardsStore.currentFolder"
		:title="title"
		:disabled="disabledItems"
		@close="close"
	>
		<template #action="{ props: actionProps }">
			<v-btn
				v-bind="actionProps"
				prepend-icon="mdi-folder-open"
				color="primary"
				@click="move"
			>
				{{ $t("sidePanel.moveCard") }}
			</v-btn>
		</template>
	</FolderTree>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { useTryCatch } from "@/composables/tryCatch";
import { CardFolder, getCategory, getText, isCard, isCardFolder } from "@/core/model/cards";
import { t as $t } from "@/core/translation";
import { useCardsStore } from "@/store/cards";
import { useSidePanel } from "@/store/sidePanel";
import FolderTree from "./FolderTree.vue";

const sidePanelStore = useSidePanel();
const cardsStore = useCardsStore();

const selected = ref<CardFolder>();

const itemToMove = computed(() => sidePanelStore.folderTreeState.itemToMove);

const title = computed(() => {
	const cardTitle = itemToMove.value ? getText(itemToMove.value) : "";
	return `${$t("sidePanel.moveCard")} "${cardTitle}"`;
});

const rootFolder = computed(() => {
	return itemToMove.value ? [cardsStore.getCategoryFolder(getCategory(itemToMove.value))] : [];
});

const disabledItems = computed(() => {
	return isCardFolder(itemToMove.value) ? [itemToMove.value.metadata.id] : undefined;
});

function move() {
	useTryCatch(() => {
		if (selected.value) {
			const parentFolder = sidePanelStore.folderTreeState.parentFolder;
			if (isCardFolder(itemToMove.value)) {
				cardsStore.moveFolder(itemToMove.value, selected.value);
			}
			if (isCard(itemToMove.value) && parentFolder) {
				cardsStore.moveCard(itemToMove.value, parentFolder, selected.value);
			}
		}
		close();
	});
}

function close() {
	sidePanelStore.resetFolderTree();
}
</script>
