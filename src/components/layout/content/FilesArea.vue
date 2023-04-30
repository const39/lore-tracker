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
				<v-col cols="12" v-bind="cols">
					<CardAdd :category="category" fill-height />
				</v-col>
			</template>
			<template #item="{ element }">
				<v-col class="item" cols="12" v-bind="cols">
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


interface Cols {
	xs: number;
	sm: number;
	md: number;
	lg: number;
	xl?: number;
	xxl?: number;
}

// Compute card width for each breakpoint sizing based on the preferred density
const cols = computed<Cols>(() => {
	switch (prefStore.cardsDensity) {
		case "large":
			return { xs: 12, sm: 12, md: 6, lg: 6 };
		case "compact":
			return { xs: 12, sm: 6, md: 4, lg: 3 };
		case "comfortable":
		default:
			return { xs: 12, sm: 12, md: 6, lg: 4 };
	}
});
</script>

<style scoped>
.draggable {
	cursor: grab;
}
</style>