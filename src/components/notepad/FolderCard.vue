<template>
	<BaseCard
		v-if="!editMode"
		:with-options="!editMode"
		@edit="editMode = true"
		@dblclick="openFolder(folder)"
	>
		<v-card-title class="pr-0 d-flex align-center">
			<v-badge :content="childrenCount" color="grey">
				<v-icon :icon="Icon.folder" :color="folder.metadata.color" size="x-large" />
			</v-badge>
			<div class="pl-4 pt-2 flex-grow-1 text-subtitle-1">
				{{ folder.metadata.name }}
			</div>
		</v-card-title>
	</BaseCard>
	<FolderForm
		v-else
		:parent="folder.parent"
		:edit="folder"
		@close="editMode = false"
		@submit="editMode = false"
	/>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { Icon } from "@/core/constants";
import { Folder } from "@/core/model/fileTree";
import BaseCard from "../cards/BaseCard.vue";
import FolderForm from "./FolderForm.vue";

const props = defineProps<{
	folder: Folder;
}>();

const emit = defineEmits<{
	(e: "open-folder", folder: Folder): void;
}>();

const editMode = ref(false);

function openFolder(folder: Folder) {
	emit("open-folder", folder);
}

const childrenCount = computed(() => {
	return props.folder.subfolders.length + props.folder.files.length;
});
</script>
