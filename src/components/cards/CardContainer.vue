<template>
	<BaseCard
		:id="itemData.id + '-card'"
		with-options
		@edit="showForm"
		@delete="onDelete"
		@dblclick="showForm"
	>
		<!-- Dynamic Card content component -->
		<component
			:is="contentComponent"
			:class="{ draggable: !isSortDisabled }"
			:item-data="itemData"
		/>
	</BaseCard>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent } from "vue";
import { CardTypes, getText } from "@/core/model/cards";
import { t as $t } from "@/core/translation";
import utilities from "@/core/utilities";
import { useCardsStore } from "@/store/cards";
import { useGlobalConfirmDialog } from "@/store/confirmDialog";
import { useFilterStore } from "@/store/filter";
import { useGlobalCardForm } from "@/store/globalCardForm";
import { usePreferencesStore } from "@/store/preferences";
import BaseCard from "./BaseCard.vue";

const props = defineProps<{ itemData: CardTypes }>();

const cardsStore = useCardsStore();
const formStore = useGlobalCardForm();
const filterStore = useFilterStore();
const prefStore = usePreferencesStore();
const { showConfirmDialog } = useGlobalConfirmDialog();

const isSortDisabled = computed(() => {
	return filterStore.isFilterActive || prefStore.cardsOrder !== "default";
});

function showForm() {
	formStore.newEditForm(props.itemData.id, cardsStore.currentFolder);
}

function onDelete() {
	showConfirmDialog({
		title: $t(`dialogs.delete${utilities.capitalize(props.itemData._category)}`),
		message: $t(`dialogs.deleteConfirm`) + `"${getText(props.itemData)}" ?`,
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
