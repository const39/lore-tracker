<template>
	<div class="group">
		<div class="header">
			<FolderTreeItem
				v-bind="props"
				v-model:selected="selected"
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
					v-for="subfolder in subfolders"
					:key="subfolder.id"
					v-model:selected="selected"
					v-model:opened="opened"
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
	folder: Folder;
	level: number;
	title?: string;
	disabled?: boolean | UUID[];
}>();

const selected = defineModel<Maybe<Folder>>("selected", { required: true }); // v-model:selected
const opened = defineModel<Maybe<UUID[]>>("opened", { required: true }); // v-model:opened

const folderRepo = useRepo(FolderRepo);

const subfolders = computed(() => folderRepo.getSubfolders(props.folder));
const hasChildren = computed(() => subfolders.value.length > 0);
const isOpened = computed(() => opened.value?.includes(props.folder.id));

const padding = computed(() => `padding-left: ${16 * (props.level ?? 0) || 8}px;`);

function isChildDisabled(child: Folder) {
	return Array.isArray(props.disabled) ? props.disabled.includes(child.id) : false;
}

function onToggle() {
	// If open, close it
	if (isOpened.value && opened.value) {
		const idx = opened.value.findIndex((x) => x === props.folder.id);
		if (idx !== -1) opened.value.splice(idx, 1);
	} else {
		// If closed, open it
		opened.value?.push(props.folder.id);
	}
}
</script>
