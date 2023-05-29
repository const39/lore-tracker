<template>
	<v-list-item
		:class="color"
		:title="title ?? folder.metadata.name"
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
import { CardFolder } from "@/core/model/cards";

const props = defineProps<{
	selected: CardFolder | undefined;
	folder: CardFolder;
	level: number;
	title?: string;
	disabled?: boolean;
}>();

const emit = defineEmits<{
	(e: "update:selected", value: typeof props.selected): void;
}>();

const isHovered = ref(false);

const selectModelValue = computed({
	get() {
		return props.selected;
	},
	set(value) {
		emit("update:selected", value);
	},
});

const isSelected = computed(() => selectModelValue.value === props.folder);

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
