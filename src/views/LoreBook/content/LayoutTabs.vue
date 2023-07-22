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
				<template v-if="appStore.currentCategory && appStore.currentFolder">
					<FolderBreadcrumbs :current-folder="appStore.currentFolder" />
					<FoldersArea
						:items="appStore.currentFolder.subfolders"
						:category="appStore.currentCategory"
						:folder-id="appStore.currentFolder.id"
						:loading="loading"
						:disable-actions="filterStore.isFilterActive"
					/>
					<FilesArea
						:items="appStore.currentFolder.files"
						:category="appStore.currentCategory"
						:folder-id="appStore.currentFolder.id"
						:loading="loading"
						:disable-actions="filterStore.isFilterActive"
					/>
				</template>
				<!-- Display alert in case folder does not exist -->
				<v-alert
					v-else
					:title="$t('messages.errors.files.folderNotFound.title')"
					variant="tonal"
				>
					<router-link
						:to="{
							name: 'LoreBookTab',
							params: { category: appStore.currentCategory ?? Category.Quest },
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
import { onKeyDown, useDebounceFn } from "@vueuse/core";
import { ref, watch } from "vue";
import FilesArea from "@/components/layout/content/FilesArea.vue";
import FolderBreadcrumbs from "@/components/layout/content/FolderBreadcrumbs.vue";
import FoldersArea from "@/components/layout/content/FoldersArea.vue";
import eventBus from "@/core/eventBus";
import { CardCategory, CardFolder } from "@/core/model/cards";
import { Category } from "@/core/models";
import { t as $t } from "@/core/translation";
import { Icon } from "@/core/utils/icons";
import { useAppStore } from "@/store/app";
import { useCardsStore } from "@/store/cards";
import { useFilterStore } from "@/store/filter";

const appStore = useAppStore();
const cardsStore = useCardsStore();
const filterStore = useFilterStore();

const tabs = ref(Object.values(CardCategory));
const activeTab = ref(0);
const loading = ref(false);

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
