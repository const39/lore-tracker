<template>
	<v-breadcrumbs-item
		ref="refDropZone"
		:class="{ 'bg-hovered-surface': status === 'accepted' }"
		:title="title ?? folder.metadata.name"
		:to="to"
		:disabled="disabled"
		class="px-4 py-2 rounded-xl"
		exact
	/>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { CustomMIMEType, DropPayload, useDropZone } from "@/composables/dragAndDrop";
import { useTryCatch } from "@/composables/tryCatch";
import { CardFolder, isCard, isCardFolder } from "@/core/model/cards";
import { useCardsStore } from "@/store/cards";

const props = defineProps<{
	folder: CardFolder;
	title?: string;
	disabled?: boolean;
}>();

const to = computed(() => ({
	params: {
		folderURI: [...props.folder.absolutePath.rawSegments],
	},
}));

const refDropZone = ref<HTMLElement | null>(null);

const cardsStore = useCardsStore();
const { status } = useDropZone(refDropZone, "move", onDropAccepted, {
	acceptMIME: [CustomMIMEType.CardType, CustomMIMEType.CardFolder],
	acceptMode: ["moveToFolder"],
});

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
</script>
