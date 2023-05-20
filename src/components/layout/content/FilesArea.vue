<template>
	<GenericArea
		v-model="cardsStore.currentFolder.files"
		:title="$t('categories.file') + 's'"
		group="files"
	>
		<template #actions>
			<v-btn
				class="mx-2"
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
import { computed } from "vue";
import CardContainer from "@/components/cards/CardContainer.vue";
import { t as $t } from "@/core/translation";
import { useCardsStore } from "@/store/cards";
import { useSidePanel } from "@/store/sidePanel";
import GenericArea from "./GenericArea.vue";

const cardsStore = useCardsStore();
const formStore = useSidePanel();

const category = computed(() => cardsStore.currentCategory);

function newFile(): void {
	formStore.newAddForm(category.value, cardsStore.currentFolder);
}
</script>
