<template>
	<GenericArea
		:items="currentFolder.files"
		:title="$t('categories.file') + 's'"
		:loading="loading"
		group="files"
		@sort="onSort"
	>
		<template #actions>
			<v-btn
				:disabled="disableActions"
				class="mx-1"
				icon="mdi-plus"
				density="compact"
				variant="text"
				@click="newFile"
			/>
		</template>
		<template #default="{ isDraggable, itemData }">
			<CardContainer :draggable="isDraggable" :item-data="itemData" />
		</template>
	</GenericArea>
</template>

<script lang="ts" setup>
import { useRepo } from "pinia-orm";
import { computed } from "vue";
import CardContainer from "@/components/cards/CardContainer.vue";
import { Category, Folder, LoreEntry } from "@/core/models";
import { LoreEntryRepo } from "@/core/repositories";
import { t as $t } from "@/core/translation";
import { useSidePanel } from "@/store/sidePanel";
import GenericArea from "./GenericArea.vue";

const props = defineProps<{
	modelValue: Folder<LoreEntry>; // currentFolder v-model
	category: Category;
	loading?: boolean;
	disableActions?: boolean;
}>();

const emit = defineEmits<{
	(e: "update:modelValue", value: typeof props.modelValue): void;
}>();

const formStore = useSidePanel();

const currentFolder = computed({
	get() {
		return props.modelValue;
	},
	set(value) {
		emit("update:modelValue", value);
	},
});

/**
 * Save the new items order.
 * @param movedItems the items with their new position.
 */
function onSort(movedItems: LoreEntry[]) {
	useRepo(LoreEntryRepo).changeOrder(movedItems);
}

function newFile(): void {
	formStore.newFileAddForm(props.category, currentFolder.value);
}
</script>
