<template>
	<v-container>
		<template v-if="!alertState.isShown">
			<FolderBreadcrumbs />
			<FoldersArea />
			<FilesArea />
		</template>
		<v-alert v-else variant="tonal" v-bind="alertState">
			<router-link :to="{ name: 'LoreBookTab', params: { category } }">
				{{ $t("messages.errors.folderNotFound.message") }}
			</router-link>
		</v-alert>
	</v-container>
</template>

<script lang="ts" setup>
import { watch } from "vue";
import { useAlert } from "@/composables/alert";
import { CardCategory } from "@/core/model/cards";
import { Path } from "@/core/model/fileTree";
import { t as $t } from "@/core/translation";
import { useCardsStore } from "@/store/cards";
import FilesArea from "./FilesArea.vue";
import FolderBreadcrumbs from "./FolderBreadcrumbs.vue";
import FoldersArea from "./FoldersArea.vue";

const props = defineProps<{ category: CardCategory; folderPath?: Path }>();

const cardsStore = useCardsStore();

const { alertState, setError, resetAlert } = useAlert();

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
</script>
