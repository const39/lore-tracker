<template>
	<v-list-item
		:class="color"
		:title="title ?? folder.name"
		:disabled="disabled"
		class="rounded default-cursor"
		@mouseenter="isHovered = true"
		@mouseleave="isHovered = false"
		@click="onSelect"
	>
		<template #prepend>
			<slot name="prepend" />
		</template>
		<template #append>
			<slot name="append" />
		</template>
	</v-list-item>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { Folder } from "@/core/models";
import { Maybe } from "@/core/utils/types";

const props = defineProps<{
	folder: Folder;
	level: number;
	title?: string;
	disabled?: boolean;
}>();

const selected = defineModel<Maybe<Folder>>("selected", { required: true }); // v-model:selected

const isHovered = ref(false);

const isSelected = computed(() => selected.value?.id === props.folder.id);

const color = computed(() => {
	if (isSelected.value) return "bg-selected-surface";
	if (isHovered.value) return "bg-hovered-surface";
	return undefined;
});

function onSelect() {
	selected.value = props.folder;
}
</script>

<style scoped>
.default-cursor:hover {
	cursor: default;
}
</style>
