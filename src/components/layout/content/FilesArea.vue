<template>
	<GenericArea v-model="currentFolder.files" :title="$t('categories.file') + 's'" group="files">
		<template #actions>
			<v-btn
				:disabled="disableActions"
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
import { CardCategory, CardFolder } from "@/core/model/cards";
import { t as $t } from "@/core/translation";
import { useSidePanel } from "@/store/sidePanel";
import GenericArea from "./GenericArea.vue";

const props = defineProps<{
	modelValue: CardFolder; // currentFolder v-model
	category: CardCategory;
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

function newFile(): void {
	formStore.newAddForm(props.category, currentFolder.value);
}
</script>
