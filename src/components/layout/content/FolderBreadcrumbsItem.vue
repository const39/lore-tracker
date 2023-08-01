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
import { useRepo } from "pinia-orm";
import { computed, ref } from "vue";
import { CustomMIMEType, DragItem, useDropZone } from "@/composables/dragAndDrop";
import { useTryCatch } from "@/composables/tryCatch";
import { Folder, LoreEntry } from "@/core/models";
import { FolderRepo, LoreEntryRepo } from "@/core/repositories";

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

const loreEntryRepo = useRepo(LoreEntryRepo);
const folderRepo = useRepo(FolderRepo);

const { status } = useDropZone(refDropZone, "move", onDropAccepted, {
	acceptMIME: [CustomMIMEType.LoreEntry, CustomMIMEType.Folder],
	acceptMode: ["moveToFolder"],
});

/**
 * Callback triggered when the user releases the click (i.e. drops the item) in the drop zone
 */
function onDropAccepted(items: DragItem[]) {
	if (items.length) {
		useTryCatch(() => {
			items.forEach(({ data: itemToMove, dataType }) => {
				if (dataType === CustomMIMEType.Folder && itemToMove instanceof Folder) {
					folderRepo.update({ id: itemToMove.id, parentId: props.folder.id });
				}

				if (dataType === CustomMIMEType.LoreEntry && itemToMove instanceof LoreEntry) {
					loreEntryRepo.update({ id: itemToMove.id, folderId: props.folder.id });
				}
			});
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
