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
		v-else-if="folder.parent"
		:parent="folder.parent"
		:edit="folder"
		@close="editMode = false"
		@submit="editMode = false"
	/>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import BaseCard from "@/components/cards/BaseCard.vue";
import { Icon } from "@/core/constants";
import { CardFolder } from "@/core/model/cards";
import FolderForm from "./FolderForm.vue";

const props = defineProps<{
	folder: CardFolder;
}>();

const emit = defineEmits<{
	(e: "open-folder", folder: CardFolder): void;
}>();

const editMode = ref(false);

function openFolder(folder: CardFolder) {
	emit("open-folder", folder);
}

const childrenCount = computed(() => {
	return props.folder.subfolders.length + props.folder.files.length;
});
</script>
