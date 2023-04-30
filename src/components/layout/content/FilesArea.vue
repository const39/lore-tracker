<template>
	<div class="my-3">
		<div class="mb-4 py-3 text-h6">
			{{ $t("notepad.types.file") + "s" }}
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
			<template #header>
				<v-col cols="12" v-bind="density">
					<CardAdd :category="category" fill-height />
				</v-col>
			</template>
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
import CardAdd from "@/components/cards/CardAdd.vue";
import CardContainer from "@/components/cards/CardContainer.vue";
import { useGridDensity } from "@/composables/gridDensity";
import { CardCategory, CardFolder } from "@/core/model/cards";
import { t as $t } from "@/core/translation";
import { useCardsStore } from "@/store/cards";
import { useFilterStore } from "@/store/filter";
import { usePreferencesStore } from "@/store/preferences";

const props = defineProps<{ category: CardCategory; folder: CardFolder }>();

const drag = ref(false);

const filterStore = useFilterStore();
const prefStore = usePreferencesStore();
const cardsStore = useCardsStore();

const { density } = useGridDensity();

const isSortDisabled = computed(() => {
	return filterStore.isFilterActive || prefStore.cardsOrder !== "default";
});

const files = computed({
	get() {
		return props.folder.files;
	},
	set(list) {
		cardsStore.updateWholeList(props.category, list);
	},
});
</script>

<style scoped>
.draggable {
	cursor: grab;
}
</style>
