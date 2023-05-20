<template>
	<div class="my-3">
		<div class="mb-4 d-flex align-center text-h6">
			<v-badge :content="files.length" class="mr-2 mb-1" color="grey" inline />
			<span class=""> {{ $t("categories.file") + "s" }} </span>
			<v-btn
				class="mx-2"
				icon="mdi-plus"
				density="compact"
				variant="text"
				@click="newFile"
			/>
		</div>
		<!-- the <draggable> component only controls the 'sort' drag&drop mode -->
		<draggable
			v-model="files"
			:animation="200"
			:disabled="prefStore.dragAndDropMode !== 'sort'"
			tag="v-row"
			draggable=".draggable-file"
			group="files"
			item-key="id"
			@start="drag = true"
			@end="drag = false"
		>
			<template #item="{ element }">
				<v-col class="draggable-file" cols="12" v-bind="density">
					<!-- Card is draggable if drag&drop is either in 'drag' or 'sort' mode -->
					<CardContainer
						:draggable="prefStore.dragAndDropMode !== 'disabled'"
						:item-data="element"
					/>
				</v-col>
			</template>
		</draggable>
	</div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import draggable from "vuedraggable";
import CardContainer from "@/components/cards/CardContainer.vue";
import { useGridDensity } from "@/composables/gridDensity";
import { getText } from "@/core/model/cards";
import { t as $t } from "@/core/translation";
import { useCardsStore } from "@/store/cards";
import { usePreferencesStore } from "@/store/preferences";
import { useSidePanel } from "@/store/sidePanel";

const drag = ref(false);

const prefStore = usePreferencesStore();
const cardsStore = useCardsStore();
const formStore = useSidePanel();

const { density } = useGridDensity();

const category = computed(() => cardsStore.currentCategory);

const files = computed({
	get() {
		const files = cardsStore.currentFolder.files;
		if (prefStore.cardsOrder === "alphanumeric")
			// Sort the shallow copy of the files list in the alphanumeric order
			return [...files].sort((a, b) => {
				const textA = getText(a).toLowerCase();
				const textB = getText(b).toLowerCase();
				return textA.localeCompare(textB);
			});
		else return files;
	},
	set(list) {
		cardsStore.updateWholeFileList(list);
	},
});

function newFile(): void {
	formStore.newAddForm(category.value, cardsStore.currentFolder);
}
</script>
