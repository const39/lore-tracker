<template>
	<v-breadcrumbs-item
		ref="refDropZone"
		:class="{ 'bg-hovered-surface': status === 'accepted' }"
		:title="title ?? folder.name"
		:to="to"
		:disabled="disabled"
		class="px-4 py-2 rounded-xl without-color"
		exact
	/>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { CustomMIMEType, DropPayload, useDropZone } from "@/composables/dragAndDrop";
import { useTryCatch } from "@/composables/tryCatch";
import { isCard, isCardFolder } from "@/core/model/cards";
import { Folder } from "@/core/models";
import { useCardsStore } from "@/store/cards";

const props = defineProps<{
	folder: Folder;
	title?: string;
	disabled?: boolean;
}>();

const to = computed(() => ({
	params: {
		folderId: props.folder.id,
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
<style scoped>
/* Fix the folder's color being used text color due to Vuetify forwarding the folder object as props to the v-breadcrumbs-item for some reason */
.without-color {
	color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity)) !important;
}
</style>
