<template>
	<FolderTree
		v-model="selected"
		:root-folders="rootFolders"
		:open-at="currentFolder"
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
import { Campaign, Folder } from "@/core/models";
import { CampaignRepo } from "@/core/repositories";
import { t as $t } from "@/core/translation";
import FolderTree from "./FolderTree.vue";

const props = defineProps<{
	campaign: Campaign;
	currentFolder: Folder;
}>();

const emit = defineEmits(["close", "submit"]);

const router = useRouter();

const campaignRepo = useRepo(CampaignRepo);

const selected = ref<Folder>();

const rootFolders = computed(() => campaignRepo.getRootFolders(props.campaign));

function openFolder(): void {
	if (selected.value) {
		const { category, id } = selected.value;
		router.push({ params: { category, folderId: id } });
	}
	emit("submit");
}
</script>
