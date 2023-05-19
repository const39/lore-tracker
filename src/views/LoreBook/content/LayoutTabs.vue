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
				<template v-if="!alertState.isShown">
					<FolderBreadcrumbs />
					<FoldersArea />
					<FilesArea />
				</template>
				<!-- Display alert in case folder does not exist -->
				<v-alert v-else variant="tonal" v-bind="alertState">
					<router-link :to="{ name: 'LoreBookTab', params: { category } }">
						{{ $t("messages.errors.folderNotFound.message") }}
					</router-link>
				</v-alert>
			</v-container>
		</v-window-item>
	</v-window>
</template>

<script lang="ts" setup>
import { onKeyDown } from "@vueuse/core";
import { ref, watch } from "vue";
import FilesArea from "@/components/layout/content/FilesArea.vue";
import FolderBreadcrumbs from "@/components/layout/content/FolderBreadcrumbs.vue";
import FoldersArea from "@/components/layout/content/FoldersArea.vue";
import { useAlert } from "@/composables/alert";
import { Icon } from "@/core/icons";
import { CardCategory } from "@/core/model/cards";
import { Path } from "@/core/model/fileTree";
import { t as $t } from "@/core/translation";
import { useCardsStore } from "@/store/cards";

const props = defineProps<{ category: CardCategory; folderPath?: Path }>();

const cardsStore = useCardsStore();
const { alertState, setError, resetAlert } = useAlert();

const tabs = ref(Object.values(CardCategory));
const activeTab = ref(0);

watch(
	props,
	({ category, folderPath }) => {
		resetAlert();

		// Try to set current folder to the one given by vue-router based on URI
		// If this fails (i.e. this folder does not exist), display error message to user
		try {
			cardsStore.setCurrentFolder(category, folderPath);
		} catch (e) {
			console.error(e);
			setError($t("messages.errors.folderNotFound.title"));
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
