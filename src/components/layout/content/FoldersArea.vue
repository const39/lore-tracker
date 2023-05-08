<template>
	<div class="my-3">
		<div class="mb-4 text-h6">
			<span> {{ $t("categories.folder") + "s" }} </span>
			<v-btn
				class="mx-2"
				icon="mdi-plus"
				density="compact"
				variant="text"
				@click="newFolder"
			/>
		</div>
		<!-- the <draggable> component only controls the 'sort' drag&drop mode -->
		<draggable
			v-model="subfolders"
			:animation="200"
			:disabled="prefStore.dragAndDropMode !== 'sort'"
			tag="v-row"
			draggable=".item"
			group="items"
			item-key="id"
			@start="drag = true"
			@end="drag = false"
		>
			<template #item="{ element }">
				<v-col
					class="item"
					cols="12"
					v-bind="density"
				>
					<FolderCard
						:draggable="prefStore.dragAndDropMode === 'sort'"
						:folder="element"
						@open-folder="openFolder"
					/>
				</v-col>
			</template>
		</draggable>
	</div>
	<FolderDialog v-model="showFolderDialog" />
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import draggable from "vuedraggable";
import FolderCard from "@/components/cards/folder/FolderCard.vue";
import FolderDialog from "@/components/cards/folder/FolderDialog.vue";
import { useGridDensity } from "@/composables/gridDensity";
import { CardFolder } from "@/core/model/cards";
import { t as $t } from "@/core/translation";
import { useCardsStore } from "@/store/cards";
import { usePreferencesStore } from "@/store/preferences";

const drag = ref(false);
const showFolderDialog = ref(false);

const router = useRouter();
const cardsStore = useCardsStore();
const prefStore = usePreferencesStore();
const { density } = useGridDensity();

const subfolders = computed({
	get() {
		const folders = cardsStore.currentFolder.subfolders;
		if (prefStore.cardsOrder === "alphanumeric")
			// Sort the shallow copy of the folders list in the alphanumeric order
			return [...folders].sort((a, b) => {
				const textA = a.metadata.name.toLowerCase();
				const textB = b.metadata.name.toLowerCase();
				return textA.localeCompare(textB);
			});
		else return folders;
	},
	set(list) {
		cardsStore.updateWholeSubfolderList(list);
	},
});

function newFolder(): void {
	showFolderDialog.value = true;
}

function openFolder(folder: CardFolder): void {
	router.push({ params: { folderURI: [...folder.absolutePath.rawSegments] } });
}
</script>
