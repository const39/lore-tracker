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
	selected: Maybe<Folder>;
	folder: Folder;
	level: number;
	title?: string;
	disabled?: boolean;
}>();

const emit = defineEmits<{
	(e: "update:selected", value: typeof props.selected): void;
}>();

const selectModelValue = computed({
	get() {
		return props.selected;
	},
	set(value) {
		emit("update:selected", value);
	},
});

const isHovered = ref(false);

const isSelected = computed(() => selectModelValue.value?.id === props.folder.id);

const color = computed(() => {
	if (isSelected.value) return "bg-selected-surface";
	if (isHovered.value) return "bg-hovered-surface";
	return undefined;
});

function onSelect() {
	selectModelValue.value = props.folder;
}
</script>

<style scoped>
.default-cursor:hover {
	cursor: default;
}
</style>
