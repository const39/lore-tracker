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
				class="mx-2"
				icon="mdi-plus"
				density="compact"
				variant="text"
				@click="newFolder"
			/>
		</template>
		<template #default="{ isDraggable, itemData }">
			<FolderCard :draggable="isDraggable" :folder="itemData" @open-folder="openFolder" />
		</template>
	</GenericArea>
	<FolderDialog v-model="showFolderDialog" />
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import FolderCard from "@/components/cards/folder/FolderCard.vue";
import FolderDialog from "@/components/cards/folder/FolderDialog.vue";
import { CardCategory, CardFolder } from "@/core/model/cards";
import { t as $t } from "@/core/translation";
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

const showFolderDialog = ref(false);

const router = useRouter();

const currentFolder = computed({
	get() {
		return props.modelValue;
	},
	set(value) {
		emit("update:modelValue", value);
	},
});

function newFolder(): void {
	showFolderDialog.value = true;
}

function openFolder(folder: CardFolder): void {
	router.push({ params: { folderURI: [...folder.absolutePath.rawSegments] } });
}
</script>
