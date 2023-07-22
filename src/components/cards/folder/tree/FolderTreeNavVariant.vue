<template>
	<FolderTree
		v-model="selected"
		:root-folders="rootFolders"
		:open-at="appStore.currentFolder"
		:title="$t('sidePanel.folderList')"
		@close="$emit('close')"
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
import { useRepo } from "pinia-orm";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { Category, Folder } from "@/core/models";
import { FolderRepo } from "@/core/repositories";
import { t as $t } from "@/core/translation";
import { useAppStore } from "@/store/app";
import FolderTree from "./FolderTree.vue";

const emit = defineEmits(["close", "submit"]);

const appStore = useAppStore();
const router = useRouter();

const folderRepo = useRepo(FolderRepo);

const selected = ref<Folder>();

const rootFolders = computed(() => {
	return Object.values(Category).map((cat) => folderRepo.getRootFolder(cat));
});

function openFolder(): void {
	if (selected.value) {
		const { category, id } = selected.value;
		router.push({ params: { category, folderId: id } });
	}
	emit("submit");
}
</script>
