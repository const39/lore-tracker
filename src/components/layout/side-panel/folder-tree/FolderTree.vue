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
			:key="folder.id"
			v-model:selected="selected"
			v-model:opened="openItems"
			:title="$t(`categories.${folder.category}`)"
			:folder="folder"
			:level="0"
			:disabled="disabled"
		>
			<template #prepend>
				<v-icon :icon="Icon[folder.category]" class="icon-color" size="small" end />
			</template>
		</FolderTreeGroup>
	</v-list>
</template>

<script lang="ts" setup>
import { useRepo } from "pinia-orm";
import { ref, watch } from "vue";
import { Folder } from "@/core/models";
import { FolderRepo } from "@/core/repositories";
import { t as $t } from "@/core/translation";
import { Icon } from "@/core/utils/icons";
import { Maybe, UUID } from "@/core/utils/types";
import FolderTreeGroup from "./FolderTreeGroup.vue";

const props = defineProps<{
	title: string;
	rootFolders: Folder[];
	openAt?: Maybe<Folder>;
	disabled?: UUID[];
}>();

defineEmits(["close"]);

const selected = defineModel<Maybe<Folder>>(); // v-model

const folderRepo = useRepo(FolderRepo);

const openItems = ref<UUID[]>([]);

// Update open items if the 'openAt' prop changes
// -> runs immediately on component load
watch(
	() => props.openAt,
	(target) => {
		openItems.value = target ? folderRepo.getHierarchy(target).map((f) => f.id) : [];
		// Set the selected item to the openAt value
		selected.value = target;
	},
	{ immediate: true }
);

// Clear the selected value if it is under closed items
watch(openItems, () => {
	if (selected.value && !openItems.value.includes(selected.value.id)) selected.value = undefined;
});
</script>

<style scoped>
.icon-color {
	color: rgb(var(v-theme-surface));
}
</style>
