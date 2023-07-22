<template>
	<FolderTree
		v-model="selected"
		:root-folders="rootFolder"
		:open-at="appStore.currentFolder"
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
import { useRepo } from "pinia-orm";
import { computed, ref } from "vue";
import { useTryCatch } from "@/composables/tryCatch";
import { Folder, LoreEntry } from "@/core/models";
import { FolderRepo, LoreEntryRepo } from "@/core/repositories";
import { t as $t } from "@/core/translation";
import { useAppStore } from "@/store/app";
import FolderTree from "./FolderTree.vue";

const props = defineProps<{
	itemToMove: Folder | LoreEntry;
}>();

const emit = defineEmits(["close", "submit"]);

const appStore = useAppStore();

const loreEntryRepo = useRepo(LoreEntryRepo);
const folderRepo = useRepo(FolderRepo);

const selected = ref<Folder>();

const title = computed(() => {
	return `${$t("sidePanel.moveCard")} "${props.itemToMove.getText()}"`;
});

const rootFolder = computed(() => {
	return [folderRepo.getRootFolder(props.itemToMove.category)];
});

const disabledItems = computed(() => {
	return props.itemToMove instanceof Folder ? [props.itemToMove.id] : undefined;
});

function move() {
	useTryCatch(() => {
		if (selected.value) {
			if (props.itemToMove instanceof Folder) {
				folderRepo.update({ id: props.itemToMove.id, parentId: selected.value.id });
			}
			if (props.itemToMove instanceof LoreEntry) {
				loreEntryRepo.update({ id: props.itemToMove.id, folderId: selected.value.id });
			}
		}
		emit("submit");
	});
}
</script>
