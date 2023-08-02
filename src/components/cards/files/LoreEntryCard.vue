<template>
	<BaseCard
		:id="itemData.id"
		:selected="selected"
		:draggable="draggable"
		with-options
		@edit="showForm"
		@delete="confirmDelete"
		@move="moveLoreEntry"
		@dragstart="($event) => $emit('dragstart', $event)"
	>
		<!-- Dynamic Card content component -->
		<component :is="contentComponent" :item-data="itemData" />
	</BaseCard>
</template>

<script lang="ts" setup>
import { useRepo } from "pinia-orm";
import { computed, defineAsyncComponent } from "vue";
import BaseCard from "@/components/cards/BaseCard.vue";
import { LoreEntry } from "@/core/models";
import { LoreEntryRepo } from "@/core/repositories";
import { t as $t } from "@/core/translation";
import utilities from "@/core/utils/functions";
import { useGlobalConfirmDialog } from "@/store/confirmDialog";
import { useSidePanel } from "@/store/sidePanel";

const props = defineProps<{
	itemData: LoreEntry;
	selected?: boolean;
	draggable?: boolean;
}>();

defineEmits<{
	(e: "dragstart", value: DragEvent): void;
}>();

const loreEntryRepo = useRepo(LoreEntryRepo);

const sidePanelStore = useSidePanel();
const { showConfirmDialog } = useGlobalConfirmDialog();

function showForm() {
	sidePanelStore.showLoreEntryForm("edit", props.itemData);
}

function moveLoreEntry() {
	sidePanelStore.showFolderTree(props.itemData);
}

function confirmDelete() {
	showConfirmDialog({
		title: $t(`dialogs.delete${utilities.capitalize(props.itemData.category)}`),
		message: $t(`dialogs.deleteConfirm`) + `"${props.itemData.getText()}" ?`,
		confirmAction: () => loreEntryRepo.delete(props.itemData.id),
	});
}

const contentComponent = computed(() => {
	const componentName = "Content" + utilities.capitalize(props.itemData.category);
	return defineAsyncComponent({
		loader: () => import(`./content/${componentName}.vue`),
	});
});
</script>
