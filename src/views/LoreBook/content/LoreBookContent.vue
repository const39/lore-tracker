<template>
	<v-row>
		<v-slide-x-transition mode="in-out">
			<v-col v-if="currentFolder && sidePanel.isOpen" v-bind="cols">
				<SidePanel :current-folder="currentFolder" />
			</v-col>
		</v-slide-x-transition>
		<v-col cols="">
			<LayoutTabs :category="category" :current-folder="currentFolder" />
		</v-col>
	</v-row>
</template>

<script lang="ts" setup>
import { useRepo } from "pinia-orm";
import { computed } from "vue";
import { Category } from "@/core/models";
import { FolderRepo } from "@/core/repositories";
import { UUID } from "@/core/utils/types";
import { useSidePanel } from "@/store/sidePanel";
import LayoutTabs from "./LayoutTabs.vue";
import SidePanel from "./SidePanel.vue";

const props = defineProps<{ category: Category; folderId?: UUID }>();

const folderRepo = useRepo(FolderRepo);

const sidePanel = useSidePanel();

const cols = computed(() => {
	const base = sidePanel.state?.status === "file-form" ? 4 : 3;
	return { xs: 12, sm: 12, md: 12, lg: base };
});

// Current folder is either:
// - the folder with the specified ID
// - the current category's root folder if no ID is given
const currentFolder = computed(() => {
	// Load the folder with its relations to enable Vue to track changes to its files/subfolders and re-run this computed property
	return props.folderId
		? folderRepo.getFolder(props.folderId, props.category, { withRelations: true })
		: folderRepo.getRootFolder(props.category, { withRelations: true });
});
</script>
