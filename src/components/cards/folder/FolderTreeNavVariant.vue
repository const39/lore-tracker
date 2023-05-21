<template>
	<FolderTree
		v-model="selected"
		:root-folders="rootFolders"
		:open-at="openAt"
		:title="$t('sidePanel.folderList')"
		@close="close"
	>
		<template #action="{ props: actionProps }">
			<v-btn
				v-bind="actionProps"
				prepend-icon="mdi-folder-open"
				color="primary"
				@click="openFolder"
			>
				{{ $t("sidePanel.openFolder") }}
			</v-btn>
		</template>
	</FolderTree>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { CardCategory, CardFolder } from "@/core/model/cards";
import { t as $t } from "@/core/translation";
import { useCardsStore } from "@/store/cards";
import { useSidePanel } from "@/store/sidePanel";
import FolderTree from "./FolderTree.vue";

const props = defineProps<{
	openAt?: CardFolder;
}>();

const router = useRouter();
const cardsStore = useCardsStore();
const sidePanelStore = useSidePanel();

const selected = ref<CardFolder>();

const rootFolders = computed(() => {
	return Object.values(CardCategory).map((cat) => cardsStore.getCategoryFolder(cat));
});

function openFolder(): void {
	if (selected.value) {
		router.push({
			params: {
				category: selected.value.metadata._category,
				folderURI: [...selected.value.absolutePath.rawSegments],
			},
		});
	}
	close();
}

function close() {
	sidePanelStore.resetFolderTree();
}
</script>
