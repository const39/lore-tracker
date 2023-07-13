<template>
	<FolderTree
		v-model="selected"
		:root-folders="rootFolder"
		:open-at="cardsStore.currentFolder"
		:title="title"
		:disabled="disabledItems"
		@close="$emit('close')"
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
import {
	CardFolder,
	CardTypes,
	getCategory,
	getText,
	isCard,
	isCardFolder,
} from "@/core/model/cards";
import { t as $t } from "@/core/translation";
import { useCardsStore } from "@/store/cards";
import FolderTree from "./FolderTree.vue";

const props = defineProps<{
	parentFolder: CardFolder;
	itemToMove: CardTypes | CardFolder;
}>();

const emit = defineEmits(["close", "submit"]);

const cardsStore = useCardsStore();

const selected = ref<CardFolder>();

const title = computed(() => {
	const cardTitle = props.itemToMove ? getText(props.itemToMove) : "";
	return `${$t("sidePanel.moveCard")} "${cardTitle}"`;
});

const rootFolder = computed(() => {
	return props.itemToMove ? [cardsStore.getCategoryFolder(getCategory(props.itemToMove))] : [];
});

const disabledItems = computed(() => {
	return isCardFolder(props.itemToMove) ? [props.itemToMove.metadata.id] : undefined;
});

function move() {
	useTryCatch(() => {
		if (selected.value) {
			if (isCardFolder(props.itemToMove)) {
				cardsStore.moveFolder(props.itemToMove, selected.value);
			}
			if (isCard(props.itemToMove) && props.parentFolder) {
				cardsStore.moveCard(props.itemToMove, props.parentFolder, selected.value);
			}
		}
		emit("submit");
	});
}
</script>
