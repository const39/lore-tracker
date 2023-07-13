<template>
	<GenericArea
		v-model="currentFolder.subfolders"
		:title="$t('categories.folder') + 's'"
		:loading="loading"
		group="folders"
	>
		<template #actions>
			<v-btn
				:disabled="disableActions"
				class="m1-2"
				icon="mdi-plus"
				density="compact"
				variant="text"
				@click="newFolder"
			/>
			<v-btn
				:disabled="disableActions"
				class="mx-1"
				icon="mdi-file-tree"
				density="compact"
				variant="text"
				@click="showFolderTree"
			/>
		</template>
		<template #default="{ isDraggable, itemData }">
			<FolderCard :draggable="isDraggable" :folder="itemData" @open-folder="openFolder" />
		</template>
	</GenericArea>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import FolderCard from "@/components/cards/folder/FolderCard.vue";
import { CardCategory, CardFolder } from "@/core/model/cards";
import { t as $t } from "@/core/translation";
import { useSidePanel } from "@/store/sidePanel";
import GenericArea from "./GenericArea.vue";

const props = defineProps<{
	modelValue: CardFolder; // currentFolder v-model
	category: CardCategory;
	loading?: boolean;
	disableActions?: boolean;
}>();

const emit = defineEmits<{
	(e: "update:modelValue", value: typeof props.modelValue): void;
}>();

const router = useRouter();
const sidePanelStore = useSidePanel();

const currentFolder = computed({
	get() {
		return props.modelValue;
	},
	set(value) {
		emit("update:modelValue", value);
	},
});

function newFolder(): void {
	sidePanelStore.newFolderAddForm(props.category, currentFolder.value);
}

function showFolderTree() {
	sidePanelStore.newFolderTree();
}

function openFolder(folder: CardFolder): void {
	router.push({ params: { folderURI: [...folder.absolutePath.rawSegments] } });
}
</script>
