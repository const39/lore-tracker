<template>
	<v-container>
		<draggable
			v-model="items"
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
				<v-col :cols="cols">
					<CardAdd :category="category" fill-height />
				</v-col>
			</template>
			<template #item="{ element }">
				<v-col :cols="cols" class="item">
					<CardContainer :class="{ draggable: !isSortDisabled }" :item-data="element" />
				</v-col>
			</template>
		</draggable>
	</v-container>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import CardAdd from "../cards/CardAdd.vue";
import CardContainer from "../cards/CardContainer.vue";

import { CardCategory, CardTypes } from "@/js/types";
import { useCardsStore } from "@/store/cards";
import { useFilterStore } from "@/store/filter";
import { usePreferencesStore } from "@/store/preferences";
import draggable from "vuedraggable";

const props = defineProps<{ category: CardCategory }>();
const drag = ref(false);

const filterStore = useFilterStore();
const prefStore = usePreferencesStore();
const cardsStore = useCardsStore();

const isSortDisabled = computed(() => {
	return filterStore.isFilterActive || prefStore.cardsOrder !== "default";
});

const items = computed({
	get(): CardTypes[] {
		return cardsStore.filteredCards[props.category];
	},
	set(list: CardTypes[]) {
		cardsStore.updateWholeList({ category: props.category, list });
	},
});

const cols = computed(() => {
	switch (prefStore.cardsDensity) {
		case "large":
			return 6;
		case "comfortable":
			return 4;
		case "compact":
			return 3;
		default:
			return 4;
	}
});
</script>

<style scoped>
.draggable {
	cursor: grab;
}
</style>
