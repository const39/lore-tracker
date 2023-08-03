<template>
	<v-tabs v-model="activeTab" color="accent" fixed-tabs>
		<v-tab
			v-for="tab in tabs"
			:key="tab"
			:to="{ name: 'LoreBook', params: { campaignId: campaign.id, category: tab } }"
		>
			<v-icon :icon="Icon[tab]" start />
			{{ $t(`categories.${tab}`) }}
		</v-tab>
	</v-tabs>
	<v-window v-model="activeTab">
		<v-window-item v-for="(tab, i) in tabs" :key="tab">
			<!-- Only render the active tab to avoid multiple co-existing renders of the tab content -->
			<v-container v-if="i === activeTab">
				<template v-if="!alertState.isShown">
					<!-- Safe-guard - Breadcrumbs cannot be shown if there's no current folder -->
					<FolderBreadcrumbs v-if="folder" :folder="folder" />
					<!-- Type casts are necessary because of https://github.com/vuejs/core/issues/2981 -->
					<FoldersArea
						v-model:selected="selectedFolders"
						:items="(folders as Folder[])"
						:campaign="campaign"
						:category="category"
						:folder-id="folder?.id"
						:loading="loading"
						:disable-actions="filterStore.isFilterActive"
						@dragstart="onDragStart"
					/>
					<FilesArea
						v-model:selected="selectedFiles"
						:items="(files as LoreEntry[])"
						:campaign="campaign"
						:category="category"
						:folder-id="folder?.id"
						:loading="loading"
						:disable-actions="filterStore.isFilterActive"
						@dragstart="onDragStart"
					/>
				</template>
				<!-- Display alert in case folder does not exist -->
				<v-alert v-else v-bind="alertState" variant="tonal">
					<router-link
						:to="{
							name: 'LoreBook',
							params: { campaignId: campaign.id, category },
						}"
					>
						{{ $t("messages.errors.files.folderNotFound.action") }}
					</router-link>
				</v-alert>
			</v-container>
		</v-window-item>
	</v-window>

	<!-- Custom drag image used when dragging cards -->
	<CardDragImage ref="dragImage" :items="selectedItems" />
</template>

<script lang="ts" setup>
import { onKeyDown } from "@vueuse/core";
import { useRepo } from "pinia-orm";
import { computed, ref, watch } from "vue";
import CardDragImage from "@/components/cards/CardDragImage.vue";
import FilesArea from "@/components/layout/content/FilesArea.vue";
import FolderBreadcrumbs from "@/components/layout/content/FolderBreadcrumbs.vue";
import FoldersArea from "@/components/layout/content/FoldersArea.vue";
import { useAlert } from "@/composables/alert";
import { CustomMIMEType, DragItem, startDrag } from "@/composables/dragAndDrop";
import { Campaign, Category, Folder, LoreEntry } from "@/core/models";
import { FolderRepo } from "@/core/repositories";
import { t as $t } from "@/core/translation";
import { defer } from "@/core/utils/functions";
import { Icon } from "@/core/utils/icons";
import { Maybe } from "@/core/utils/types";
import { useFilterStore } from "@/store/filter";

const props = defineProps<{
	campaign: Campaign;
	category: Category;
	folder: Maybe<Folder>;
}>();

const tabs = Object.values(Category);

const folderRepo = useRepo(FolderRepo);

const filterStore = useFilterStore();
const { alertState, setError, resetAlert } = useAlert();

const activeTab = ref(0);
const loading = ref(false);
const dragImage = ref<HTMLElement | null>(null);

const folders = ref<Folder[]>([]);
const files = ref<LoreEntry[]>([]);

// Note: the 'selected...' refs below are not strictly typed because of https://github.com/vuejs/core/issues/2981
const selectedFolders = ref([]); // Expected type: Folder[]
const selectedFiles = ref([]); // Expected type: LoreEntry[]

const selectedItems = computed<Array<Folder | LoreEntry>>(() => [
	...selectedFolders.value,
	...selectedFiles.value,
]);

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
			folders.value = filterStore.filterFolders(props.campaign, props.category);
			files.value = filterStore.filterLoreEntries(props.campaign, props.category);
		} else if (props.folder) {
			folders.value = folderRepo.getSubfolders(props.folder);
			files.value = folderRepo.getFiles(props.folder);
		} else {
			setError($t("messages.errors.files.folderNotFound.title"));
		}
	});

	loading.value = false;
}

// Trigger update on props or filter rules change
watch([() => props, () => filterStore.rules], updateItems, { deep: true, immediate: true });

/**
 * Callback triggered when the user grabs the cards for a drag & drop
 */
function onDragStart(e: DragEvent) {
	const items: DragItem[] = selectedItems.value.map((item) => ({
		data: item,
		dataType: item instanceof Folder ? CustomMIMEType.Folder : CustomMIMEType.LoreEntry,
	}));

	startDrag(e, items, {
		dragImage: { image: dragImage, offsetX: -12, offsetY: -8 },
	});
}

/**
 * Register tab hotkeys:
 * - Alt+1 : Show Quest tab
 * - Alt+2 : Show Event tab
 * - Alt+3 : Show Location tab
 * - Alt+4 : Show Character tab
 * - Alt+5 : Show Faction tab
 * - Alt+6 : Show Note tab
 */
onKeyDown(
	Array.from({ length: tabs.length }, (v, idx) => (idx + 1).toString()), // Register listener for each tab
	(e) => {
		if (e.altKey) {
			const num = Number.parseInt(e.key);
			if (num >= 1 && num <= tabs.length) {
				e.preventDefault();
				activeTab.value = num - 1;
			}
		}
	}
);
</script>
