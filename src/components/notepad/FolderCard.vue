<template>
	<div>
		<v-hover v-if="!editMode" v-slot="{ isHovering }">
			<v-card @dblclick="openFolder(folder)">
				<v-card-title class="d-flex">
					<v-icon size="x-large" :color="folder.color">{{ folderIcon }}</v-icon>
					<div class="mx-1 flex-grow-1">
						<span class="px-1 text-subtitle-1"> {{ folder.name }} </span>
					</div>
					<v-tooltip location="bottom">
						<template v-slot:activator="{ props }">
							<v-avatar class="text-caption" size="20" color="grey" v-bind="props">
								{{ childrenCount }}
							</v-avatar>
						</template>
						<span>{{ childrenCount + $t("notepad.folder.childElements") }}</span>
					</v-tooltip>
					<v-fade-transition>
						<v-icon v-if="isHovering" class="mx-2" @click="editMode = true">mdi-pencil</v-icon>
					</v-fade-transition>
				</v-card-title>
			</v-card>
		</v-hover>
		<FolderForm
			v-else
			:parent-path="parentPath"
			:edit="folder"
			@close="editMode = false"
			@submit="editMode = false"
		></FolderForm>
	</div>
</template>

<script lang="ts" setup>
import { t as $t } from "@/js/translation";
import { computed, ref } from "vue";
import FolderForm from "./FolderForm.vue";

import { Folder, Icon } from "@/js/types";
import utilities from "@/js/utilities";
import { useNotepadStore } from "@/store/notepad";

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

const folderIcon = computed(() => {
	return Icon.folder;
});

const childrenCount = computed(() => {
	const fullPath = utilities.joinPaths(true, props.parentPath, props.folder.name);
	const content = notepadStore.getFolderContent(fullPath);
	return content ? content.folders.length + content.files.length : 0;
});
</script>

<style></style>
