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
import { computed, defineAsyncComponent, ref } from "vue";
import { eventBus } from "@/core/eventBus";
import { CardTypes } from "@/core/model/cards";
import utilities from "@/core/utilities";
import { useFilterStore } from "@/store/filter";
import { usePreferencesStore } from "@/store/preferences";
import BaseCard from "./BaseCard.vue";
import FormWrapper from "./forms/FormWrapper.vue";

const props = defineProps<{ itemData: CardTypes; outlined?: boolean }>();

const showForm = ref(false);

const filterStore = useFilterStore();
const prefStore = usePreferencesStore();

const isSortDisabled = computed(() => {
	return filterStore.isFilterActive || prefStore.cardsOrder !== "default";
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
