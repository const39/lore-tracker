<template>
	<div class="group">
		<div class="header">
			<FolderTreeItem
				v-bind="props"
				v-model:selected="selectModelValue"
				:style="padding"
				:disabled="disabled === true"
			>
				<template #prepend>
					<v-list-item-action>
						<v-btn
							:disabled="disabled === true || !hasChildren"
							:icon="isOpened ? 'mdi-menu-down' : 'mdi-menu-right'"
							variant="text"
							density="compact"
							@click="onToggle"
						/>
						<slot name="prepend" />
					</v-list-item-action>
				</template>
			</FolderTreeItem>
		</div>
		<v-slide-y-transition>
			<div v-show="isOpened && hasChildren" class="items">
				<FolderTreeGroup
					v-for="subfolder in folder.subfolders"
					:key="subfolder.id"
					v-model:selected="selectModelValue"
					v-model:opened="openModelValue"
					:folder="subfolder"
					:level="level + 1"
					:disabled="isChildDisabled(subfolder) ? true : disabled"
				/>
			</div>
		</v-slide-y-transition>
	</div>
</template>

<script lang="ts" setup>
import { useRepo } from "pinia-orm";
import { computed } from "vue";
import { Folder } from "@/core/models";
import { FolderRepo } from "@/core/repositories";
import { Maybe, UUID } from "@/core/utils/types";
import FolderTreeGroup from "./FolderTreeGroup.vue";
import FolderTreeItem from "./FolderTreeItem.vue";

const props = defineProps<{
	selected: Maybe<Folder>;
	opened: Maybe<UUID[]>;
	folder: Folder;
	level: number;
	title?: string;
	disabled?: boolean | UUID[];
}>();

const emit = defineEmits<{
	(e: "update:selected", value: typeof props.selected): void;
	(e: "update:opened", value: typeof props.opened): void;
}>();

const folderRepo = useRepo(FolderRepo);

const selectModelValue = computed({
	get() {
		return props.selected;
	},
	set(value) {
		emit("update:selected", value);
	},
});

const openModelValue = computed({
	get() {
		return props.opened;
	},
	set(value) {
		emit("update:opened", value);
	},
});

const hasChildren = computed(() => !!folderRepo.getSubfolders(props.folder).length);
const isOpened = computed(() => openModelValue.value?.includes(props.folder.id));

const padding = computed(() => `padding-left: ${16 * (props.level ?? 0) || 8}px;`);

function isChildDisabled(child: Folder) {
	return Array.isArray(props.disabled) ? props.disabled.includes(child.id) : false;
}

function onToggle() {
	// If open, close it
	if (isOpened.value && openModelValue.value) {
		const idx = openModelValue.value.findIndex((x) => x === props.folder.id);
		if (idx !== -1) openModelValue.value.splice(idx, 1);
	} else {
		// If closed, open it
		openModelValue.value?.push(props.folder.id);
	}
}
</script>
