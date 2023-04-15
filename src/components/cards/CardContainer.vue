<template>
	<BaseCard
		:id="itemData.id + '-card'"
		:with-options="!showForm"
		:outlined="outlined"
		@edit="showForm = true"
		@delete="onDelete"
	>
		<v-expand-transition>
			<!-- Dynamic Form component -->
			<FormWrapper
				v-if="showForm"
				:category="itemData._category"
				:edit="itemData.id"
				@done="showForm = false"
			/>
			<!-- Dynamic Card content component -->
			<component
				:is="contentComponent"
				v-else
				:class="{ draggable: !isSortDisabled }"
				:item-data="itemData"
			/>
		</v-expand-transition>
	</BaseCard>
</template>

<script lang="ts" setup>
import { eventBus } from "@/js/eventBus";
import { CardTypes } from "@/js/types";
import { computed, defineAsyncComponent, ref } from "vue";

import BaseCard from "./BaseCard.vue";
import FormWrapper from "./forms/FormWrapper.vue";

import utilities from "@/js/utilities";
import { useCardsStore } from "@/store/cards";
import { useFilterStore } from "@/store/filter";

const props = defineProps<{ itemData: CardTypes; outlined?: boolean }>();

const showForm = ref(false);

const filterStore = useFilterStore();
const cardsStore = useCardsStore();

const isSortDisabled = computed(() => {
	return filterStore.isFilterActive || !cardsStore.isDefaultOrder;
});

function onDelete() {
	eventBus.emit("delete-card", props.itemData);
}

const contentComponent = computed(() => {
	const componentName = "Content" + utilities.capitalize(props.itemData._category);
	return defineAsyncComponent({
		loader: () => import(`./content/${componentName}.vue`),
	});
});
</script>
