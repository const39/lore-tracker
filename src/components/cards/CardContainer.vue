<template>
	<BaseCard
		:id="itemData.id + '-card'"
		:draggable-data="draggable ? itemData : undefined"
		with-options
		@edit="showForm"
		@delete="onDelete"
		@dblclick="showForm"
	>
		<!-- Dynamic Card content component -->
		<component
			:is="contentComponent"
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
import { useGlobalCardForm } from "@/store/globalCardForm";
import BaseCard from "./BaseCard.vue";

const props = defineProps<{ itemData: CardTypes; draggable?: boolean }>();

const cardsStore = useCardsStore();
const formStore = useGlobalCardForm();
const { showConfirmDialog } = useGlobalConfirmDialog();

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
