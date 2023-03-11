<template>
	<v-container>
		<draggable
			tag="v-row"
			draggable=".item"
			:disabled="isSortDisabled"
			v-model="items"
			v-bind="{ animation: 200 }"
			group="items"
			@start="drag = true"
			@end="drag = false"
		>
			<template v-slot:header>
				<v-col cols="12" md="4">
					<CardAdd :category="category" fill-height />
				</v-col>
			</template>
			<v-col cols="12" md="4" class="item" v-for="item in items" :key="item.id">
				<CardContainer :class="{ draggable: !isSortDisabled }" :item-data="item"></CardContainer>
			</v-col>
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
