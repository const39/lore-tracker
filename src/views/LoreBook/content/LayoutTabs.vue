<template>
	<v-tabs v-model="activeTab" color="accent" fixed-tabs>
		<v-tab
			v-for="tab in tabs"
			:key="tab"
			:to="{ name: 'LoreBookTab', params: { category: tab } }"
		>
			<v-icon :icon="Icon[tab]" start />
			{{ $t(`categories.${tab}`) }}
		</v-tab>
	</v-tabs>
	<v-window v-model="activeTab">
		<v-window-item v-for="(tab, i) in tabs" :key="tab">
			<!-- Only render the active tab to avoid multiple co-existing renders of the tab content -->
			<v-container v-if="i === activeTab">
				<!-- Safe-guard - Ensure current folder exists before showing content -->
				<template v-if="currentFolder && !alertState.isShown">
					<FolderBreadcrumbs :current-folder="currentFolder" />
					<!-- Type casts are necessary because of https://github.com/vuejs/core/issues/2981 -->
					<FoldersArea
						:items="(folders as Folder[])"
						:category="category"
						:folder-id="currentFolder.id"
						:loading="loading"
						:disable-actions="filterStore.isFilterActive"
					/>
					<FilesArea
						:items="(files as LoreEntry[])"
						:category="category"
						:folder-id="currentFolder.id"
						:loading="loading"
						:disable-actions="filterStore.isFilterActive"
					/>
				</template>
				<!-- Display alert in case folder does not exist -->
				<v-alert v-else v-bind="alertState" variant="tonal">
					<router-link
						:to="{
							name: 'LoreBookTab',
							params: { category },
						}"
					>
						{{ $t("messages.errors.files.folderNotFound.action") }}
					</router-link>
				</v-alert>
			</v-container>
		</v-window-item>
	</v-window>
</template>

<script lang="ts" setup>
import { onKeyDown } from "@vueuse/core";
import { useRepo } from "pinia-orm";
import { computed, ref, watch } from "vue";
import FilesArea from "@/components/layout/content/FilesArea.vue";
import FolderBreadcrumbs from "@/components/layout/content/FolderBreadcrumbs.vue";
import FoldersArea from "@/components/layout/content/FoldersArea.vue";
import { useAlert } from "@/composables/alert";
import eventBus from "@/core/eventBus";
import { Category, Folder, LoreEntry } from "@/core/models";
import { FolderRepo } from "@/core/repositories";
import { t as $t } from "@/core/translation";
import { defer } from "@/core/utils/functions";
import { Icon } from "@/core/utils/icons";
import { UUID } from "@/core/utils/types";
import { useFilterStore } from "@/store/filter";

const props = defineProps<{ category: Category; folderId?: UUID }>();

const tabs = Object.values(Category);

const activeTab = ref(0);
const loading = ref(false);

const folders = ref<Folder[]>([]);
const files = ref<LoreEntry[]>([]);

const filterStore = useFilterStore();
const { alertState, setError, resetAlert } = useAlert();

const folderRepo = useRepo(FolderRepo);

// Current folder is either:
// - the folder with the specified ID
// - the current category's root folder if no ID is given
const currentFolder = computed(() => {
	return props.folderId
		? folderRepo.getFolder(props.folderId, props.category)
		: folderRepo.getRootFolder(props.category);
});

/**
 * Update the current folders and files to display based.
 */
async function updateItems() {
	resetAlert();
	loading.value = true;

	// Defer function to run it asynchronously
	await defer(() => {
		// - If a filter is active, display the search results
		// - If the current URL resolves to a folder, display its content
		// - Otherwise, display an error message because no folder can be displayed
		if (filterStore.isFilterActive) {
			folders.value = filterStore.filterFolders(props.category);
			files.value = filterStore.filterLoreEntries(props.category);
		} else if (currentFolder.value) {
			folders.value = folderRepo.getSubfolders(currentFolder.value);
			files.value = folderRepo.getFiles(currentFolder.value);
		} else {
			setError($t("messages.errors.files.folderNotFound.title"));
		}
	});

	loading.value = false;
}

// Trigger update on new save load
eventBus.on((e) => {
	if (e === "data-loaded") updateItems();
});

// Trigger update on props or filter rules change
watch([() => props, () => filterStore.rules], updateItems, { deep: true, immediate: true });

// Register hotkeys
onKeyDown(
	Array.from({ length: tabs.length }, (v, idx) => (idx + 1).toString()), // Register listener for each tab
	hotkey
);

/**
 * Manage each column hot key :
 * - Alt+1 : Show Quest tab
 * - Alt+2 : Show Event tab
 * - Alt+3 : Show Location tab
 * - Alt+4 : Show Character tab
 * - Alt+5 : Show Faction tab
 * - Alt+6 : Show Note tab
 */
function hotkey(e: KeyboardEvent) {
	if (e.altKey) {
		const num = Number.parseInt(e.key);
		if (num >= 1 && num <= tabs.length) {
			e.preventDefault();
			activeTab.value = num - 1;
		}
	}
}
</script>
