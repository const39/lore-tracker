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
			<FormWrapper
				v-if="showForm"
				:category="itemData._category"
				:edit="itemData.id"
				@done="showForm = false"
			></FormWrapper>
			<!-- Dynamic Card content component -->
			<component v-else :is="contentComponent" :class="{ draggable: !isSortDisabled }" :item-data="itemData" />
		</v-expand-transition>
	</BaseCard>
</template>

<script lang="ts" setup>
import { ref, computed, defineAsyncComponent } from "vue";
import { CardTypes } from "@/js/types";
import { eventBus } from "@/js/eventBus";

import BaseCard from "./BaseCard.vue";
import FormWrapper from "./forms/FormWrapper.vue";

import utilities from "@/js/utilities";
import { useStore } from "@/store";

const props = defineProps<{ itemData: CardTypes; outlined?: boolean }>();

const showForm = ref(false);

const store = useStore();

function onDelete() {
	eventBus.emit("delete-card", props.itemData);
}

const contentComponent = computed(() => {
	const componentName = "Content" + utilities.capitalize(props.itemData._category);
	return defineAsyncComponent({
		loader: () => import(`./content/${componentName}.vue`),
	});
});

const isSortDisabled = computed(() => {
	return store.isFilterActive || !store.isDefaultOrder;
});
</script>

<style></style>
