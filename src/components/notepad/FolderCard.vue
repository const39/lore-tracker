<template>
	<BaseCard
		v-if="!editMode"
		:with-options="!editMode"
		@edit="editMode = true"
		@dblclick="openFolder(folder)"
	>
		<v-card-title class="pr-0 d-flex align-center">
			<v-badge :content="childrenCount" color="grey">
				<v-icon :icon="Icon.folder" :color="folder.color" size="x-large"></v-icon>
			</v-badge>
			<div class="pl-4 pt-2 flex-grow-1 text-subtitle-1">
				{{ folder.name }}
			</div>
		</v-card-title>
	</BaseCard>
	<FolderForm
		v-else
		:parent-path="parentPath"
		:edit="folder"
		@close="editMode = false"
		@submit="editMode = false"
	/>
</template>

<script lang="ts" setup>
import { t as $t } from "@/js/translation";
import { computed, ref } from "vue";
import FolderForm from "./FolderForm.vue";

import { Folder, Icon } from "@/js/types";
import utilities from "@/js/utilities";
import { useNotepadStore } from "@/store/notepad";
import BaseCard from "../cards/BaseCard.vue";

const props = defineProps<{
	folder: Folder;
	parentPath: string;
}>();

const emit = defineEmits<{
	(e: "open-folder", folder: Folder): void;
}>();

const editMode = ref(false);

const notepadStore = useNotepadStore();

function openFolder(folder: Folder) {
	emit("open-folder", folder);
}

const childrenCount = computed(() => {
	const fullPath = utilities.joinPaths(true, props.parentPath, props.folder.name);
	const content = notepadStore.getFolderContent(fullPath);
	return content ? content.folders.length + content.files.length : 0;
});
</script>
