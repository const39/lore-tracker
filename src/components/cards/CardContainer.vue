<template>
	<BaseCard
		:id="itemData.id + '-card'"
		:with-options="!showForm"
		:outlined="outlined"
		@edit="showForm = true"
		@delete="onDelete"
		@dblclick="showForm = true"
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
import { CardTypes, getText } from "@/core/model/cards";
import { t as $t } from "@/core/translation";
import utilities from "@/core/utilities";
import { useCardsStore } from "@/store/cards";
import { useGlobalConfirmDialog } from "@/store/confirmDialog";
import { useFilterStore } from "@/store/filter";
import { usePreferencesStore } from "@/store/preferences";
import BaseCard from "./BaseCard.vue";
import FormWrapper from "./files/forms/FormWrapper.vue";

const props = defineProps<{ itemData: CardTypes; outlined?: boolean }>();

const showForm = ref(false);

const cardsStore = useCardsStore();
const filterStore = useFilterStore();
const prefStore = usePreferencesStore();
const { showConfirmDialog } = useGlobalConfirmDialog();

const isSortDisabled = computed(() => {
	return filterStore.isFilterActive || prefStore.cardsOrder !== "default";
});

function onDelete() {
	showConfirmDialog({
		title: `${$t("dialogs.deleteTitle")} "${getText(props.itemData)}" ?`,
		message: $t(`dialogs.delete${utilities.capitalize(props.itemData._category)}`),
		confirmAction: () => cardsStore.deleteCard(props.itemData),
	});
}

const contentComponent = computed(() => {
	const componentName = "Content" + utilities.capitalize(props.itemData._category);
	return defineAsyncComponent({
		loader: () => import(`./files/content/${componentName}.vue`),
	});
});
</script>
