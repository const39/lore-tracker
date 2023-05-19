<template>
	<v-card-actions class="float-right">
		<v-btn :disabled="!selected" prepend-icon="mdi-folder-move" color="primary" @click="move">
			{{ $t("sidePanel.moveCard") }}
		</v-btn>
	</v-card-actions>
	<v-card-title class="mb-1 text-truncate">
		{{ `${$t("sidePanel.moveCard")} "${title}"` }}
	</v-card-title>
	<v-list class="list" density="compact">
		<FolderTreeGroup
			v-for="rootFolder in rootFolders"
			:key="rootFolder.folder.metadata.id"
			v-model:selected="selected"
			v-model:opened="opened"
			:title="$t(`categories.${rootFolder.category}`)"
			:folder="rootFolder.folder"
			:level="0"
			:disabled="isCardFolder(itemToMove) ? [itemToMove.metadata.id] : false"
		>
			<template #prepend>
				<v-icon :icon="Icon[rootFolder.category]" class="icon-color" size="small" end />
			</template>
		</FolderTreeGroup>
	</v-list>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { Icon } from "@/core/icons";
import {
	CardCategory,
	CardFolder,
	CardTypes,
	getText,
	isCard,
	isCardFolder,
} from "@/core/model/cards";
import { t as $t } from "@/core/translation";
import { useCardsStore } from "@/store/cards";
import { useSidePanel } from "@/store/sidePanel";
import FolderTreeGroup from "./FolderTreeGroup.vue";

const props = defineProps<{
	category?: CardCategory;
	openAt?: CardFolder;
}>();

const sidePanelStore = useSidePanel();
const cardsStore = useCardsStore();

const selected = ref<CardFolder>();
const opened = ref<CardFolder[]>([]);

const itemToMove = computed(() => sidePanelStore.fileTreeState.itemToMove);

const title = computed(() => (itemToMove.value ? getText(itemToMove.value) : ""));

const rootFolders = computed(() => {
	const categories = props.category ? [props.category] : Object.values(CardCategory);
	return categories.map((category) => {
		const root = cardsStore.getCategoryFolder(category);
		return {
			category: category,
			folder: root,
		};
	});
});

function move() {
	if (selected.value) {
		const parentFolder = sidePanelStore.fileTreeState.parentFolder;
		if (isCardFolder(itemToMove.value)) {
			cardsStore.moveFolder(itemToMove.value, selected.value);
		}
		if (isCard(itemToMove.value) && parentFolder) {
			cardsStore.moveCard(itemToMove.value, parentFolder, selected.value);
		}
	}
	sidePanelStore.resetFileTree();
}
</script>

<style scoped>
.icon-color {
	color: rgb(var(v-theme-surface));
}
</style>
