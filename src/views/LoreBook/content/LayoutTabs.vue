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
					<FoldersArea
						v-model="currentFolder"
						:category="cardsStore.currentCategory"
						:loading="loading"
						:disable-actions="filterStore.isFilterActive"
					/>
					<FilesArea
						v-model="currentFolder"
						:category="cardsStore.currentCategory"
						:loading="loading"
						:disable-actions="filterStore.isFilterActive"
					/>
				</template>
				<!-- Display alert in case folder does not exist -->
				<v-alert v-else variant="tonal" v-bind="alertState">
					<router-link :to="{ name: 'LoreBookTab', params: { category } }">
						{{ $t("messages.errors.files.folderNotFound.action") }}
					</router-link>
				</v-alert>
			</v-container>
		</v-window-item>
	</v-window>
</template>

<script lang="ts" setup>
import { onKeyDown, useDebounceFn } from "@vueuse/core";
import { ref, watch } from "vue";
import FilesArea from "@/components/layout/content/FilesArea.vue";
import FolderBreadcrumbs from "@/components/layout/content/FolderBreadcrumbs.vue";
import FoldersArea from "@/components/layout/content/FoldersArea.vue";
import { useAlert } from "@/composables/alert";
import eventBus from "@/core/eventBus";
import { Icon } from "@/core/icons";
import { CardCategory, CardFolder, createRootFolder } from "@/core/model/cards";
import { Path } from "@/core/model/fileTree";
import { t as $t } from "@/core/translation";
import { useCardsStore } from "@/store/cards";
import { useFilterStore } from "@/store/filter";

const props = defineProps<{ category: CardCategory; folderPath?: Path }>();

const cardsStore = useCardsStore();
const filterStore = useFilterStore();
const { alertState, setError, resetAlert } = useAlert();

const tabs = ref(Object.values(CardCategory));
const activeTab = ref(0);
const loading = ref(false);

const emptyFolder = createRootFolder(CardCategory.Quest); // use a dummy empty folder on initial page load to trigger loading states without using an undefined object
const currentFolder = ref<CardFolder>(emptyFolder);

const filterItems = useDebounceFn(() => filterStore.filter(cardsStore.currentFolder), 800);

function updateItems() {
	loading.value = true;

	const promise = filterStore.isFilterActive
		? new Promise<CardFolder>((resolve) => setTimeout(() => filterItems().then(resolve), 0))
		: Promise.resolve(cardsStore.currentFolder);

	promise.then((folder) => {
		// Safe-guard: Ensure folder is defined
		// -> because when the debounced function is cancelled by a new call, the promise returns undefined
		// @see https://vueuse.org/shared/useDebounceFn/#usage
		if (folder) {
			currentFolder.value = folder;
			loading.value = false;
		}
	});
}

// Trigger update on new save load
eventBus.on((e) => {
	if (e === "data-loaded") updateItems();
});

// Trigger update on filter rules change
watch(
	() => filterStore.rules,
	() => updateItems(),
	{ deep: true }
);

// Trigger update on navigation update (either category or folder path)
watch(
	props,
	({ category, folderPath }) => {
		resetAlert();
		// Try to set current folder to the one given by vue-router based on URI
		// If this fails (i.e. this folder does not exist), display error message to user
		try {
			cardsStore.setCurrentFolder(category, folderPath);
			updateItems();
		} catch (e) {
			console.error(e);
			setError($t("messages.errors.files.folderNotFound.title"));
		}
	},
	{ immediate: true }
);

// Register hotkeys
onKeyDown(
	Array.from({ length: tabs.value.length }, (v, idx) => (idx + 1).toString()), // Register listener for each tab
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
		if (num >= 1 && num <= tabs.value.length) {
			e.preventDefault();
			activeTab.value = num - 1;
		}
	}
}
</script>
