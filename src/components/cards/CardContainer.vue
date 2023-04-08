<template>
	<BaseCard
		:with-options="!showForm"
		:outlined="outlined"
		:id="itemData.id + '-card'"
		@edit="showForm = true"
		@delete="onDelete"
	>
		<v-expand-transition>
			<!-- Dynamic Form component -->
			<component
				v-if="showForm"
				:is="formComponent"
				:edit="itemData.id"
				@close="showForm = false"
			/>
			<!-- Dynamic Card content component -->
			<component v-else :is="contentComponent" :class="{ draggable: !isSortDisabled }" :item-data="itemData" />
		</v-expand-transition>
	</BaseCard>
</template>

<script lang="ts" setup>
import { ref, computed, defineAsyncComponent } from "vue";
import { CardTypes } from "@/js/types";
import { useEventHub, CardEvent } from "@/js/eventHub";

import BaseCard from "./BaseCard.vue";

import utilities from "@/js/utilities";
import { useStore } from "@/store";

const props = defineProps<{ itemData: CardTypes; outlined?: boolean }>();

const showForm = ref(false);
const showContent = ref(true);

const eventHub = useEventHub();
const store = useStore();

function onDelete() {
	eventHub.emit(CardEvent.ID, new CardEvent(props.itemData));
}

const contentComponent = computed(() => {
	const componentName = "Content" + utilities.capitalize(props.itemData._category);
	return defineAsyncComponent({
		loader: () => import(`./content/${componentName}.vue`),
	});
});
const formComponent = computed(() => {
	const componentName = "Form" + utilities.capitalize(props.itemData._category);
	return defineAsyncComponent({
		loader: () => import(`./forms/${componentName}.vue`),
	});
});
const isSortDisabled = computed(() => {
	return store.isFilterActive || !store.isDefaultOrder;
});
</script>

<style></style>
