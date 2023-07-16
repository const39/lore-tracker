<template>
	<v-card-actions class="float-right">
		<slot name="action" v-bind="{ props: { disabled: !selected } }" />
		<v-btn icon="mdi-close" density="comfortable" @click="$emit('close')" />
	</v-card-actions>
	<v-card-title class="mb-1 text-truncate">
		{{ title }}
	</v-card-title>
	<v-list class="list" density="compact">
		<FolderTreeGroup
			v-for="folder in rootFolders"
			:key="folder.metadata.id"
			v-model:selected="selected"
			v-model:opened="openItems"
			:title="$t(`categories.${folder.metadata._category}`)"
			:folder="folder"
			:level="0"
			:disabled="disabled"
		>
			<template #prepend>
				<v-icon
					:icon="Icon[folder.metadata._category]"
					class="icon-color"
					size="small"
					end
				/>
			</template>
		</FolderTreeGroup>
	</v-list>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { Icon } from "@/core/utils/icons";
import { CardFolder, ID } from "@/core/model/cards";
import { t as $t } from "@/core/translation";
import FolderTreeGroup from "./FolderTreeGroup.vue";

const props = defineProps<{
	modelValue: CardFolder | undefined; // v-model
	title: string;
	rootFolders: CardFolder[];
	openAt?: CardFolder;
	disabled?: ID[];
}>();

const emit = defineEmits<{
	(e: "update:modelValue", value: typeof props.modelValue): void;
	(e: "close"): void;
}>();

const openItems = ref<CardFolder[]>([]);

const selected = computed({
	get() {
		return props.modelValue;
	},
	set(value) {
		emit("update:modelValue", value);
	},
});

// Update open items if the 'openAt' prop changes
// -> runs immediately on component load
watch(
	() => props.openAt,
	(target) => {
		openItems.value = target?.getHierarchy() ?? [];
		// Set the selected item to the openAt value
		selected.value = target;
	},
	{ immediate: true }
);

// Clear the selected value if it is under closed items
watch(openItems, () => {
	if (selected.value && !openItems.value.includes(selected.value)) selected.value = undefined;
});
</script>

<style scoped>
.icon-color {
	color: rgb(var(v-theme-surface));
}
</style>
