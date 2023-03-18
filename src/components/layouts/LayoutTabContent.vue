<template>
	<v-container>
		<draggable
			v-model="items"
			tag="v-row"
			draggable=".item"
			group="items"
			item-key="id"
			:animation="200"
			:disabled="isSortDisabled"
			@start="drag = true"
			@end="drag = false"
		>
			<template #header>
				<v-col cols="12" md="4">
					<CardAdd :category="category" fill-height />
				</v-col>
			</template>
			<template #item="{ element }">
				<v-col cols="12" md="4" class="item">
					<CardContainer :class="{ draggable: !isSortDisabled }" :item-data="element"></CardContainer>
				</v-col>
			</template>
		</draggable>
	</v-container>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import CardContainer from "../cards/CardContainer.vue";
import CardAdd from "../cards/CardAdd.vue";

import draggable from "vuedraggable";
import { CardCategory, CardTypes } from "@/js/types";
import { useStore } from "@/store";

const props = defineProps<{ category: CardCategory }>();
const drag = ref(false);

const store = useStore();

const isSortDisabled = computed(() => {
	return store.isFilterActive || !store.isDefaultOrder;
});

const items = computed({
	get(): CardTypes[] {
		return store.getCards[props.category];
	},
	set(list: CardTypes[]) {
		store.commitAndSave({
			commit: "updateWholeList",
			payload: { category: props.category, list },
		});
	},
});
</script>

<style scoped>
.draggable {
	cursor: grab;
}
</style>
