<template>
	<v-col cols="12" md="4" sm="12">
		<v-expansion-panels v-model="isCollapsed">
			<v-expansion-panel>
				<v-expansion-panel-title>
					<div class="text-h5">
						<v-icon :icon="icons[category]" start />
						{{ $t(`categories.${category}`) }}
					</div>
				</v-expansion-panel-title>
				<v-expansion-panel-text>
					<CardAdd :category="category" :fill-height="false" />
					<draggable
						v-model="items"
						:animation="200"
						:disabled="isSortDisabled"
						:move="onMove"
						group="items"
						item-key="id"
						@start="drag = true"
						@end="drag = false"
					>
						<template #item="{ element }">
							<CardContainer
								:class="{ draggable: !isSortDisabled }"
								:item-data="element"
								outlined
							/>
						</template>
					</draggable>
				</v-expansion-panel-text>
			</v-expansion-panel>
		</v-expansion-panels>
	</v-col>
</template>

<script lang="ts" setup>
import { t as $t } from "@/js/translation";
import { computed, ref } from "vue";
import CardAdd from "../cards/CardAdd.vue";
import CardContainer from "../cards/CardContainer.vue";

import { CardCategory, CardTypes, Icon as icons } from "@/js/types";
import { useCardsStore } from "@/store/cards";
import { useFilterStore } from "@/store/filter";
import { onKeyDown } from "@vueuse/core";
import draggable from "vuedraggable";

const props = defineProps<{ category: CardCategory }>();

const drag = ref(false);
const isCollapsed = ref(0);

const filterStore = useFilterStore();
const cardsStore = useCardsStore();

function onMove(e: any) {
	/**
	 * Check if origin element ("draggedContext") type and target element ("relatedContext") type are the same
	 * This is to check that the dragged element will remain in the same list and not be dragged into another adjacent column
	 * If both elements type are the same, this function will return true and authorize the drag
	 * If they are different, it will return false to cancel the drag
	 */
	return e.draggedContext.element.constructor.name === e.relatedContext.element.constructor.name;
}

// Register hotkeys
onKeyDown(["1", "2", "3", "4", "5", "6"], hotkey);

/**
 * Manage each column hot key :
 * - Alt+1 : Collapse/expand Objective tab
 * - Alt+2 : Collapse/expand Event tab
 * - Alt+3 : Collapse/expand Location tab
 * - Alt+4 : Collapse/expand Character tab
 * - Alt+5 : Collapse/expand Faction tab
 * - Alt+6 : Collapse/expand Note tab
 */
function hotkey(e: KeyboardEvent) {
	if (e.altKey) {
		if (
			(e.key === "1" && props.category === CardCategory.Quest) ||
			(e.key === "2" && props.category === CardCategory.Event) ||
			(e.key === "3" && props.category === CardCategory.Location) ||
			(e.key === "4" && props.category === CardCategory.Character) ||
			(e.key === "5" && props.category === CardCategory.Faction) ||
			(e.key === "6" && props.category === CardCategory.Note)
		) {
			e.preventDefault();
			isCollapsed.value = isCollapsed.value === 0 ? 1 : 0;
		}
	}
}
const isSortDisabled = computed(() => {
	return filterStore.isFilterActive || !cardsStore.isDefaultOrder;
});

const items = computed({
	get(): CardTypes[] {
		return cardsStore.filteredCards[props.category];
	},
	set(list: CardTypes[]) {
		cardsStore.updateWholeList({ category: props.category, list });
	},
});
</script>

<style scoped>
.draggable {
	cursor: grab;
}
</style>
