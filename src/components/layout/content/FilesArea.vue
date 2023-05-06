<template>
	<div class="my-3">
		<div class="mb-4 text-h6">
			<span> {{ $t("categories.file") + "s" }} </span>
			<v-btn
				class="mx-2"
				icon="mdi-plus"
				density="compact"
				variant="text"
				@click="newFile"
			/>
		</div>
		<draggable
			v-model="files"
			:animation="200"
			:disabled="isSortDisabled"
			tag="v-row"
			draggable=".item"
			group="items"
			item-key="id"
			@start="drag = true"
			@end="drag = false"
		>
			<template #item="{ element }">
				<v-col class="item" cols="12" v-bind="density">
					<CardContainer :class="{ draggable: !isSortDisabled }" :item-data="element" />
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
import { useFilterStore } from "@/store/filter";
import { useGlobalCardForm } from "@/store/globalCardForm";
import { usePreferencesStore } from "@/store/preferences";

const drag = ref(false);

const filterStore = useFilterStore();
const prefStore = usePreferencesStore();
const cardsStore = useCardsStore();
const formStore = useGlobalCardForm();

const { density } = useGridDensity();

const isSortDisabled = computed(() => {
	return filterStore.isFilterActive || prefStore.cardsOrder !== "default";
});

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
		cardsStore.updateWholeList(list);
	},
});

function newFile(): void {
	formStore.newAddForm(category.value, cardsStore.currentFolder);
}
</script>

<style scoped>
.draggable {
	cursor: grab;
}
</style>
