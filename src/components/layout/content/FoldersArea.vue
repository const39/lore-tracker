<template>
	<div class="my-3">
		<div class="mb-4 text-h6">
			<span> {{ $t("notepad.types.folder") + "s" }} </span>
			<v-btn
				class="mx-2"
				icon="mdi-plus"
				density="compact"
				variant="text"
				@click="newFolder"
			/>
		</div>
		<v-row>
			<v-col
				v-for="subfolder in folder.subfolders"
				:key="subfolder.metadata.id"
				cols="12"
				md="3"
			>
				<FolderCard :folder="subfolder" @open-folder="openFolder" />
			</v-col>
		</v-row>
	</div>
	<FolderDialog v-model="showFolderDialog" :parent="folder" />
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import FolderCard from "@/components/notepad/FolderCard.vue";
import FolderDialog from "@/components/notepad/FolderDialog.vue";
import { CardFolder } from "@/core/model/cards";
import { t as $t } from "@/core/translation";

defineProps<{ folder: CardFolder }>();

const showFolderDialog = ref(false);

const router = useRouter();

function newFolder(): void {
	showFolderDialog.value = true;
}

function openFolder(folder: CardFolder): void {
	router.push({ params: { folderURI: [...folder.path.rawSegments] } });
}
</script>
